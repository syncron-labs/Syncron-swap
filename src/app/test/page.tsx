"use client";
import { Button } from "@/src/components/ui/button";
import { convertCoinAmountToInt, noExponents } from "@/src/utils/corefunctions";
import {
  CHAIN_SLUG_MAPPING,
  NETWORK_DATA,
  NETWORK_SLUG,
} from "@/src/utils/network/network-data";
import {
  getAddress,
  getProvider,
  sendTransactionViaExtension,
  watchTransaction,
} from "@/src/utils/wallet";
import { IRootState } from "@/store";
import { BigNumber, ethers, providers, utils } from "ethers";
import * as React from "react";
import { useSelector } from "react-redux";
import NonfungiblePositionManagerABI from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { COIN_SLUG } from "@/src/utils/network/coin-data";
import { getPriceFromTick, getTickFromPrice } from "@/src/utils/uniswap/maths";
import { LIQUIDITY_PRICE_RANGE } from "@/src/utils/coreconstants";
import { FeeAmount } from "@uniswap/v3-sdk";
import { PoolInfo, getPoolInfo } from "@/src/utils/uniswap/pool";
import {
  getSqrtPx96,
  getTickNPrice,
  getToken0Token1,
} from "@/src/utils/uniswap/helpers";
import { useSearchParams } from "next/navigation";
import {
  getConvertedAmountForLiqDeposit,
  getPositionInfo,
  getPositions,
} from "@/src/utils/uniswap/liquidity";
import { executeSwap, getConvertedAmount } from "@/src/utils/uniswap/swap";
import { useEffect, useState } from "react";

export default function Test() {
  const url = global.window?.location?.href || "";
  const qParams = new URLSearchParams(url);
  // const qParams = { get: (key: string) => 0 };

  const qTokenA = qParams?.get("tokenA");
  const qTokenB = qParams?.get("tokenB");

  const qAmountA = Number(qParams?.get("amountA"));
  const qAmountB = Number(qParams?.get("amountB"));

  const qPrice = Number(qParams?.get("price"));
  const qMinPrice = Number(qParams?.get("minPrice"));
  const qMaxPrice = Number(qParams?.get("maxPrice"));

  const qPoolFee = Number(qParams?.get("fee"));

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [walletAddress, setWalletAddress] = useState<string>(null);

  //swap sepcific
  const [poolFee, setPoolFee] = useState<number>(0);
  const [swapTokenPath, setSwapTokenPath] = useState<string>("");
  const [convertedToAmount, setConvertedToAmount] = useState<number>(0);
  const [rawConvAmount, setRawConvAmount] = useState<string>("");

  // const { walletAddress, chain_id } = useSelector(
  //   (state: IRootState) => state.wallet,
  // )

  // console.log('redusx data: ', { walletAddress, chain_id });

  useEffect(() => {
    (async () => {
      const provider = getProvider();
      setProvider(provider);
      const walletAddress = await getAddress(provider);
      setWalletAddress(walletAddress);
    })();
  }, []);

  const handleNewPositionMulticall = async () => {
    const network = CHAIN_SLUG_MAPPING[provider?._network.chainId];
    const network_data = NETWORK_DATA[network];
    console.log("network_data: ", network_data);

    const tokenA =
      network_data.coin_or_token[
        qTokenA ? String(qTokenA).toUpperCase() : COIN_SLUG.DKFT20
      ];
    const tokenB =
      network_data.coin_or_token[
        qTokenB ? String(qTokenB).toUpperCase() : COIN_SLUG.ETH
      ];

    const amountA = qAmountA || 100;
    const amountB = qAmountB || 0.004;
    const price = qPrice || 25000;

    const signer = provider.getSigner();

    const nftPositionManager = new ethers.Contract(
      network_data.contract.nonfungible_position_manager.address,
      NonfungiblePositionManagerABI.abi,
      signer,
    );
    // console.log('nftPositionManager: ', nftPositionManager.functions);
    const calls = [];

    const token0 =
      tokenA.token_info.address < tokenB.token_info.address ? tokenA : tokenB;
    const token1 =
      tokenB.token_info.address > tokenA.token_info.address ? tokenB : tokenA;

    const amount0 = tokenA.basic.code == token0.basic.code ? amountA : amountB;
    const amount1 = tokenB.basic.code == token1.basic.code ? amountB : amountA;

    const poolFee = qPoolFee || FeeAmount.MEDIUM;

    // let poolInfo: PoolInfo = null;
    // try {
    //   poolInfo = await getPoolInfo(
    //     network_data,
    //     dkft20.token_info,
    //     eth.token_info,
    //     poolFee,
    //   );
    // } catch (error) {
    //   // console.log(error);
    // }

    // if (!poolInfo) {
    //   alert("No pool available, will create a new pool also");

    const sqrtP = noExponents(
      getSqrtPx96({
        fromToken: tokenA.token_info,
        toToken: tokenB.token_info,
        price: price,
      }),
    );
    const param = [
      token0.token_info.address,
      token1.token_info.address,
      poolFee,
      sqrtP,
    ];
    console.log("pool create param: ", param);

    const calldata = nftPositionManager.interface.encodeFunctionData(
      "createAndInitializePoolIfNecessary",
      param,
    );
    calls.push(calldata);
    // }

    const priceRange = LIQUIDITY_PRICE_RANGE[poolFee];

    // Prepare data for adding new position (example)
    const fee = poolFee;
    const tickLower = priceRange.min_tick;
    const tickUpper = priceRange.max_tick;
    const amount0Desired = convertCoinAmountToInt(
      amount0,
      token0.token_info.decimals,
    );
    const amount1Desired = convertCoinAmountToInt(
      amount1,
      token1.token_info.decimals,
    ); // Convert ETH to Wei
    const amount0Min = "0";
    const amount1Min = "0";
    const recipient = walletAddress;
    const deadline = Math.ceil((new Date().getTime() + 10 * 60 * 1000) / 1000);

    const mintParam = {
      token0: token0.token_info.address,
      token1: token1.token_info.address,
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

    const mintCalldata = nftPositionManager.interface.encodeFunctionData(
      "mint",
      [mintParam],
    );
    calls.push(mintCalldata);
    // console.log('calls: ', calls);

    // // Encode function calls and parameters
    // const multicallData = nftPositionManager.interface.encodeFunctionData(
    //   "multicall",
    //   [calls],
    // );
    // // console.log('multicallData: ', multicallData);

    // const tx: providers.TransactionRequest = {
    //   from: walletAddress,
    //   to: network_data.contract.nonfungible_position_manager.address,
    //   data: multicallData,
    //   // value: Number(amount1Desired).toString(16), //hex format
    //   value: ethers.utils.parseEther('0.004'), //hex format
    // };

    const ethValue = token0.is_native
      ? amount0
      : token1.is_native
        ? amount1
        : undefined;

    try {
      const txRes: providers.TransactionResponse =
        await nftPositionManager.multicall(calls, {
          value: ethValue
            ? ethers.utils.parseEther(String(ethValue))
            : undefined,
        });

      // const txRes = await signer.sendTransaction(tx);
      await txRes.wait();
    } catch (e) {
      // console.log(e);
    }

    // const txHash = await sendTransactionViaExtension(tx);
    // console.log("txHash: ", txHash);

    // txHash &&
    //   watchTransaction(txHash, (tx) => {
    //     console.log("tx: ", tx);
    //   });
  };

  const handleLiqConvDepositAm = async () => {
    try {
      const network = CHAIN_SLUG_MAPPING[provider?._network.chainId];
      const network_data = NETWORK_DATA[network];

      const tokenA =
        network_data.coin_or_token[
          qTokenA ? String(qTokenA).toUpperCase() : COIN_SLUG.DKFT20
        ];
      const tokenB =
        network_data.coin_or_token[
          qTokenB ? String(qTokenB).toUpperCase() : COIN_SLUG.ETH
        ];

      const amountA = qAmountA;
      const amountB = qAmountB;
      let minPrice = qMinPrice;
      let maxPrice = qMaxPrice;
      const price = qPrice;

      const { token0, token1 } = getToken0Token1(
        tokenA.token_info,
        tokenB.token_info,
      );

      if (qPoolFee) {
        minPrice = getPriceFromTick(
          LIQUIDITY_PRICE_RANGE[qPoolFee].min_tick,
          token0.decimals,
          token1.decimals,
        );
        maxPrice = getPriceFromTick(
          LIQUIDITY_PRICE_RANGE[qPoolFee].max_tick,
          token0.decimals,
          token1.decimals,
        );
      }

      const outAmounts = getConvertedAmountForLiqDeposit(
        tokenA,
        tokenB,
        price,
        minPrice,
        maxPrice,
        amountA,
        amountB,
      );
      alert(
        amountA
          ? `${outAmounts.amountB} ${tokenB.basic.code}`
          : `${outAmounts.amountA} ${tokenA.basic.code}`,
      );
    } catch (e) {
      alert(e.message);
      console.log(e);
    }
  };

  const handleSinglecall = async () => {
    const network = CHAIN_SLUG_MAPPING[provider?._network.chainId];
    const network_data = NETWORK_DATA[network];
    console.log("network_data: ", network_data);

    const dkft20 = network_data.coin_or_token[COIN_SLUG.DKFT20];
    const eth = network_data.coin_or_token[COIN_SLUG.ETH];

    const signer = provider.getSigner();
    console.log("signer address: ", await signer.getAddress());

    const nftPositionManager = new ethers.Contract(
      network_data.contract.nonfungible_position_manager.address,
      NonfungiblePositionManagerABI.abi,
      signer,
    );
    // console.log('nftPositionManager: ', nftPositionManager.functions);

    const poolFee = FeeAmount.LOW;
    const sqrtP = noExponents(
      getSqrtPx96({
        fromToken: eth.token_info,
        toToken: dkft20.token_info,
        price: 25000,
      }),
    );
    const param = [
      dkft20.token_info.address,
      eth.token_info.address,
      poolFee,
      sqrtP,
    ];

    console.log("pool create param: ", param);
    // const transcation =
    //   await nftPositionManager.populateTransaction.createAndInitializePoolIfNecessary(
    //     ...param,
    //   );
    const transcation: providers.TransactionResponse =
      await nftPositionManager.createAndInitializePoolIfNecessary(...param);

    console.log("populated transcation: ", transcation);

    await transcation.wait();

    // const tx: providers.TransactionRequest = {
    //   ...transcation,
    //   from: walletAddress,
    // };

    // const txHash = await sendTransactionViaExtension(tx);
    // console.log("txHash: ", txHash);

    // txHash &&
    //   watchTransaction(txHash, (tx) => {
    //     console.log("tx: ", tx);
    //   });
  };

  const handlePositionList = async () => {
    const positions = await getPositions(provider);
    console.log("positions: ", positions);
  };

  const handlePositionDetails = async (e: any) => {
    try {
      const tokenId = e.get("tokenId");
      const positions = await getPositionInfo(
        tokenId,
        provider,
        null,
        true,
        true,
      );
      console.log(`position (${tokenId}) : `, positions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConvertedAmount = async (e: any) => {
    try {
      const in_amount = e.get("am");
      const from_coin_code = String(e.get("from_coin_code"));
      const to_coin_code = String(e.get("to_coin_code"));

      const network = CHAIN_SLUG_MAPPING[provider?._network.chainId];
      const network_data = NETWORK_DATA[network];

      const inCoin = network_data.coin_or_token[from_coin_code.toUpperCase()];
      const outCoin = network_data.coin_or_token[to_coin_code.toUpperCase()];
      const result = await getConvertedAmount(
        inCoin,
        outCoin,
        Number(in_amount),
        network_data,
        provider,
      );
      console.log("convert result: ", result);
      setPoolFee(result.pool_fee);
      setConvertedToAmount(result.converted_amount);
      setRawConvAmount(result.raw_conv_amount);
      setSwapTokenPath(result.path);
      alert(`${result.converted_amount} ${outCoin.basic.code}`);
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }
  };

  const handleSwap = async (e: any) => {
    try {
      const from_amount = e.get("am");
      const from_coin_code = String(e.get("from_coin_code"));
      const to_coin_code = String(e.get("to_coin_code"));

      const network = CHAIN_SLUG_MAPPING[provider?._network.chainId];
      const network_data = NETWORK_DATA[network];

      const fromCoin = network_data.coin_or_token[from_coin_code.toUpperCase()];
      const toCoin = network_data.coin_or_token[to_coin_code.toUpperCase()];

      await executeSwap(
        fromCoin,
        toCoin,
        swapTokenPath,
        Number(from_amount),
        convertedToAmount,
        rawConvAmount,
        null,
        network_data,
        provider,
      );

      alert(`Swap Successful`);
    } catch (e) {
      alert(`ERROR: ${e.message}`);
    }
  };

  const getRoundedNextPrevTickPrice = (e: any) => {
    const price = Number(e.get("price"));
    const fee = Number(e.get("fee"));
    const network_data = NETWORK_DATA[NETWORK_SLUG.ETHEREUM];
    const token0 = network_data.coin_or_token[COIN_SLUG.USDC].token_info;
    const token1 = network_data.coin_or_token[COIN_SLUG.WETH].token_info;
    const rounded = getTickNPrice(token0, token1, "rounded", fee, price);
    const next = getTickNPrice(token0, token1, "next", fee, null, rounded.tick);
    const prev = getTickNPrice(token0, token1, "prev", fee, null, rounded.tick);
    console.log("tick n price: ", { rounded, next, prev });
  };

  return provider ? (
    <div className="flex flex-col items-center p-5">
      <form action={getRoundedNextPrevTickPrice}>
        <input type="text" name="price" placeholder="Enter Price"></input>
        <input type="text" name="fee" placeholder="Enter Fee"></input>
        <Button type="submit" className="text-white m-2">
          getRoundedNextPrevTickPrice
        </Button>
      </form>

      <Button className="text-white m-2" onClick={handleNewPositionMulticall}>
        testNewPositionMulticall
      </Button>

      <Button className="text-white m-2" onClick={handleLiqConvDepositAm}>
        testLiqConvDepositAm
      </Button>

      <Button className="text-white m-2" onClick={handleSinglecall}>
        testSingleCall
      </Button>

      <Button className="text-white m-2" onClick={handlePositionList}>
        getPositionsInConsole
      </Button>

      <form action={handlePositionDetails}>
        <input type="text" name="tokenId" placeholder="Enter Token ID"></input>
        <Button type="submit" className="text-white m-2">
          getPositionDetails
        </Button>
      </form>

      <form action={handleConvertedAmount}>
        <input
          type="text"
          name="from_coin_code"
          placeholder="Enter From Coin Code"
        ></input>
        <input
          type="text"
          name="to_coin_code"
          placeholder="Enter To Coin Code"
        ></input>
        <input
          type="text"
          name="am"
          placeholder="Enter From Coin Amount"
        ></input>
        <Button type="submit" className="text-white m-2">
          getConvertedAmount
        </Button>
      </form>

      {poolFee ? (
        <form action={handleSwap}>
          <input
            type="text"
            name="from_coin_code"
            placeholder="Enter From Coin Code"
          ></input>
          <input
            type="text"
            name="to_coin_code"
            placeholder="Enter To Coin Code"
          ></input>
          <input
            type="text"
            name="am"
            placeholder="Enter From Coin Amount"
          ></input>
          <Button type="submit" className="text-white m-2">
            swap
          </Button>
        </form>
      ) : (
        ""
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
}
