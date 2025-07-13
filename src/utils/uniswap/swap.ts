import { CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { FeeAmount, Pool, Route, SwapQuoter } from "@uniswap/v3-sdk";
import { ethers, providers, utils } from "ethers";
import { PoolInfo, getPoolInfo } from "./pool";
import { getAddress, getProvider } from "../wallet";
import { CoinData, NetworkData } from "../types";
import {
  beautifyNumber,
  convertCoinAmountToDecimal,
  convertCoinAmountToInt,
  getNetworkData,
  noExponents,
} from "../corefunctions";
import { getTokenTransferApproval } from "../eth/erc20";
import SwapRouterABI from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";
import QuoterABI from "@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoter.sol/IQuoter.json";
import { unwrapWETH, wrapETH } from "../eth/weth";
import { COIN_SLUG } from "../network/coin-data";
import { AbiCoder } from "ethers/lib/utils";
import { UNIVERSAL_ROUTER_ABI } from "./abi";
import { UNIVERSAL_CMD, UNIVERSAL_CONST } from "./constants";
import { getSlippageMinAmount } from "./helpers";

async function processPoolData(
  inCoin: CoinData,
  outCoin: CoinData,
  network_data: NetworkData,
): Promise<Pool[]> {
  try {
    const poolInfo = await getPoolInfo(
      network_data,
      inCoin.token_info,
      outCoin.token_info,
    );
    const pool = new Pool(
      inCoin.token_info,
      outCoin.token_info,
      poolInfo.fee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick,
    );
    return [pool];
  } catch (e) {
    if (!String(e.message).includes("No pool available")) {
      throw e;
    }

    const pools: Pool[] = [];
    const weth = network_data.coin_or_token[COIN_SLUG.WETH];
    const pool1Info = await getPoolInfo(
      network_data,
      inCoin.token_info,
      weth.token_info,
    );
    // console.log("pool1Info: ", pool1Info);

    const pool1 = new Pool(
      inCoin.token_info,
      weth.token_info,
      pool1Info.fee,
      pool1Info.sqrtPriceX96.toString(),
      pool1Info.liquidity.toString(),
      pool1Info.tick,
    );
    pools.push(pool1);

    const pool2Info = await getPoolInfo(
      network_data,
      outCoin.token_info,
      weth.token_info,
    );
    // console.log("pool2Info: ", pool2Info);

    const pool2 = new Pool(
      outCoin.token_info,
      weth.token_info,
      pool2Info.fee,
      pool2Info.sqrtPriceX96.toString(),
      pool2Info.liquidity.toString(),
      pool2Info.tick,
    );
    pools.push(pool2);

    return pools;
  }
}

export async function getConvertedAmount(
  inCoin: CoinData,
  outCoin: CoinData,
  inAmount: number,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<{
  converted_amount: number;
  raw_conv_amount: string;
  pool_fee: number;
  path: string;
}> {
  if (inCoin.basic.code == outCoin.basic.code) {
    throw new Error("Invalid same in and out coin");
  }

  provider = provider ?? getProvider();
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  network_data = network_data ?? (await getNetworkData(provider));

  if (
    (inCoin.is_native || outCoin.is_native) &&
    (inCoin.is_native_wrap || outCoin.is_native_wrap)
  ) {
    return {
      converted_amount: inAmount,
      raw_conv_amount: "0",
      pool_fee: 0,
      path: "",
    };
  }

  const pools = await processPoolData(inCoin, outCoin, network_data);

  const quoterContract = new ethers.Contract(
    network_data.contract.quoter_v3.address,
    QuoterABI.abi,
    provider,
  );

  const tokensPath = [
    inCoin.token_info.address,
    pools[0].fee,
    outCoin.token_info.address,
  ];
  if (pools.length > 1) {
    const weth = network_data.coin_or_token[COIN_SLUG.WETH];
    tokensPath[2] = weth.token_info.address;
    tokensPath.push(pools[1].fee);
    tokensPath.push(outCoin.token_info.address);
  }
  // console.log("tokensPath: ", tokensPath);

  // Concatenate the values of tokensPath
  let encodedPath = "0x";
  tokensPath.forEach((value, idx) => {
    // if address Remove '0x' prefix and if fee make it hex of length 6 with zero(0) filled
    const bytes =
      (idx + 1) % 2 != 0
        ? String(value).slice(2)
        : Number(value).toString(16).padStart(6, "0");
    encodedPath += bytes;
  });
  // console.log("encodedPath: ", encodedPath);

  const data = await quoterContract.callStatic.quoteExactInput(
    encodedPath,
    convertCoinAmountToInt(inAmount, inCoin.token_info.decimals).toString(),
  );

  const raw_conv_amount = noExponents(Number(data));

  const outAmount = convertCoinAmountToDecimal(
    Number(data),
    outCoin.token_info.decimals,
    6,
  );

  return {
    converted_amount: Number(outAmount),
    raw_conv_amount,
    pool_fee: pools[0].fee,
    path: encodedPath,
  };
}

export async function executeSwap(
  fromCoin: CoinData,
  toCoin: CoinData,
  path: string,
  fromAmount: number | string,
  convertedToAmount: number | string,
  raw_conv_amount: string,
  setInfo?: (msg: string) => void,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<providers.TransactionReceipt> {
  if (fromCoin.basic.code == toCoin.basic.code) {
    throw new Error("Invalid same from and to coin");
  }

  provider = provider ?? getProvider();
  const walletAddress = await getAddress(provider);

  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a swap without a connected wallet");
  }

  const signer = provider.getSigner();
  network_data = network_data ?? (await getNetworkData(provider));

  if (!fromCoin.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      fromCoin.token_info,
      network_data.contract.swap_router.address,
      fromAmount,
      setInfo,
      network_data,
      provider,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  setInfo && setInfo("Swap process in progress...");

  if (
    (fromCoin.is_native || toCoin.is_native) &&
    (fromCoin.is_native_wrap || toCoin.is_native_wrap)
  ) {
    if (fromCoin.is_native) {
      setInfo && setInfo("Wait for transaction completion...");
      return await wrapETH(fromAmount, provider, network_data);
    } else if (toCoin.is_native) {
      setInfo && setInfo("Wait for transaction completion...");
      return await unwrapWETH(fromAmount, null, provider, network_data);
    }
  }

  const swapRouter = new ethers.Contract(
    network_data.contract.swap_router.address,
    SwapRouterABI.abi,
    signer,
  );

  const amountIn = convertCoinAmountToInt(
    fromAmount,
    fromCoin.token_info.decimals,
  );

  const amountOutMinimum = getSlippageMinAmount(
    Number(convertedToAmount),
    toCoin.token_info.decimals,
  );

  const calls = [];

  const swapParam = {
    // tokenIn: fromCoin.token_info.address,
    // tokenOut: toCoin.token_info.address,
    // fee: poolFee,
    // sqrtPriceLimitX96: 0,
    path: path,
    recipient: walletAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    amountIn: amountIn,
    amountOutMinimum: amountOutMinimum,
  };

  console.log("swapParam: ", swapParam);

  const swapCalldata = swapRouter.interface.encodeFunctionData("exactInput", [
    swapParam,
  ]);
  calls.push(swapCalldata);

  // if (toCoin.is_native) {
  //   const unwrapCalldata = swapRouter.interface.encodeFunctionData('unwrapWETH9', [
  //     rawconvAmount, walletAddress
  //   ]);
  //   calls.push(unwrapCalldata);
  // }

  const tx: providers.TransactionResponse = await swapRouter.multicall(calls, {
    value: fromCoin.is_native
      ? ethers.utils.parseEther(String(fromAmount))
      : undefined,
  });

  setInfo && setInfo("Wait for transaction completion...");
  const txReceipt = await tx.wait();

  if (toCoin.is_native) {
    if (setInfo) {
      setInfo("Need to unwrap WETH to ETH!! Confirm the transaction.");
      setTimeout(() => setInfo(""), 10000);
    }
    const convertedAmount = txReceipt.logs[0].data;
    // console.log('convertedAmount: ', convertedAmount);
    await unwrapWETH(null, convertedAmount, provider, network_data);
  }
  // setInfo && setInfo('Congratulations!! Swap Successful');
  return txReceipt;
}

/* not for use yet */
export async function executeSwapUniversalRouter(
  fromCoin: CoinData,
  toCoin: CoinData,
  path: string,
  fromAmount: number | string,
  raw_conv_amount: string,
  setInfo?: (msg: string) => void,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<providers.TransactionReceipt> {
  if (fromCoin.basic.code == toCoin.basic.code) {
    throw new Error("Invalid same from and to coin");
  }

  provider = provider ?? getProvider();
  const walletAddress = await getAddress(provider);

  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a swap without a connected wallet");
  }

  const signer = provider.getSigner();
  network_data = network_data ?? (await getNetworkData(provider));

  if (!fromCoin.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      fromCoin.token_info,
      network_data.contract.swap_router.address,
      fromAmount,
      setInfo,
      network_data,
      provider,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  setInfo && setInfo("Swap process in progress...");

  if (
    (fromCoin.is_native || toCoin.is_native) &&
    (fromCoin.is_native_wrap || toCoin.is_native_wrap)
  ) {
    if (fromCoin.is_native) {
      setInfo && setInfo("Wait for transaction completion...");
      return await wrapETH(fromAmount, provider, network_data);
    } else if (toCoin.is_native) {
      setInfo && setInfo("Wait for transaction completion...");
      return await unwrapWETH(fromAmount, null, provider, network_data);
    }
  }

  const universalRouter = new ethers.Contract(
    network_data.contract.universal_router.address,
    UNIVERSAL_ROUTER_ABI,
    signer,
  );

  const amountIn = convertCoinAmountToInt(
    fromAmount,
    fromCoin.token_info.decimals,
  );

  // const slippagePercent = 10;
  // const toAmountDeductingSlippage = Number(toAmount) - (Number(toAmount) * slippagePercent / 100);
  // const amountOutMinimum = convertCoinAmountToInt(toAmountDeductingSlippage, toCoin.token_info.decimals);
  // const amountOutMinimum = convertCoinAmountToInt(toAmount, toCoin.token_info.decimals);
  // const amountOutMinimum = rawconvAmount;

  const calls = [];

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

  const abiCoder = new AbiCoder();
  let commands = "0x";
  let recipient = UNIVERSAL_CONST.MSG_SENDER_ADDRESS;
  const inputs = [];

  if (fromCoin.is_native) {
    commands += UNIVERSAL_CMD.WRAP_ETH.replace("0x", "");
    const encodedInput = abiCoder.encode(
      ["address", "uint"],
      [UNIVERSAL_CONST.THIS_CONTRACT_ADDRESS, amountIn],
    );
    inputs.push(encodedInput);
  }

  commands += UNIVERSAL_CMD.V3_SWAP_EXACT_IN.replace("0x", "");

  if (toCoin.is_native) {
    recipient = UNIVERSAL_CONST.THIS_CONTRACT_ADDRESS;
    commands += UNIVERSAL_CMD.UNWRAP_WETH.replace("0x", "");
    const encodedInput = abiCoder.encode(
      ["address", "uint"],
      [UNIVERSAL_CONST.MSG_SENDER_ADDRESS, raw_conv_amount],
    );
    inputs.push(encodedInput);
  }

  const swap_input = [recipient, amountIn, 0, path, true];

  const tx: providers.TransactionResponse = await universalRouter.execute(
    calls,
    {
      value: fromCoin.is_native
        ? ethers.utils.parseEther(String(fromAmount))
        : undefined,
    },
  );

  setInfo && setInfo("Wait for transaction completion...");
  const txReceipt = await tx.wait();

  if (toCoin.is_native) {
    if (setInfo) {
      setInfo("Need to unwrap WETH to ETH!! Confirm the transaction.");
      setTimeout(() => setInfo(""), 10000);
    }
    const convertedAmount = txReceipt.logs[0].data;
    // console.log('convertedAmount: ', convertedAmount);
    await unwrapWETH(null, convertedAmount, provider, network_data);
  }
  // setInfo && setInfo('Congratulations!! Swap Successful');
  return txReceipt;
}

export async function getConvertedAmountUsingSdk(
  inCoin: CoinData,
  outCoin: CoinData,
  inAmount: number,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<{
  converted_amount: number;
  raw_conv_amount: string;
  pool_fee: number;
  path?: "";
}> {
  if (inCoin.basic.code == outCoin.basic.code) {
    throw new Error("Invalid same in and out coin");
  }

  provider = provider ?? getProvider();
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  network_data = network_data ?? (await getNetworkData(provider));

  if (
    (inCoin.is_native || outCoin.is_native) &&
    (inCoin.is_native_wrap || outCoin.is_native_wrap)
  ) {
    return { converted_amount: inAmount, raw_conv_amount: "0", pool_fee: 0 };
  }

  // const pools = await processPoolData(inCoin, outCoin, network_data);
  const poolInfo = await getPoolInfo(
    network_data,
    inCoin.token_info,
    outCoin.token_info,
  );

  const pool = new Pool(
    inCoin.token_info,
    outCoin.token_info,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  );
  const pools = [pool];

  const swapRoute = new Route(pools, inCoin.token_info, outCoin.token_info);

  const { calldata } = SwapQuoter.quoteCallParameters(
    swapRoute,
    CurrencyAmount.fromRawAmount(
      inCoin.token_info,
      convertCoinAmountToInt(inAmount, inCoin.token_info.decimals).toString(),
    ),
    TradeType.EXACT_INPUT,
  );

  const quoteCallReturnData = await provider.call({
    to: network_data.contract.quoter_v3.address,
    data: calldata,
  });

  const data = ethers.utils.defaultAbiCoder.decode(
    ["uint256"],
    quoteCallReturnData,
  );
  const raw_conv_amount = noExponents(Number(data));

  const outAmount = convertCoinAmountToDecimal(
    Number(data),
    outCoin.token_info.decimals,
    6,
  );

  return {
    converted_amount: Number(outAmount),
    raw_conv_amount,
    pool_fee: pools[0].fee,
  };
}
/*  */
