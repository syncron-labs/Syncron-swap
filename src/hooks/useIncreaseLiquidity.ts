import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PositionInfo,
  getConvertedAmountForLiqDeposit,
  getPositionInfo,
  increaseLiquidity,
} from "../utils/uniswap/liquidity";
import { CoinData } from "../utils/types";
import { getCoinData } from "../utils/network/coin-data";
import { useToast } from "../components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { getProvider } from "../utils/wallet";
import { getCoinBalance } from "../utils/eth/eth";
import {
  beautifyNumber,
  empty,
  noExponents,
  sleep,
  validateAndTruncateDecimal,
} from "../utils/corefunctions";
import { getTickFromPrice } from "../utils/uniswap/maths";
import { INFINITY_TEXT } from "../utils/coreconstants";
import { Token } from "@uniswap/sdk-core";

const useIncreaseLiquidity = () => {
  const { toast } = useToast();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);
  const dispatch = useDispatch();

  const { tokenId } = useParams<{ tokenId: string }>();

  const [selectedCoin, setSelectedCoin] = useState<string>();
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [positionDetails, setPositionDetails] = useState<PositionInfo>(null);
  const router = useRouter();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);

  const [firstCoin, setFirstCoin] = useState<CoinData>();
  const [secondCoin, setSecondCoin] = useState<CoinData>();
  const [price, setPrice] = useState<string>();
  const [assistMessage, setAssistMessage] = useState<string>("");
  const [formReady, setFormReady] = useState<boolean>(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const [inRange, setInRange] = useState<boolean>(false);
  const [lowPrice, setLowPrice] = useState("");
  const [highPrice, setHighPrice] = useState("");

  const [fromDepositAmount, setFromDepositAmount] = useState("");
  const [toDepositAmount, setToDepositAmount] = useState("");
  const [fromDepositShow, setFromDepositShow] = useState(false);
  const [toDepositShow, setToDepositShow] = useState(false);
  const [fromBalance, setFromBalance] = useState<string | number | null>(null);
  const [toBalance, setToBalance] = useState<string | number | null>(null);
  const [fromAmountError, setFromAmountError] = useState<string>("");
  const [toAmountError, setToAmountError] = useState<string>("");

  /* useEffects */
  useEffect(() => {
    setProvider(getProvider());
    tokenId && chain_id && getPositionDetails(tokenId);
  }, [tokenId, chain_id]);

  useEffect(() => {
    // clearData();
  }, [chain_id]);
  
  useEffect(() => {
    (async () => {
      fromCoin && await fetchAndSetBalance(fromCoin, setFromBalance);
      toCoin && await fetchAndSetBalance(toCoin, setToBalance);
    })();
  }, [fromCoin, toCoin]);

  useEffect(() => {
    tokenId &&
      chain_id &&
      getPositionDetails(tokenId, positionDetails ? false : true);
    fetchAndSetBalance(fromCoin, setFromBalance);
    fetchAndSetBalance(toCoin, setToBalance);
  }, [block_number]);

  useEffect(() => {
    // assistantMessage();
    if (
      walletAddress &&
      positionDetails &&
      walletAddress.toLowerCase() != positionDetails.owner?.toLowerCase()
    ) {
      toast({ title: "Error", description: "Not Authorized!!" });
      router.push(`/pool/${tokenId}`);
    }

    if (Number(fromDepositAmount) > Number(fromBalance)) {
      setFromAmountError("Insufficient balance");
    } else {
      setFromAmountError("");
    }

    if (Number(toDepositAmount) > Number(toBalance)) {
      setToAmountError("Insufficient balance");
    } else {
      setToAmountError("");
    }
  }, [fromDepositAmount, toDepositAmount, walletAddress]);

  // all dependencis
  useEffect(() => {
    // assistantMessage();

    // console.log({
    //   fromCoin,
    //   toCoin,
    //   price,
    //   fromDepositAmount,
    //   toDepositAmount,
    //   fromAmountError,
    //   toAmountError,
    // });

    if (
      fromCoin &&
      toCoin &&
      Number(price) &&
      (!fromDepositShow || Number(fromDepositAmount)) &&
      (!toDepositShow || Number(toDepositAmount)) &&
      !fromAmountError &&
      !toAmountError
    ) {
      setFormReady(true);
    } else {
      setFormReady(false);
    }
  }, [
    positionDetails,
    fromCoin,
    toCoin,
    selectedCoin,
    price,
    fromDepositShow,
    toDepositShow,
    fromDepositAmount,
    fromAmountError,
    toDepositAmount,
    toAmountError,
  ]);
  /*  */

  /*core functions  */
  const getPositionDetails = async (
    tokenId: string,
    load = true,
  ): Promise<PositionInfo> => {
    try {
      load && setLoading(true);
      const position = await getPositionInfo(tokenId, provider, null, true);
      // console.log("position: ", position);
      if (walletAddress.toLowerCase() != position.owner.toLowerCase()) {
        throw new Error("Not Authorized!!");
      }

      setPositionDetails(position);
      setFromCoin(await getCoinData(position.token0, provider));
      setToCoin(await getCoinData(position.token1, provider));

      setFirstCoin(await getCoinData(position.token0, provider));
      setSecondCoin(await getCoinData(position.token1, provider));
      setSelectedCoin(position.token1.symbol);
      setPrice(position.currentPrice.toString());
      setLowPrice(position.minPrice.toString());
      setHighPrice(position.maxPrice.toString());

      await processPriceRangeCondition(
        position.tickUpper,
        position.tickLower,
        position.currentPrice,
        position.token0,
        position.token1,
      );
      load && setLoading(false);
      return position;
    } catch (error) {
      setLoading(false);
      // router.push("/pool");
      toast({
        title: "Error",
        description: "Something Went Wrong!! Try Again.",
      });
      console.error(error);
      return null;
    }
  };

  const clearData = (
    action: "clear_all" | "fee_change" | "coin_change" = "clear_all",
  ) => {
    setFromDepositShow(false);
    setToDepositShow(false);
    resetAmounts();

    setAssistMessage("");
    setFormReady(false);
    setPreview(false);
    setLoading(false);

    (async () =>
      positionDetails &&
      (await processPriceRangeCondition(
        positionDetails.tickUpper,
        positionDetails.tickLower,
        positionDetails.currentPrice,
      )))();
  };

  const fetchAndSetBalance = async (
    coin: CoinData,
    setBalanceSetter: (balance: string | number) => void,
    setLoadingSetter?: any,
  ) => {
    try {
      if (!coin) {
        setBalanceSetter(null);
        return;
      }
      setLoadingSetter && setLoadingSetter(true);
      const balance = await getCoinBalance(coin);
      setBalanceSetter(balance);
      setLoadingSetter && setLoadingSetter(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const processPriceRangeCondition = async (
    tickH: number,
    tickL: number,
    currentPrice?: number | string,
    fromToken?: Token,
    toToken?: Token,
  ) => {
    // await sleep(5);
    // console.log({ tickL, tickH });
    currentPrice = currentPrice ?? price;
    // resetAmounts();
    fromToken = fromToken ?? fromCoin.token_info;
    toToken = toToken ?? toCoin.token_info;

    if (!empty(tickH) && !empty(tickL) && Number(currentPrice)) {
      if (tickL > tickH) {
        throw new Error("Price Low cannot be greater than Price High!!");
      }

      const currentTick = getTickFromPrice(
        Number(currentPrice),
        fromToken.decimals,
        toToken.decimals,
      );
      // console.log("currentTick: ", currentTick);

      if (tickH == tickL) {
        //no deposit amount needed for coinA, coinB
        setFromDepositShow(false);
        setToDepositShow(false);
        setInRange(false);
      } else if (currentTick < tickL) {
        //no deposit amount needed for coinB

        setFromDepositShow(true);
        setToDepositShow(false);
        setInRange(false);
      } else if (currentTick > tickH) {
        //no deposit amount needed for coinA
        setToDepositShow(true);
        setFromDepositShow(false);
        setInRange(false);
      } else {
        setFromDepositShow(true);
        setToDepositShow(true);
        setInRange(true);
      }
    } else {
      setFromDepositShow(false);
      setToDepositShow(false);
      setInRange(false);
    }
  };

  const resetAmounts = (fromAmount = "", toAmount = "") => {
    setFromDepositAmount(fromAmount);
    setFromAmountError("");
    setToDepositAmount(toAmount);
    setToAmountError("");
  };

  /*  */

  /* handlers */
  const handleClearAll = () => {
    try {
      clearData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleConnectWallet = () => {
    try {
      dispatch(setWallet<walletSliceType>({ open_wallet_sidebar: true }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handlePriceSet = async (price: string) => {
    try {
      const parsedAmount = parseFloat(price);
      if (isNaN(parsedAmount) || price == "Infinity") {
        setPrice("");
      } else {
        setPrice(price);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSwitchCoins = async () => {
    try {
      const prc = price;
      const lPrc = lowPrice;
      const hPrc = highPrice;
      setFromCoin(toCoin);
      setToCoin(fromCoin);
      resetAmounts();
      await sleep(5);
      handlePriceSet(noExponents(beautifyNumber(1 / Number(prc))));
      if (hPrc != "0" && hPrc != INFINITY_TEXT) {
        setLowPrice(beautifyNumber(1 / Number(hPrc)));
      } else {
        setLowPrice(hPrc);
      }
      if (lPrc != "0" && lPrc != INFINITY_TEXT) {
        setHighPrice(beautifyNumber(1 / Number(lPrc)));
      } else {
        setHighPrice(lPrc);
      }
      await sleep(5);
      await processPriceRangeCondition(
        positionDetails.tickUpper,
        positionDetails.tickLower,
        positionDetails.currentPrice,
        fromCoin.token_info,
        toCoin.token_info,
      );
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleFromDepositAmountChange = async (amount: string) => {
    try {
      if (!fromCoin) {
        setFromAmountError("Please select a coin");
        return;
      }
      if (amount === "" || amount === null) {
        resetAmounts();
      } else {
        amount = validateAndTruncateDecimal(
          fromCoin.token_info.decimals,
          amount,
        );
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
          if (parsedAmount > Number(fromBalance)) {
            setFromDepositAmount(amount);
            setFromAmountError("Insufficient balance");
          } else {
            setFromDepositAmount(amount);
            setFromAmountError("");
            if (toCoin) {
              const res = getConvertedAmountForLiqDeposit(
                fromCoin,
                toCoin,
                Number(price),
                Number(positionDetails?.minPrice),
                Number(positionDetails?.maxPrice),
                parsedAmount,
              );

              res.amountB = Number(
                validateAndTruncateDecimal(
                  toCoin.token_info.decimals,
                  noExponents(res.amountB),
                ),
              );
              setToDepositAmount(noExponents(beautifyNumber(res.amountB)));
            }
          }
        } else {
          setFromDepositAmount("");
          setFromAmountError("Please enter a valid number");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleToDepositAmountChange = async (amount: string) => {
    try {
      if (!toCoin) {
        setToAmountError("Please select a coin");
        return;
      }
      if (amount === "" || amount === null) {
        resetAmounts();
      } else {
        amount = validateAndTruncateDecimal(toCoin.token_info.decimals, amount);
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
          if (parsedAmount > Number(toBalance)) {
            setToAmountError("Amount cannot exceed balance");
            setToDepositAmount("");
          } else {
            setToAmountError("");
            setToDepositAmount(amount);

            if (fromCoin) {
              const res = getConvertedAmountForLiqDeposit(
                fromCoin,
                toCoin,
                Number(price),
                Number(positionDetails?.minPrice),
                Number(positionDetails?.maxPrice),
                null,
                parsedAmount,
              );
              res.amountA = Number(
                validateAndTruncateDecimal(
                  fromCoin.token_info.decimals,
                  noExponents(res.amountA),
                ),
              );
              setFromDepositAmount(noExponents(beautifyNumber(res.amountA)));
            }
          }
        } else {
          setToDepositAmount("");
          setToAmountError("Please enter a valid number");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleIncreaseLiquidity = async () => {
    try {
      setPreview(false);
      setLoadingModal(true);
      setAssistMessage("Wait for transaction completion ...");

      await increaseLiquidity(
        tokenId,
        fromCoin,
        toCoin,
        Number(fromDepositAmount),
        Number(toDepositAmount),
      );

      // console.log({
      //   tokenId,
      //   fromCoin,
      //   toCoin,
      //   fromDepositAmount,
      //   toDepositAmount,
      // });

      toast({
        title: "Success",
        description: "Congratulations!! Liquidity Increased Successfully.",
      });
      router.push(`/pool/${tokenId}`);
    } catch (error) {
      // console.error(error.message);
      setLoadingModal(false);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };
  /*  */

  return {
    fromCoin,
    toCoin,
    positionDetails,
    loading,
    firstCoin,
    secondCoin,
    selectedCoin,
    assistMessage,
    formReady,
    preview,
    price,
    lowPrice,
    highPrice,
    fromDepositAmount,
    toDepositAmount,
    fromDepositShow,
    toDepositShow,
    fromBalance,
    toBalance,
    fromAmountError,
    toAmountError,
    inRange,
    loadingModal,
    setSelectedCoin,
    setPreview,
    setLoadingModal,
    handleClearAll,
    handleSwitchCoins,
    handleConnectWallet,
    handleFromDepositAmountChange,
    handleToDepositAmountChange,
    handleIncreaseLiquidity,
  };
};

export default useIncreaseLiquidity;
