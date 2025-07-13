import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ArrowDown } from "lucide-react";
import useSwapSection from "@/src/hooks/useSwap";
import SelectCoinSection from "../global/selectCoin.section";
import ConfirmSwapSection from "./confirmSwap.section";
import { beautifyNumber, empty } from "@/src/utils/corefunctions";

const SwapSection = () => {
  const {
    fromCoin,
    setFromCoin,
    toCoin,
    setToCoin,
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
    toAmount,
    fromAmountDisabled,
    setFromAmountDisabled,
    toAmountDisabled,
    setToAmountDisabled,
    handleChangeFromAmount,
    handleChangeToAmount,
    fromAmountError,
    toAmountError,
    assistMessage,
    handleConfirmSwap,
  } = useSwapSection();

  const renderBalance = (balance: string | number | null, loading: boolean) => {
    // if (loading) {
    //   return (
    //     <p className="text-white text-[10px] mt-1 mr-3">Fetching balance...</p>
    //   );
    // } else if (balance !== null) {
    //   return (
    //     <p className="text-white text-[10px] mt-1 mr-3">Balance : {balance}</p>
    //   );
    // }
    return (
      <p className="text-white text-[10px] mt-1 mr-3">
        Balance : {empty(balance) ? "-" : beautifyNumber(balance)}
      </p>
    );
  };

  return (
    <section className="mt-36">
      <Card className="w-[350px] md:w-[450px] shadow-[0_0_80px_10px_#ccff004a] shadow-primary/20 border border-slate-800 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-white text-base font-medium px-2 py-2">
            Swap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConfirmSwapSection
            openStatus={showConfirmSwap}
            setOpenStatus={setShowConfirmSwap}
            fromCoin={fromCoin}
            toCoin={toCoin}
            fromAmount={fromAmount}
            toAmount={toAmount}
            handleConfirmSwap={handleConfirmSwap}
          />
          <form name="swap-form" id="swap-form">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <Label htmlFor="name" className="text-gray-400">
                  You Pay
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-start space-y-1.5">
                    <Input
                      id="youPay"
                      type="text"
                      // step="any"
                      disabled={!wallet_address || fromAmountDisabled}
                      className={`bg-transparent p-0 border ${
                        fromAmountError ? "border-red-500" : "border-none"
                      } text-white placeholder:text-gray-400 text-4xl placeholder:text-4xl py-7 font-medium focus:outline-none focus:border-none`}
                      placeholder="0"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      value={fromAmount}
                      onChange={(e) => handleChangeFromAmount(e.target.value)}
                    />
                    {fromAmountError && (
                      <p className="text-red-500 text-[10px] mt-1 mr-3">
                        {fromAmountError}
                      </p>
                    )}
                  </div>

                  <div className="flex min-w-[200px] flex-col items-end space-y-1.5">
                    <SelectCoinSection
                      coin={fromCoin}
                      setCoin={setFromCoin}
                      handleConnectWallet={handleConnectWallet}
                      walletAddress={wallet_address}
                    />
                    {renderBalance(fromBalance, loadingPayBalance)}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute -translate-x-1/2 border-[4px] border-slate-950 -translate-y-1/2 flex w-10 h-10 bg-slate-900 rounded-xl items-center justify-center left-1/2 hover:bg-slate-800 hover:border-slate-700 cursor-pointer"
              onClick={handleSwitchCoins}
            >
              <ArrowDown className="mx-auto text-3xl text-white" size={15} />
            </div>
            <div className="grid w-full mt-2 items-center gap-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <Label htmlFor="name" className="text-gray-400">
                  You Receive
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-start space-y-1.5">
                    <Input
                      id="youReceive"
                      type="text"
                      // step="any"
                      // inputMode="decimal"
                      disabled={!wallet_address || toAmountDisabled}
                      className={`bg-transparent p-0 border ${
                        toAmountError ? "border-red-500" : "border-none"
                      } text-white placeholder:text-gray-400 text-4xl placeholder:text-4xl py-7 font-medium focus:outline-none focus:border-none`}
                      placeholder="0"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      value={toAmount}
                      onChange={(e) => handleChangeToAmount(e.target.value)}
                    />
                    {toAmountError && (
                      <p className="text-red-500 text-[10px] mt-1 mr-3">
                        {toAmountError}
                      </p>
                    )}
                  </div>

                  <div className="flex min-w-[200px] flex-col items-end space-y-1.5">
                    <SelectCoinSection
                      coin={toCoin}
                      setCoin={setToCoin}
                      handleConnectWallet={handleConnectWallet}
                      walletAddress={wallet_address}
                    />
                    {renderBalance(toBalance, loadingReceiveBalance)}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!wallet_address ? (
            <Button
              onClick={handleConnectWallet}
              className="bg-[#ccff004a] text-black py-7 text-xl font-semibold 
            rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={handleSwap}
              className="bg-[#ccff004a] text-black py-7 text-xl font-semibold rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary"
            >
              Swap
            </Button>
          )}
        </CardFooter>
      </Card>
      <h1 className="text-white text-center mt-10">{assistMessage}</h1>
    </section>
  );
};

export default SwapSection;
