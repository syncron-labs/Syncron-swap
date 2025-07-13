import { BigNumber, ethers, providers } from "ethers";
import { getAddress, getProvider } from "../wallet";
import NonfungiblePositionManagerABI from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { CoinData, NetworkData } from "../types";
import {
  calculatePercentRatio,
  convertCoinAmountToDecimal,
  convertCoinAmountToInt,
  empty,
  formatAmountKnL,
  getNetworkData,
  getTokenByAddress,
  noExponents,
  sortObjectArray,
} from "../corefunctions";
import { Pool, Position } from "@uniswap/v3-sdk";
import { getPriceFromTick } from "./maths";
import {
  getPrice,
  getSlippageMinAmount,
  getSqrtPx96,
  parseTokenURItoJson,
} from "./helpers";
import { Token } from "@uniswap/sdk-core";
import {
  INFINITY_TEXT,
  LIQUIDITY_PRICE_RANGE,
  ORDER_DIRECTION,
} from "../coreconstants";
import { getPoolInfo } from "./pool";
import { getTokenTransferApproval } from "../eth/erc20";

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);

export interface PositionInfo {
  tokenId: number | string;
  tickLower: number;
  tickUpper: number;
  token0Address: string;
  token1Address: string;
  token0: Token;
  token1: Token;
  fee: number;
  liquidity: BigNumber | string;
  feeGrowthInside0LastX128: BigNumber | number | string;
  feeGrowthInside1LastX128: BigNumber | number | string;
  tokensOwed0: BigNumber | number | string;
  tokensOwed1: BigNumber | number | string;
  minPrice: number | string;
  maxPrice: number | string;
  currentPrice: number;
  inRange: boolean;
  closed: boolean;
  owner: string;
  other_details?: PositionOtherDetails;
}

export interface PositionOtherDetails {
  token0Amount: number;
  token1Amount: number;
  token0AmountPercent: number;
  token1AmountPercent: number;
  token0UnclaimedFee: number;
  token1UnclaimedFee: number;
  tokenURI: string;
  imgSrc: string;
}

export async function getPositions(
  provider?: ethers.providers.Web3Provider,
  network_data?: NetworkData,
): Promise<PositionInfo[]> {
  provider = provider ?? getProvider();
  const address = await getAddress(provider);

  if (!provider || !address) {
    throw new Error("No provider or address available");
  }

  // console.log('provider: ', provider._network.chainId);
  network_data = network_data ?? (await getNetworkData(provider));

  const positionContract = new ethers.Contract(
    network_data.contract.nonfungible_position_manager.address,
    NonfungiblePositionManagerABI.abi,
    provider,
  );

  const balance: number = await positionContract.balanceOf(address);

  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const tokenOfOwnerByIndex: number =
      await positionContract.tokenOfOwnerByIndex(address, i);
    tokenIds.push(Number(tokenOfOwnerByIndex));
  }

  let positions: PositionInfo[] = [];
  for (let i = 0; i < tokenIds.length; i++) {
    try {
      const pos = await getPositionInfo(tokenIds[i], provider, network_data);
      positions.push(pos);
    } catch (e) {
      console.log(`tokenId (${tokenIds[i]}) Err: ${e.message}`);
    }
  }

  positions = sortObjectArray("closed", ORDER_DIRECTION.ASC, positions);

  return positions;
}

export async function getPositionInfo(
  token_id: number | string,
  provider?: ethers.providers.Web3Provider,
  network_data?: NetworkData,
  include_amount_details = false,
  include_token_img = false,
): Promise<PositionInfo> {
  provider = provider ?? getProvider();

  if (!provider) {
    throw new Error("No provider available");
  }

  network_data = network_data ?? (await getNetworkData(provider));

  const positionContract = new ethers.Contract(
    network_data?.contract.nonfungible_position_manager?.address,
    NonfungiblePositionManagerABI?.abi,
    provider,
  );

  const data = await positionContract.positions(token_id);

  // console.log('position 1: ', data);

  let position: PositionInfo = {
    token0Address: data.token0,
    token1Address: data.token1,
    tickLower: data.tickLower,
    tickUpper: data.tickUpper,
    tokensOwed0: data.tokensOwed0,
    tokensOwed1: data.tokensOwed1,
    fee: data.fee,
    feeGrowthInside0LastX128: data.feeGrowthInside0LastX128,
    feeGrowthInside1LastX128: data.feeGrowthInside1LastX128,
    liquidity: data.liquidity,
    tokenId: token_id,
    owner: await positionContract.ownerOf(token_id),
    minPrice: "",
    maxPrice: "",
    currentPrice: 0,
    inRange: false,
    closed: data.liquidity == 0,
    token0: null,
    token1: null,
  };

  // console.log('position 2: ', position);

  position = await getPosULCPrice(network_data, position);

  if (include_amount_details) {
    position = await getPositionAmounts(network_data, position);
  }
  if (include_token_img) {
    try {
      position.other_details.tokenURI =
        await positionContract.tokenURI(token_id);
      position.other_details.imgSrc = parseTokenURItoJson(
        position.other_details.tokenURI,
      ).image;
    } catch (e) {
      // console.error(`Can't fetch tokenURI!! ${e.message}`);
    }
  }
  return position;
}

// upper, lower and current price ULC
async function getPosULCPrice(
  network_data: NetworkData,
  position: PositionInfo,
): Promise<PositionInfo> {
  const token0 = getTokenByAddress(network_data, position.token0Address);
  const token1 = getTokenByAddress(network_data, position.token1Address);
  if (!token0 || !token1) {
    throw new Error("This Position's Tokens are not available in our system");
  }

  position.token0 = token0;
  position.token1 = token1;

  position.maxPrice = getPriceFromTick(
    Number(position.tickUpper),
    position.token0.decimals,
    position.token1.decimals,
  );
  position.minPrice = getPriceFromTick(
    Number(position.tickLower),
    position.token0.decimals,
    position.token1.decimals,
  );

  position.currentPrice = await getPrice({
    network_data: network_data,
    fromToken: token0,
    toToken: token1,
    fee: position.fee,
  });

  if (
    position.currentPrice >= Number(position.minPrice) &&
    position.currentPrice <= Number(position.maxPrice)
  ) {
    position.inRange = true;
  }

  // if (position.tickLower == LIQUIDITY_PRICE_RANGE[position.fee].min_tick) {
  //   position.minPrice = 0;
  // }

  // if (position.tickUpper == LIQUIDITY_PRICE_RANGE[position.fee].max_tick) {
  //   position.maxPrice = INFINITY_TEXT;
  // }

  return position;
}

async function getPositionAmounts(
  network_data: NetworkData,
  position: PositionInfo,
  provider?: ethers.providers.Web3Provider,
): Promise<PositionInfo> {
  provider = provider ?? getProvider();
  const positionContract = new ethers.Contract(
    network_data.contract.nonfungible_position_manager.address,
    NonfungiblePositionManagerABI.abi,
    provider,
  );
  // console.log('positionContract: ', positionContract.getFunction('collect'), '\n');

  const poolInfo = await getPoolInfo(
    network_data,
    position.token0,
    position.token1,
    position.fee,
  );
  // console.log('poolInfo: ', poolInfo, '\n');

  // construct pool instance
  const pool = new Pool(
    position.token0,
    position.token1,
    Number(poolInfo.fee),
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    Number(poolInfo.tick),
  );

  const positionInfo = await positionContract.positions(position.tokenId);
  // console.log('positionInfo: ', positionInfo, '\n');

  const pos_data = new Position({
    pool: pool,
    liquidity: positionInfo.liquidity.toString(),
    tickLower: Number(positionInfo.tickLower),
    tickUpper: Number(positionInfo.tickUpper),
  });

  // console.log("pos_data: ", pos_data);

  // liquidity token amount
  // console.log("amount0:", pos_data.amount0.toSignificant(6));
  // console.log("amount1:", pos_data.amount1.toSignificant(6));

  /* GET ACCRUED UNCLAIMDED FEES */
  // callStatic simulates a call without state changes
  const results = await positionContract.callStatic.collect(
    {
      tokenId: position.tokenId,
      recipient: position.owner,
      amount0Max: MAX_UINT128,
      amount1Max: MAX_UINT128,
    },
    { from: position.owner },
  );
  // console.log("Fee0: ", parseFloat(results.amount0) / 100);
  // console.log("Fee1: ", parseFloat(results.amount1) / 100);

  const fee_token0 = convertCoinAmountToDecimal(
    results.amount0,
    position.token0.decimals,
  );
  const fee_token1 = convertCoinAmountToDecimal(
    results.amount1,
    position.token1.decimals,
  );

  // console.log("fee_token0: ", fee_token0.toString());
  // console.log("fee_token1: ", fee_token1.toString());

  const token0Amount = Number(
    pos_data.amount0.toSignificant(position.token0.decimals),
  );
  const token1Amount = Number(
    pos_data.amount1.toSignificant(position.token1.decimals),
  );
  // console.log({token0Amount, token1Amount});

  const percentRatio = calculatePercentRatio(
    token0Amount,
    (1 / position.currentPrice) * token1Amount,
  );
  position.other_details = <PositionOtherDetails>{
    token0Amount: token0Amount,
    token1Amount: token1Amount,
    token0AmountPercent: percentRatio.value1_percent,
    token1AmountPercent: percentRatio.value2_percent,
    token0UnclaimedFee: Number(fee_token0),
    token1UnclaimedFee: Number(fee_token1),
  };

  return position;
}

export function getConvertedAmountForLiqDeposit(
  coinA: CoinData,
  coinB: CoinData,
  priceAtoB: number,
  minPriceAtoB: number,
  maxPriceAtoB: number,
  amountA?: number,
  amountB?: number,
): { amountA: number; amountB: number } {
  if (empty(amountA) && empty(amountB)) {
    throw new Error("amountA or amountB must required");
  }

  if (amountA == 0 || amountB == 0) {
    return { amountA: 0, amountB: 0 };
  }

  const price = Number(priceAtoB);
  const price_low = Number(minPriceAtoB);
  const price_high = Number(maxPriceAtoB);

  if (price_low == price_high) {
    //no deposit amount needed for coinA, coinB
    // throw new Error("No deposit allowed of any token for this price range");
    return { amountA: 0, amountB: 0 };
  } else if (price < price_low) {
    //no deposit amount needed for coinB
    // throw new Error(
    //   `No deposit allowed of ${coinB.basic.code} for this price range`,
    // );
    return { amountA, amountB: 0 };
  } else if (price > price_high) {
    //no deposit amount needed for coinA
    // throw new Error(
    //   `No deposit allowed of ${coinA.basic.code} for this price range`,
    // );
    return { amountA: 0, amountB };
  }

  if (!amountB) {
    const Liquidity =
      (amountA * Math.sqrt(price) * Math.sqrt(price_high)) /
      (Math.sqrt(price_high) - Math.sqrt(price));
    // console.log('Liquidity: ', Liquidity);

    amountB = Liquidity * (Math.sqrt(price) - Math.sqrt(price_low));
  } else if (!amountA) {
    const Liquidity = amountB / (Math.sqrt(price) - Math.sqrt(price_low));
    // console.log('Liquidity: ', Liquidity);

    amountA =
      Liquidity /
      ((Math.sqrt(price) * Math.sqrt(price_high)) /
        (Math.sqrt(price_high) - Math.sqrt(price)));
  }

  // console.log("deposit amounts: ", { amountA, amountB });
  return { amountA, amountB };
}

export async function createAndAddLiquidity(
  coinA: CoinData,
  coinB: CoinData,
  poolFee: number,
  priceAtoB: number,
  amountA: number,
  amountB: number,
  tickLowerAtoB: number,
  tickUpperAtoB: number,
  setInfo?: (msg: string) => void,
  provider?: providers.Web3Provider,
  network_data?: NetworkData,
): Promise<providers.TransactionReceipt> {
  provider = provider ?? getProvider();
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  if (!walletAddress || !provider) {
    throw new Error("Cannot add liquidity without a connected wallet");
  }

  network_data = network_data ?? (await getNetworkData(provider));
  const postionContractAddress =
    network_data.contract.nonfungible_position_manager.address;

  if (!coinA.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      coinA.token_info,
      postionContractAddress,
      amountA,
      setInfo,
      network_data,
      provider,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  if (!coinB.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      coinB.token_info,
      postionContractAddress,
      amountB,
      setInfo,
      network_data,
      provider,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  const nftPositionManager = new ethers.Contract(
    postionContractAddress,
    NonfungiblePositionManagerABI.abi,
    signer,
  );
  // console.log('nftPositionManager: ', nftPositionManager.functions);

  const calls = [];

  const coin0 =
    coinA.token_info.address < coinB.token_info.address ? coinA : coinB;
  const coin1 =
    coinB.token_info.address > coinA.token_info.address ? coinB : coinA;

  const amount0 = coinA.basic.code == coin0.basic.code ? amountA : amountB;
  const amount1 = coinB.basic.code == coin1.basic.code ? amountB : amountA;

  // Prepare data for create new pool if not exists
  const sqrtP = noExponents(
    getSqrtPx96({
      fromToken: coinA.token_info,
      toToken: coinB.token_info,
      price: priceAtoB,
    }),
  );

  const createPoolParam = [
    coin0.token_info.address,
    coin1.token_info.address,
    poolFee,
    sqrtP,
  ];
  console.log("pool create param: ", createPoolParam);

  const calldata = nftPositionManager.interface.encodeFunctionData(
    "createAndInitializePoolIfNecessary",
    createPoolParam,
  );
  calls.push(calldata);

  // Prepare data for adding new position
  const { tickLower, tickUpper } = processTickUL(
    coinA,
    coinB,
    tickLowerAtoB,
    tickUpperAtoB,
  );
  const fee = poolFee;
  const amount0Desired = convertCoinAmountToInt(
    amount0,
    coin0.token_info.decimals,
  );
  const amount1Desired = convertCoinAmountToInt(
    amount1,
    coin1.token_info.decimals,
  );
  const amount0Min = getSlippageMinAmount(amount0, coin0.token_info.decimals);
  const amount1Min = getSlippageMinAmount(amount1, coin1.token_info.decimals);
  const recipient = walletAddress;
  const deadline = Math.ceil(new Date().getTime() / 1000 + 60 * 10); // 10 minutes

  const mintParam = {
    token0: coin0.token_info.address,
    token1: coin1.token_info.address,
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    fee,
    amount0Min,
    amount1Min,
    recipient,
    deadline,
  };

  console.log("mintParam: ", mintParam);

  const mintCalldata = nftPositionManager.interface.encodeFunctionData("mint", [
    mintParam,
  ]);
  calls.push(mintCalldata);

  const ethValue = coin0.is_native
    ? amount0
    : coin1.is_native
      ? amount1
      : undefined;
  console.log({ ethValue });

  if (ethValue) {
    const refundETHCalldata =
      nftPositionManager.interface.encodeFunctionData("refundETH");
    // console.log("refundETHCalldata: ", refundETHCalldata);
    calls.push(refundETHCalldata);
  }

  const txRes: providers.TransactionResponse =
    await nftPositionManager.multicall(calls, {
      value: ethValue ? ethers.utils.parseEther(String(ethValue)) : undefined,
    });

  const tx = await txRes.wait();
  return tx;
}

function processTickUL(
  coinA: CoinData,
  coinB: CoinData,
  tickLowerAtoB: number,
  tickUpperAtoB: number,
): { tickLower: number; tickUpper: number } {
  let tickLower = tickLowerAtoB;
  let tickUpper = tickUpperAtoB;
  console.log({ tickLowerAtoB, tickUpperAtoB });
  if (coinA.token_info.address > coinB.token_info.address) {
    tickLower = -1 * tickUpperAtoB;
    tickUpper = -1 * tickLowerAtoB;
  }
  console.log({ tickLower, tickUpper });
  return { tickLower, tickUpper };
}

export function renderLiquidityRangePrice(
  price: number | string,
  tick: number,
  fee: number,
  formatKnL = true,
): string {
  // console.log({price, tick});
  if (!price || !fee) return "";
  price = String(price);
  if (empty(tick)) return price;

  const ticks = LIQUIDITY_PRICE_RANGE[fee];
  if (tick == ticks.min_tick) {
    return "0";
  } else if (tick == ticks.max_tick) {
    return INFINITY_TEXT;
  }
  return formatKnL ? formatAmountKnL(price) : price;
}

export async function increaseLiquidity(
  tokenId: string,
  coinA: CoinData,
  coinB: CoinData,
  amountA: number,
  amountB: number,
  setInfo?: (msg: string) => void,
  provider?: providers.Web3Provider,
  network_data?: NetworkData,
): Promise<providers.TransactionReceipt> {
  provider = provider ?? getProvider();
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  if (!walletAddress || !provider) {
    throw new Error("Cannot increase liquidity without a connected wallet");
  }

  network_data = network_data ?? (await getNetworkData(provider));
  const postionContractAddress =
    network_data.contract.nonfungible_position_manager.address;

  if (!coinA.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      coinA.token_info,
      postionContractAddress,
      amountA,
      setInfo,
      network_data,
      provider,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  if (!coinB.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      coinB.token_info,
      postionContractAddress,
      amountB,
      setInfo,
      network_data,
      provider,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  const nftPositionManager = new ethers.Contract(
    postionContractAddress,
    NonfungiblePositionManagerABI.abi,
    signer,
  );
  // console.log('nftPositionManager: ', nftPositionManager.functions);

  const calls = [];

  const coin0 =
    coinA.token_info.address < coinB.token_info.address ? coinA : coinB;
  const coin1 =
    coinB.token_info.address > coinA.token_info.address ? coinB : coinA;

  const amount0 = coinA.basic.code == coin0.basic.code ? amountA : amountB;
  const amount1 = coinB.basic.code == coin1.basic.code ? amountB : amountA;

  // Prepare data for increase liquidity
  const amount0Desired = convertCoinAmountToInt(
    amount0,
    coin0.token_info.decimals,
  );
  const amount1Desired = convertCoinAmountToInt(
    amount1,
    coin1.token_info.decimals,
  );
  const amount0Min = getSlippageMinAmount(amount0, coin0.token_info.decimals);
  const amount1Min = getSlippageMinAmount(amount1, coin1.token_info.decimals);
  const deadline = Math.ceil(new Date().getTime() / 1000 + 60 * 10); // 10 minutes

  const increaseParam = {
    tokenId,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    deadline,
  };

  console.log("increaseParam: ", increaseParam);

  const increaseCalldata = nftPositionManager.interface.encodeFunctionData(
    "increaseLiquidity",
    [increaseParam],
  );
  calls.push(increaseCalldata);

  const ethValue = coin0.is_native
    ? amount0
    : coin1.is_native
      ? amount1
      : undefined;
  console.log({ ethValue });

  if (ethValue) {
    const refundETHCalldata =
      nftPositionManager.interface.encodeFunctionData("refundETH");
    // console.log("refundETHCalldata: ", refundETHCalldata);
    calls.push(refundETHCalldata);
  }

  const txRes: providers.TransactionResponse =
    await nftPositionManager.multicall(calls, {
      value: ethValue ? ethers.utils.parseEther(String(ethValue)) : undefined,
    });

  const tx = await txRes.wait();
  return tx;
}

export async function removeLiquidity(
  tokenId: string,
  coinA: CoinData,
  coinB: CoinData,
  liquidity: string | BigNumber,
  amountA: number,
  amountB: number,
  setInfo?: (msg: string) => void,
  provider?: providers.Web3Provider,
  network_data?: NetworkData,
): Promise<providers.TransactionReceipt> {
  provider = provider ?? getProvider();
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  if (!walletAddress || !provider) {
    throw new Error("Cannot perform this action without a connected wallet");
  }

  network_data = network_data ?? (await getNetworkData(provider));
  const postionContractAddress =
    network_data.contract.nonfungible_position_manager.address;

  const nftPositionManager = new ethers.Contract(
    postionContractAddress,
    NonfungiblePositionManagerABI.abi,
    signer,
  );
  // console.log('nftPositionManager: ', nftPositionManager.functions);

  const calls = [];

  const coin0 =
    coinA.token_info.address < coinB.token_info.address ? coinA : coinB;
  const coin1 =
    coinB.token_info.address > coinA.token_info.address ? coinB : coinA;

  const amount0 = coinA.basic.code == coin0.basic.code ? amountA : amountB;
  const amount1 = coinB.basic.code == coin1.basic.code ? amountB : amountA;

  // Prepare data for remove liquidity
  const amount0Min = getSlippageMinAmount(amount0, coin0.token_info.decimals);
  const amount1Min = getSlippageMinAmount(amount1, coin1.token_info.decimals);
  const deadline = Math.ceil(new Date().getTime() / 1000 + 60 * 10); // 10 minutes

  const removeParam = {
    tokenId,
    liquidity,
    amount0Min,
    amount1Min,
    deadline,
  };

  console.log("removeParam: ", removeParam);

  const removeCalldata = nftPositionManager.interface.encodeFunctionData(
    "decreaseLiquidity",
    [removeParam],
  );
  calls.push(removeCalldata);

  // prepare data for collect
  const recipient = walletAddress;
  const collectParam = {
    tokenId,
    recipient,
    amount0Max: MAX_UINT128,
    amount1Max: MAX_UINT128,
  };

  console.log("collectParam: ", collectParam);

  const collectCalldata = nftPositionManager.interface.encodeFunctionData(
    "collect",
    [collectParam],
  );
  calls.push(collectCalldata);

  if (coin0.is_native || coin1.is_native) {
    // const refundETHCalldata =
    //   nftPositionManager.interface.encodeFunctionData("refundETH");
    // calls.push(refundETHCalldata);
  }

  const txRes: providers.TransactionResponse =
    await nftPositionManager.multicall(calls);

  const tx = await txRes.wait();
  return tx;
}

export async function collectFees(
  tokenId: string,
  coinA: CoinData,
  coinB: CoinData,
  setInfo?: (msg: string) => void,
  provider?: providers.Web3Provider,
  network_data?: NetworkData,
): Promise<providers.TransactionReceipt> {
  provider = provider ?? getProvider();
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  if (!walletAddress || !provider) {
    throw new Error("Cannot perform this action without a connected wallet");
  }

  network_data = network_data ?? (await getNetworkData(provider));
  const postionContractAddress =
    network_data.contract.nonfungible_position_manager.address;

  const nftPositionManager = new ethers.Contract(
    postionContractAddress,
    NonfungiblePositionManagerABI.abi,
    signer,
  );
  // console.log('nftPositionManager: ', nftPositionManager.functions);

  const calls = [];

  const coin0 =
    coinA.token_info.address < coinB.token_info.address ? coinA : coinB;
  const coin1 =
    coinB.token_info.address > coinA.token_info.address ? coinB : coinA;

  // prepare data for collect
  const recipient = walletAddress;
  const collectParam = {
    tokenId,
    recipient,
    amount0Max: MAX_UINT128,
    amount1Max: MAX_UINT128,
  };

  console.log("collectParam: ", collectParam);

  const collectCalldata = nftPositionManager.interface.encodeFunctionData(
    "collect",
    [collectParam],
  );
  calls.push(collectCalldata);

  if (coin0.is_native || coin1.is_native) {
    // const refundETHCalldata =
    //   nftPositionManager.interface.encodeFunctionData("refundETH");
    // calls.push(refundETHCalldata);
  }

  const txRes: providers.TransactionResponse =
    await nftPositionManager.multicall(calls);

  const tx = await txRes.wait();
  return tx;
}
