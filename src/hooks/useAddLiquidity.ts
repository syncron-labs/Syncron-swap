import { useEffect, useState } from "react";
import { CoinData } from "@/src/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { useToast } from "@/src/components/ui/use-toast";
import { IRootState } from "@/store";
import { useRouter } from "next/navigation";
import { getCoinBalance } from "../utils/eth/eth";
import { PoolInfo, getPoolInfo } from "../utils/uniswap/pool";
import { getProvider } from "../utils/wallet";
import {
  beautifyNumber,
  empty,
  getNetworkData,
  noExponents,
  sleep,
  validateAndTruncateDecimal,
} from "../utils/corefunctions";
import {
  getPriceFromSqrtPx96,
  getPriceFromTick,
  getTickFromPrice,
} from "../utils/uniswap/maths";
import {
  createAndAddLiquidity,
  getConvertedAmountForLiqDeposit,
} from "../utils/uniswap/liquidity";
import { getTickNPrice, getToken0Token1 } from "../utils/uniswap/helpers";
import { INFINITY_TEXT, LIQUIDITY_PRICE_RANGE } from "../utils/coreconstants";
import { Token } from "@uniswap/sdk-core";

export const useAddLiquidity = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [token0, setToken0] = useState<Token>(null);
  const [token1, setToken1] = useState<Token>(null);

  const [firstCoin, setFirstCoin] = useState<CoinData>(null);
  const [secondCoin, setSecondCoin] = useState<CoinData>(null);
  const [selectedCoin, setSelectedCoin] = useState<string>(null);

  const [lowPrice, setLowPrice] = useState("");
  const [highPrice, setHighPrice] = useState("");
  const [tickLower, setTickLower] = useState<number>(null);
  const [tickUpper, setTickUpper] = useState<number>(null);
  const [inRange, setInRange] = useState<boolean>(false);

  const [selectedFee, setSelectedFee] = useState<number>(null);
  const [pool, setPool] = useState<PoolInfo>(null);
  const [price, setPrice] = useState<string>();

  const [fromDepositAmount, setFromDepositAmount] = useState("");
  const [toDepositAmount, setToDepositAmount] = useState("");
  const [fromDepositShow, setFromDepositShow] = useState(false);
  const [toDepositShow, setToDepositShow] = useState(false);
  const [fromBalance, setFromBalance] = useState<string | number | null>(null);
  const [toBalance, setToBalance] = useState<string | number | null>(null);
  const [fromAmountError, setFromAmountError] = useState<string>("");
  const [toAmountError, setToAmountError] = useState<string>("");

  const [assistMessage, setAssistMessage] = useState<string>("");
  const [formReady, setFormReady] = useState<boolean>(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  /* useEffects */
  useEffect(() => {
    clearData();
  }, [chain_id]);

  useEffect(() => {
    fetchAndSetBalance(fromCoin, setFromBalance);
    fetchAndSetBalance(toCoin, setToBalance);
    isCoinSelected && selectedFee && handleFeeSelection(selectedFee, false);
  }, [block_number]);

  // all dependencis
  useEffect(() => {
    // assistantMessage();

    // console.log({
    //   fromCoin,
    //   toCoin,
    //   selectedFee,
    //   price,
    //   lowPrice,
    //   highPrice,
    //   tickLower,
    //   tickUpper,
    //   fromDepositShow,
    //   fromDepositAmount,
    //   toDepositShow,
    //   toDepositAmount,
    //   fromAmountError,
    //   toAmountError,
    // });

    if (
      fromCoin &&
      toCoin &&
      selectedFee &&
      Number(price) &&
      !empty(tickLower) &&
      !empty(tickUpper) &&
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
    fromCoin,
    toCoin,
    selectedCoin,
    selectedFee,
    price,
    lowPrice,
    highPrice,
    fromDepositShow,
    toDepositShow,
    fromDepositAmount,
    fromAmountError,
    toDepositAmount,
    toAmountError,
  ]);

  useEffect(() => {
    (async () => {
      try {
        await processPriceRangeCondition(tickUpper, tickLower);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
        });
      }
    })();
  }, [tickLower, tickUpper, price]);

  useEffect(() => {
    // assistantMessage();
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

  useEffect(() => {
    clearData("coin_change");
    if (fromCoin) {
      if (
        fromCoin?.basic.code == toCoin?.basic.code ||
        (fromCoin?.is_native && toCoin?.is_native_wrap) ||
        (fromCoin?.is_native_wrap && toCoin?.is_native)
      ) {
        setFromCoin(null);
        setFromBalance(null);
        return;
      }
      setToken0Token1();
      fetchAndSetBalance(fromCoin, setFromBalance);
      resetAmounts();
    }
    processCoinToggleSection();
  }, [fromCoin]);

  useEffect(() => {
    clearData("coin_change");
    if (toCoin) {
      if (
        fromCoin?.basic.code == toCoin?.basic.code ||
        (fromCoin?.is_native && toCoin?.is_native_wrap) ||
        (fromCoin?.is_native_wrap && toCoin?.is_native)
      ) {
        setToCoin(null);
        setToBalance(null);
        return;
      }
      setToken0Token1();
      fetchAndSetBalance(toCoin, setToBalance);
      resetAmounts();
    }
    processCoinToggleSection();
  }, [toCoin]);
  /*  */

  /* core functons  */
  const assistantMessage = () => {
    if (!walletAddress) {
      return setAssistMessage("Please connect your wallet.");
    }
    if (!fromCoin && !toCoin) {
      setAssistMessage("Please select both 'Pay' and 'Receive' coins.");
    } else if (!fromCoin) {
      setAssistMessage("Please select the 'Pay' coin.");
    } else if (!toCoin) {
      setAssistMessage("Please select the 'Receive' coin.");
    } else if (!fromDepositAmount && !toDepositAmount) {
      setAssistMessage("Please enter 'Pay' or 'Receive' amount.");
    } else {
      setTimeout(() => setAssistMessage(""), 2000);
    }
  };

  const clearData = (
    action: "clear_all" | "fee_change" | "coin_change" = "clear_all",
  ) => {
    if (action == "clear_all") {
      setFromCoin(null);
      setToCoin(null);
      setFirstCoin(null);
      setSecondCoin(null);
      setSelectedCoin(null);
      setFromBalance("");
      setToBalance("");
    }

    if (action == "clear_all" || action == "coin_change") {
      setSelectedFee(null);
    }

    setPool(null);
    setPrice("");

    setLowPrice("");
    setHighPrice("");
    setTickLower(null);
    setTickUpper(null);
    setInRange(false);

    setFromDepositShow(false);
    setToDepositShow(false);
    setFromDepositAmount("");
    setToDepositAmount("");
    setFromAmountError("");
    setToAmountError("");

    setAssistMessage("");
    setFormReady(false);
    setPreview(false);
    setLoading(false);
  };

  const setToken0Token1 = () => {
    if (fromCoin && toCoin) {
      const { token0, token1 } = getToken0Token1(
        fromCoin.token_info,
        toCoin.token_info,
      );
      setToken0(token0);
      setToken1(token1);
    }
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

  const processAndSetPriceAtoB = (currPrice: number) => {
    if (fromCoin.token_info.address > toCoin.token_info.address) {
      currPrice = 1 / currPrice;
    }

    if (Number(price) != currPrice) {
      resetAmounts();
    }

    setPrice(noExponents(currPrice));
  };

  const resetAmounts = (fromAmount = "", toAmount = "") => {
    setFromDepositAmount(fromAmount);
    setFromAmountError("");
    setToDepositAmount(toAmount);
    setToAmountError("");
  };

  const processPriceRangeCondition = async (tickH: number, tickL: number) => {
    // await sleep(5);
    // console.log({tickL, tickH});

    resetAmounts();

    if (!empty(tickH) && !empty(tickL) && Number(price)) {
      if (tickL > tickH) {
        throw new Error("Price Low cannot be greater than Price High!!");
      }

      const currentTick = getTickFromPrice(
        Number(price),
        fromCoin.token_info.decimals,
        toCoin.token_info.decimals,
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

  const processCoinToggleSection = () => {
    if (
      fromCoin &&
      fromCoin.basic.code != firstCoin?.basic.code &&
      fromCoin.basic.code != secondCoin?.basic.code
    ) {
      setFirstCoin(fromCoin);
      setSelectedCoin(toCoin.basic.code);
    } else if (
      toCoin &&
      toCoin.basic.code != firstCoin?.basic.code &&
      toCoin.basic.code != secondCoin?.basic.code
    ) {
      setSecondCoin(toCoin);
      setSelectedCoin(toCoin.basic.code);
    } else if (toCoin && fromCoin) {
      setSelectedCoin(toCoin.basic.code);
      // setSelectedCoin((prev) => {
      //   if (!prev) {
      //     return toCoin.basic.code;
      //   }
      // });
    } else if (!toCoin && !fromCoin) {
      setFirstCoin(null);
      setSecondCoin(null);
      setSelectedCoin(null);
    } else {
      if (
        (!toCoin && firstCoin?.basic.code != fromCoin.basic.code) ||
        (!fromCoin && firstCoin?.basic.code != toCoin.basic.code)
      ) {
        setFirstCoin(null);
      }
      if (
        (!toCoin && secondCoin?.basic.code != fromCoin.basic.code) ||
        (!fromCoin && secondCoin?.basic.code != toCoin.basic.code)
      ) {
        setSecondCoin(null);
      }
      setSelectedCoin(null);
    }
  };

  const checkPricePlusMinusCondition = (
    action: "increase" | "decrease",
    price_input: "low" | "high",
  ): boolean => {
    let price = price_input == "low" ? lowPrice : highPrice;
    const ticks = LIQUIDITY_PRICE_RANGE[selectedFee];
    const min_calc_prc = getPriceFromTick(
      ticks.min_tick,
      fromCoin.token_info.decimals,
      toCoin.token_info.decimals,
    );
    const max_calc_prc = getPriceFromTick(
      ticks.max_tick,
      fromCoin.token_info.decimals,
      toCoin.token_info.decimals,
    );
    if (Number(price) == min_calc_prc) {
      price = "0";
    } else if (Number(price) == max_calc_prc) {
      price = INFINITY_TEXT;
    }
    if (
      (action == "increase" && price == INFINITY_TEXT) ||
      (action == "decrease" && price == "0")
    ) {
      return false;
    }
    return true;
  };
  /*  */

  /* Handlers */
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

  const handleFeeSelection = async (fee: number, clear = true) => {
    try {
      clear && clearData("fee_change");
      setSelectedFee(fee);
      const provider = getProvider();
      const network_data = await getNetworkData(provider);
      try {
        const pool = await getPoolInfo(
          network_data,
          fromCoin.token_info,
          toCoin.token_info,
          fee,
        );
        setPool(pool);
        if (pool) {
          let price = getPriceFromSqrtPx96(
            Number(pool.sqrtPriceX96),
            token0.decimals,
            token1.decimals,
          );
          processAndSetPriceAtoB(price);
        } else {
          clear && clearData("fee_change");
        }
      } catch (e) {
        clear && clearData("fee_change");
      }
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

  const handleFullRange = async () => {
    try {
      if (selectedFee) {
        const ticks = LIQUIDITY_PRICE_RANGE[selectedFee];
        const min_calc_prc = getPriceFromTick(
          ticks.min_tick,
          fromCoin.token_info.decimals,
          toCoin.token_info.decimals,
        );
        const max_calc_prc = getPriceFromTick(
          ticks.max_tick,
          fromCoin.token_info.decimals,
          toCoin.token_info.decimals,
        );
        setLowPrice(noExponents(min_calc_prc));
        setTickLower(ticks.min_tick);
        setHighPrice(noExponents(max_calc_prc));
        setTickUpper(ticks.max_tick);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleLowPriceChange = async (
    value: string,
    event: "change" | "blur",
  ) => {
    try {
      if (event == "change") {
        const parsedAmount = parseFloat(value);
        if (isNaN(parsedAmount)) {
          setLowPrice("");
        } else {
          setLowPrice(value);
        }
        setTickLower(null);
        return;
      }

      if (!value) {
        setLowPrice(value);
        setTickLower(null);
        setFromDepositShow(false);
        setToDepositShow(false);
        resetAmounts();
        return;
      }

      const ticks = LIQUIDITY_PRICE_RANGE[selectedFee];
      if (Number(value) == 0) {
        const min_calc_prc = getPriceFromTick(
          ticks.min_tick,
          fromCoin.token_info.decimals,
          toCoin.token_info.decimals,
        );
        setLowPrice(noExponents(min_calc_prc));
        setTickLower(ticks.min_tick);
        return;
      } else if (value == INFINITY_TEXT) {
        const max_calc_prc = getPriceFromTick(
          ticks.max_tick,
          fromCoin.token_info.decimals,
          toCoin.token_info.decimals,
        );
        setLowPrice(noExponents(max_calc_prc));
        setTickLower(ticks.max_tick);
        return;
      }

      if (Number(value) > 0) {
        const res = getTickNPrice(
          fromCoin.token_info,
          toCoin.token_info,
          "rounded",
          selectedFee,
          Number(value),
        );
        setLowPrice(noExponents(res.price));
        setTickLower(res.tick);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleHighPriceChange = async (
    value: string,
    event: "change" | "blur",
  ) => {
    try {
      if (event == "change") {
        const parsedAmount = parseFloat(value);
        if (isNaN(parsedAmount)) {
          setHighPrice("");
        } else {
          setHighPrice(value);
        }
        setTickUpper(null);
        return;
      }

      if (!value) {
        setHighPrice(value);
        setTickUpper(null);
        setFromDepositShow(false);
        setToDepositShow(false);
        resetAmounts();
        return;
      }

      const ticks = LIQUIDITY_PRICE_RANGE[selectedFee];
      if (Number(value) == 0) {
        const min_calc_prc = getPriceFromTick(
          ticks.min_tick,
          fromCoin.token_info.decimals,
          toCoin.token_info.decimals,
        );
        setHighPrice(noExponents(min_calc_prc));
        setTickUpper(ticks.min_tick);
        return;
      } else if (value == INFINITY_TEXT) {
        const max_calc_prc = getPriceFromTick(
          ticks.max_tick,
          fromCoin.token_info.decimals,
          toCoin.token_info.decimals,
        );
        setHighPrice(noExponents(max_calc_prc));
        setTickUpper(ticks.max_tick);
        return;
      }

      const parsedAmount = parseFloat(value);
      if (isNaN(parsedAmount)) {
        setHighPrice("");
        setTickUpper(null);
        return;
      }

      if (Number(value) > 0) {
        const res = getTickNPrice(
          fromCoin.token_info,
          toCoin.token_info,
          "rounded",
          selectedFee,
          Number(value),
        );
        setHighPrice(noExponents(res.price));
        setTickUpper(res.tick);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleHighPriceIncrease = () => {
    try {
      if (!highPrice) return;
      if (!checkPricePlusMinusCondition("increase", "high")) return;
      const res = getTickNPrice(
        fromCoin.token_info,
        toCoin.token_info,
        "next",
        selectedFee,
        null,
        tickUpper,
      );
      setHighPrice(noExponents(res.price));
      setTickUpper(res.tick);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleHighPriceDecrease = () => {
    try {
      if (!highPrice) return;
      if (!checkPricePlusMinusCondition("decrease", "high")) return;
      const res = getTickNPrice(
        fromCoin.token_info,
        toCoin.token_info,
        "prev",
        selectedFee,
        null,
        tickUpper,
      );
      setHighPrice(noExponents(res.price));
      setTickUpper(res.tick);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleLowPriceIncrease = () => {
    try {
      if (!lowPrice) return;
      if (!checkPricePlusMinusCondition("increase", "low")) return;
      const res = getTickNPrice(
        fromCoin.token_info,
        toCoin.token_info,
        "next",
        selectedFee,
        null,
        tickLower,
      );
      setLowPrice(noExponents(res.price));
      setTickLower(res.tick);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleLowPriceDecrease = () => {
    try {
      if (!lowPrice) return;
      if (!checkPricePlusMinusCondition("decrease", "low")) return;
      const res = getTickNPrice(
        fromCoin.token_info,
        toCoin.token_info,
        "prev",
        selectedFee,
        null,
        tickLower,
      );
      setLowPrice(noExponents(res.price));
      setTickLower(res.tick);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSwitchCoins = async () => {
    try {
      const fee = selectedFee;
      const pl = pool;
      const prc = price;
      const lPrc = lowPrice;
      const hPrc = highPrice;
      const tickL = tickLower;
      const tickU = tickUpper;

      setFromCoin(toCoin);
      setToCoin(fromCoin);
      resetAmounts();

      await sleep(5);

      setSelectedFee(fee);
      setPool(pl);
      handlePriceSet(noExponents(1 / Number(prc)));
      setLowPrice(lPrc);
      setHighPrice(hPrc);
      // hPrc && handleLowPriceChange(String(1 / Number(hPrc)));
      // lPrc && handleHighPriceChange(String(1 / Number(lPrc)));
      setTickLower(tickL);
      setTickUpper(tickU);
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
                Number(lowPrice),
                Number(highPrice),
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
                Number(lowPrice),
                Number(highPrice),
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

  const handleAddLiquidity = async () => {
    try {
      setPreview(false);
      setLoading(true);
      setAssistMessage("Wait for transaction completion ...");
      await createAndAddLiquidity(
        fromCoin,
        toCoin,
        selectedFee,
        Number(price),
        Number(fromDepositAmount),
        Number(toDepositAmount),
        tickLower,
        tickUpper,
      );
      // console.log({
      //   fromCoin,
      //   toCoin,
      //   selectedFee,
      //   price,
      //   tickLower,
      //   tickUpper,
      //   fromDepositAmount,
      //   toDepositAmount,
      // });
      toast({
        title: "Success",
        description: "Congratulations!! New Position Created",
      });
      clearData();
    } catch (error) {
      // console.error(error.message);
      setLoading(false);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };
  /*  */

  const isCoinSelected = fromCoin && toCoin;
  const isPoolFeeSelected = selectedFee !== null;
  const isAllSelected = isCoinSelected && isPoolFeeSelected;

  return {
    formReady,
    preview,
    pool,
    price,
    handlePriceSet,
    setPreview,
    fromCoin,
    setFromCoin,
    toCoin,
    setToCoin,
    fromDepositAmount,
    setFromDepositAmount,
    toDepositAmount,
    setToDepositAmount,
    fromBalance,
    setFromBalance,
    fromAmountError,
    setFromAmountError,
    toBalance,
    setToBalance,
    toAmountError,
    setToAmountError,
    setSelectedFee,
    selectedCoin,
    setSelectedCoin,
    fromDepositShow,
    toDepositShow,
    lowPrice,
    setLowPrice,
    highPrice,
    setHighPrice,
    tickLower,
    tickUpper,
    inRange,
    selectedFee,
    assistMessage,
    setAssistMessage,
    walletAddress,
    chain_id,
    block_number,
    router,
    handleClearAll,
    handleConnectWallet,
    handleSwitchCoins,
    handleAddLiquidity,
    handleFullRange,
    handleLowPriceChange,
    handleHighPriceChange,
    handleFeeSelection,
    handleFromDepositAmountChange,
    handleToDepositAmountChange,
    handleHighPriceIncrease,
    handleHighPriceDecrease,
    handleLowPriceIncrease,
    handleLowPriceDecrease,
    isCoinSelected,
    isPoolFeeSelected,
    isAllSelected,
    firstCoin,
    setFirstCoin,
    secondCoin,
    setSecondCoin,
    loading,
    setLoading,
  };
};
