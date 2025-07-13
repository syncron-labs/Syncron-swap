import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { IRootState } from "@/store";
import { getCoinBalance } from "../utils/eth/eth";
import { CoinData } from "../utils/types";
import { useToast } from "../components/ui/use-toast";
import { executeSwap, getConvertedAmount } from "../utils/uniswap/swap";
import { beautifyNumber, noExponents } from "../utils/corefunctions";

const useSwapSection = () => {
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [fromBalance, setFromBalance] = useState<string | number | null>(null);
  const [toBalance, setToBalance] = useState<string | number | null>(null);
  const [fromAmountError, setFromAmountError] = useState<string>("");
  const [toAmountError, setToAmountError] = useState<string>("");
  const [assistMessage, setAssistMessage] = useState<string>("");

  const [fromAmountDisabled, setFromAmountDisabled] = useState<boolean>(false);
  const [toAmountDisabled, setToAmountDisabled] = useState<boolean>(false);

  const { wallet_address, chain_id, block_number } = useSelector(
    (state: IRootState) => state.wallet,
  );
  const { toast } = useToast();

  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const dispatch = useDispatch();
  const [loadingPayBalance, setLoadingPayBalance] = useState<boolean>(false);
  const [loadingReceiveBalance, setLoadingReceiveBalance] =
    useState<boolean>(false);

  //swap specific
  const [poolFee, setPoolFee] = useState<number>(0);
  const [rawConvAmount, setRawConvAmount] = useState<string>("");
  const [swapTokenPath, setSwapTokenPath] = useState<string>("");

  /* use Effects */

  // all effect
  useEffect(() => {
    assistantMessage();
  }, [
    fromCoin,
    toCoin,
    fromAmount,
    toAmount,
    fromBalance,
    toBalance,
    fromAmountError,
    toAmountError,
    wallet_address,
    chain_id,
    block_number,
  ]);

  useEffect(() => {
    fetchAndSetBalance(fromCoin, setFromBalance, setLoadingPayBalance);
    fetchAndSetBalance(toCoin, setToBalance, setLoadingReceiveBalance);
  }, [wallet_address]);

  useEffect(() => {
    if (Number(fromAmount) > Number(fromBalance)) {
      setFromAmountError("Insufficient balance");
    } else {
      setFromAmountError("");
    }
  }, [fromAmount, fromBalance]);

  useEffect(() => {
    if (fromCoin) {
      if (fromCoin.basic.code == toCoin?.basic.code) {
        setFromCoin(null);
        setFromBalance(null);
        return;
      }
      fetchAndSetBalance(fromCoin, setFromBalance, setLoadingPayBalance);
      resetAmounts();
    }
  }, [fromCoin]);

  useEffect(() => {
    if (toCoin) {
      if (toCoin.basic.code == fromCoin?.basic.code) {
        setToCoin(null);
        setToBalance(null);
        return;
      }
      fetchAndSetBalance(toCoin, setToBalance, setLoadingReceiveBalance);
      resetAmounts();
    }
  }, [toCoin]);

  useEffect(() => {
    (async () => {
      try {
        fetchAndSetBalance(fromCoin, setFromBalance, setLoadingPayBalance);
        fetchAndSetBalance(toCoin, setToBalance, setLoadingReceiveBalance);
        if (fromCoin && toCoin && Number(fromAmount) && !fromAmountError) {
          await fetchAndSetConvertedAmount(
            fromCoin,
            toCoin,
            Number(fromAmount),
            "from",
          );
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [block_number]);

  useEffect(() => {
    setFromCoin(null);
    setToCoin(null);
    setFromAmount("");
    setToAmount("");
    setFromBalance(null);
    setToBalance(null);
    setFromAmountError("");
    setToAmountError("");
    setShowConfirmSwap(false);
    setLoadingPayBalance(false);
    setLoadingReceiveBalance(false);
    setRawConvAmount("");
    setSwapTokenPath("");
  }, [chain_id]);

  /*  */

  /* core functions */
  const fetchAndSetConvertedAmount = async (
    inCoin: CoinData,
    outCoin: CoinData,
    inAmount: number,
    input: "from" | "to",
  ) => {
    if (input == "to") {
      setFromAmountDisabled(true);
    } else if (input == "from") {
      setToAmountDisabled(true);
    }

    const convertedRes = await getConvertedAmount(inCoin, outCoin, inAmount);
    setPoolFee(convertedRes.pool_fee);
    setRawConvAmount(convertedRes.raw_conv_amount);
    setSwapTokenPath(convertedRes.path);

    if (input == "to") {
      setFromAmount(beautifyNumber(convertedRes.converted_amount));
      setFromAmountError("");
      setFromAmountDisabled(false);
    } else if (input == "from") {
      setToAmount(beautifyNumber(convertedRes.converted_amount));
      setToAmountError("");
      setToAmountDisabled(false);
    }
  };

  const assistantMessage = () => {
    if (!wallet_address) {
      return setAssistMessage("Please connect your wallet.");
    }
    if (!fromCoin && !toCoin) {
      setAssistMessage("Please select both 'Pay' and 'Receive' coins.");
    } else if (!fromCoin) {
      setAssistMessage("Please select the 'Pay' coin.");
    } else if (!toCoin) {
      setAssistMessage("Please select the 'Receive' coin.");
    } else if (!fromAmount && !toAmount) {
      setAssistMessage("Please enter 'Pay' or 'Receive' amount.");
    } else {
      setTimeout(() => setAssistMessage(""), 2000);
    }
  };

  const fetchAndSetBalance = async (
    coin: CoinData,
    setBalanceSetter: (balance: string | number) => void,
    setLoadingSetter: any,
  ) => {
    try {
      if (!coin) {
        setBalanceSetter(null);
        return;
      }
      setLoadingSetter(true);
      const balance = await getCoinBalance(coin);
      setBalanceSetter(balance);
      setLoadingSetter(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const resetAmounts = () => {
    setFromAmount("");
    setFromAmountError("");
    setToAmount("");
    setToAmountError("");
    setRawConvAmount("");
    setSwapTokenPath("");
    setFromAmountDisabled(false);
    setToAmountDisabled(false);
  };
  /*  */

  /* handlers */
  const handleSwitchCoins = () => {
    const tempToInfo = fromCoin;
    setFromCoin(toCoin);
    setToCoin(tempToInfo);

    const tempToBalance = fromBalance;
    setFromBalance(toBalance);
    setToBalance(tempToBalance);

    // const tempToAmount = fromAmount;
    // setFromAmount(toAmount);
    // setToAmount(tempToAmount);
    resetAmounts();
  };

  const handleChangeFromAmount = async (amount: string) => {
    try {
      if (!fromCoin) {
        setFromAmountError("Please select a coin");
        return;
      }
      if (amount === "" || amount === null) {
        resetAmounts();
      } else {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
          if (parsedAmount > Number(fromBalance)) {
            setFromAmount(amount);
            setFromAmountError("Insufficient balance");
          } else {
            setFromAmountError("");
            setFromAmount(amount);
          }

          if (toCoin && parsedAmount) {
            setAssistMessage("Fetching converted amount...");
            await fetchAndSetConvertedAmount(
              fromCoin,
              toCoin,
              parsedAmount,
              "from",
            );
          }
        } else {
          setFromAmount("");
          setFromAmountError("Please enter a valid number");
        }
      }
    } catch (error) {
      setToAmount("");
      setToAmountError("");
      setToAmountDisabled(false);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleChangeToAmount = async (amount: string) => {
    try {
      if (!toCoin) {
        setToAmountError("Please select a coin");
        return;
      }
      if (amount === "" || amount === null) {
        resetAmounts();
      } else {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
          // if (parsedAmount > Number(toBalance)) {
          //   setToAmountError("Amount cannot exceed balance");
          //   setToAmount('');
          // } else {
          setToAmountError("");
          setToAmount(amount);

          if (fromCoin && parsedAmount) {
            setAssistMessage("Fetching converted amount...");
            await fetchAndSetConvertedAmount(
              toCoin,
              fromCoin,
              parsedAmount,
              "to",
            );
          }
          // }
        } else {
          setToAmount("");
          setToAmountError("Please enter a valid number");
        }
      }
    } catch (error) {
      setFromAmount("");
      setFromAmountError("");
      setFromAmountDisabled(false);
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

  const handleSwap = async () => {
    if (fromAmountError || toAmountError) {
      return;
    }
    if (!Number(fromAmount) || !Number(toAmount)) {
      setAssistMessage("Enter valid amount!!");
      return;
    }
    if (!fromCoin || !toCoin) {
      return;
    }
    if (!wallet_address) {
      return;
    }
    setShowConfirmSwap(true);
  };

  const handleConfirmSwap = async () => {
    try {
      setTimeout(() => {
        setShowConfirmSwap(false), resetAmounts();
      }, 1000);
      await executeSwap(
        fromCoin,
        toCoin,
        swapTokenPath,
        Number(fromAmount),
        Number(toAmount),
        rawConvAmount,
        setAssistMessage,
      );
      setAssistMessage("");
      // resetAmounts();
      toast({
        title: "Success",
        description: "Congratulations!! Swap Successful.",
      });
    } catch (e) {
      setAssistMessage("");
      toast({
        title: "Error",
        description: e.message,
      });
    }
  };
  /*  */

  return {
    fromCoin,
    setFromCoin,
    toCoin,
    setToCoin,
    fromAmountDisabled,
    setFromAmountDisabled,
    toAmountDisabled,
    setToAmountDisabled,
    fromBalance,
    toBalance,
    handleSwitchCoins,
    handleConnectWallet,
    wallet_address,
    handleSwap,
    loadingPayBalance,
    loadingReceiveBalance,
    showConfirmSwap,
    setShowConfirmSwap,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    handleChangeFromAmount,
    handleChangeToAmount,
    fromAmountError,
    toAmountError,
    assistMessage,
    handleConfirmSwap,
  };
};

export default useSwapSection;
