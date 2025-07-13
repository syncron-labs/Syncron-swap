import { Button } from "@/src/components/ui/button";
import useIncreaseLiquidity from "@/src/hooks/useIncreaseLiquidity";
import { IRootState } from "@/store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import PreviewLiquidity from "./previewLiquidity.section";
import LoadingModal from "@/src/components/loader/loader.section";
import { beautifyNumber, empty } from "@/src/utils/corefunctions";
import {
  INFINITY_TEXT,
  LIQUIDITY_PRICE_RANGE,
  PoolFeeText,
} from "@/src/utils/coreconstants";
import {
  PositionInfo,
  renderLiquidityRangePrice,
} from "@/src/utils/uniswap/liquidity";

const IncreaseLiquidity = () => {
  const router = useRouter();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const {
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
    handleSwitchCoins,
    handleConnectWallet,
    handleFromDepositAmountChange,
    handleToDepositAmountChange,
    handleIncreaseLiquidity,
  } = useIncreaseLiquidity();

  const renederDepositAmount = (amount: string): string => {
    return amount;
    // return amount ? noExponents(beautifyNumber(amount)) : amount;
  };

  const renderCoinPerText = () => {
    return `${toCoin?.basic.code} per ${fromCoin?.basic.code}`;
  };

  return chain_id ? (
    <div className="flex flex-col container mt-36 rounded-xl max-w-2xl border border-slate-800 py-6  ">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft
          className="text-white text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl text-white  font-bold ">Increase Liquidity</h1>
        <div className=""></div>
      </div>
      <div className="border-b border-slate-800"></div>

      {loading ? (
        <div className="flex mt-6 justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          {/* Top data */}
          <div className="my-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center ">
                <div className="relative">
                  <img
                    src={fromCoin?.basic.icon}
                    className="h-7 w-7 ml-[20] rounded-full"
                    alt=""
                  />
                  <img
                    src={toCoin?.basic.icon}
                    className="h-7 w-7 top-0 absolute left-2  rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex items-center gap-2 ml-5">
                  <h3 className="text-2xl font-medium text-white">
                    {fromCoin?.basic.code} / {toCoin?.basic.code}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* <span className="flex items-center text-green-500 text-xs gap-2">
                  In Range
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </span> */}
                {positionDetails?.closed ? (
                  <span className="text-xs text-gray-500">Closed</span>
                ) : positionDetails?.inRange ? (
                  <span className="text-xs text-green-500">In Range</span>
                ) : (
                  <span className="text-xs text-yellow-500">Out of Range</span>
                )}
              </div>
            </div>
          </div>
          {/*  */}

          {/* from to coin */}
          <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-xl mx-2">
            <div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <img
                    src={fromCoin?.basic.icon}
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>{fromCoin?.basic.code}</h1>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>
                    {beautifyNumber(
                      positionDetails?.other_details.token0Amount,
                      3,
                    )}
                  </h1>
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <img
                    src={toCoin?.basic.icon}
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>{toCoin?.basic.code}</h1>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>
                    {beautifyNumber(
                      positionDetails?.other_details.token1Amount,
                      3,
                    )}
                  </h1>
                </div>
              </div>
              <div className="border-b border-slate-800  mx-4"></div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>Fee Tier</h1>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>{PoolFeeText[positionDetails?.fee]}%</h1>
                </div>
              </div>
            </div>
          </div>
          {/*  */}

          {/* price range */}
          <div className=" rounded-3xl  mt-4">
            <div className="my-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 ml-5">
                    <span className="flex items-center text-white text-xs gap-2">
                      Selected range
                    </span>
                  </div>
                </div>

                {/* switch coin */}
                {/* <div className="border rounded-3xl flex justify-between items-center gap-2 text-gray-400 border-slate-800 mr-3 text-xs">
                  <div
                    className={`px-3 rounded-3xl py-1 text-white font-normal cursor-pointer ${selectedCoin === firstCoin?.basic.code ? "bg-slate-900" : ""}`}
                    onClick={() => {
                      if (selectedCoin === firstCoin?.basic.code) {
                        return;
                      }
                      setSelectedCoin(firstCoin.basic.code);
                      handleSwitchCoins();
                    }}
                  >
                    {firstCoin?.basic.code}
                  </div>
                  <div
                    className={`px-3 rounded-3xl py-1 text-white font-normal cursor-pointer ${selectedCoin === secondCoin?.basic.code ? "bg-slate-900" : ""}`}
                    onClick={() => {
                      if (selectedCoin === secondCoin?.basic.code) {
                        return;
                      }
                      setSelectedCoin(secondCoin?.basic.code);
                      handleSwitchCoins();
                    }}
                  >
                    {secondCoin?.basic.code}
                  </div>
                </div> */}
                {/*  */}
              </div>
            </div>
            <div className="flex items-center justify-center rounded-3xl mb-5 mx-3">
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Min Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {renderLiquidityRangePrice(
                    lowPrice,
                    positionDetails?.tickLower,
                    positionDetails?.fee,
                  )}
                  {""}
                </h1>
                <p className="text-gray-400 text-md font-medium">
                  {renderCoinPerText()}
                </p>
              </div>
              <div className="w-[40px] flex items-center justify-center rounded-md h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-move-horizontal h-6 w-6 text-gray-400"
                >
                  <polyline points="18 8 22 12 18 16" />
                  <polyline points="6 8 2 12 6 16" />
                  <line x1={2} x2={22} y1={12} y2={12} />
                </svg>
              </div>
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {renderLiquidityRangePrice(
                    highPrice,
                    positionDetails?.tickUpper,
                    positionDetails?.fee,
                  )}
                  {""}
                </h1>
                <p className="text-gray-400 text-md font-medium">
                  {renderCoinPerText()}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 mt-5 mb-5 border border-slate-800 rounded-3xl bg-slate-900 mx-3 py-3">
              <h1 className="text-gray-400 text-md font-medium">
                Current price
              </h1>
              <h1 className="text-white text-xl font-bold">
                {beautifyNumber(positionDetails?.currentPrice, 3)}
              </h1>
              <p className="text-gray-400 text-md font-medium">
                {renderCoinPerText()}
              </p>
            </div>
          </div>
          {/*  */}

          {/* deposit amounts */}
          <div>
            {fromCoin && fromDepositShow && (
              <div className="grid w-full items-center gap-4 mb-4">
                <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col items-start space-y-1.5 w-full">
                      <input
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        className={`flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 
                        file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 
                        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                        bg-transparent p-0 border ${
                          fromAmountError ? "border-red-500" : "border-none"
                        } text-white placeholder:text-gray-400 text-xl 
                        placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none`}
                        id="fromAmount"
                        placeholder="0"
                        value={renederDepositAmount(fromDepositAmount)}
                        onChange={(e) =>
                          handleFromDepositAmountChange(e.target.value)
                        }
                      />
                      {fromAmountError && (
                        <p className="text-red-500 text-[10px] mt-1 mr-3">
                          {fromAmountError}
                        </p>
                      )}
                      {/* <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                        -
                      </label> */}
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[150px] space-y-1.5 text-white">
                      <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                        <img
                          src={fromCoin?.basic?.icon}
                          className="w-7 h-7"
                          alt=""
                        />
                        <h1>{fromCoin?.token_info?.symbol}</h1>
                      </div>
                      <div className="min-w-[200px] flex flex-col items-end">
                        <span>
                          Balance:{" "}
                          {empty(fromBalance)
                            ? "-"
                            : beautifyNumber(fromBalance)}
                        </span>
                        {/* <span className="text-primary bg-primary bg-opacity-30 ml-2 text-sm px-2 py-1 rounded-md">
                          Max
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {toCoin && toDepositShow && (
              <div className="grid w-full items-center gap-4 mb-4">
                <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col items-start space-y-1.5 w-full">
                      <input
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        className={`flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 
                        file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 
                        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                        bg-transparent p-0 border ${
                          toAmountError ? "border-red-500" : "border-none"
                        } text-white placeholder:text-gray-400 text-xl 
                        placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none`}
                        id="youPay"
                        placeholder="0"
                        value={renederDepositAmount(toDepositAmount)}
                        onChange={(e) =>
                          handleToDepositAmountChange(e.target.value)
                        }
                      />
                      {toAmountError && (
                        <p className="text-red-500 text-[10px] mt-1 mr-3">
                          {toAmountError}
                        </p>
                      )}
                      {/* <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                        -
                      </label> */}
                    </div>
                    <div className="flex flex-col min-w-[150px] items-end gap-2 space-y-1.5 text-white">
                      <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                        <img
                          src={toCoin?.basic?.icon}
                          className="w-7 h-7"
                          alt=""
                        />
                        <h1>{toCoin?.token_info?.symbol}</h1>
                      </div>
                      <div className="min-w-[200px] flex flex-col items-end">
                        <span>
                          Balance:{" "}
                          {empty(toBalance) ? "-" : beautifyNumber(toBalance)}
                        </span>
                        {/* <span className="text-primary bg-primary bg-opacity-30 ml-2 text-sm px-2 py-1 rounded-md">
                          Max
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/*  */}

          <LoadingModal
            openStatus={loadingModal}
            setOpenStatus={setLoadingModal}
            text={assistMessage}
          />

          <PreviewLiquidity
            openStatus={preview}
            setOpenStatus={setPreview}
            fromCoin={fromCoin}
            toCoin={toCoin}
            fee={positionDetails?.fee}
            fromAmount={fromDepositAmount}
            toAmount={toDepositAmount}
            submitHandler={handleIncreaseLiquidity}
            title="Increase Liquidity"
            submitButtonText="Increase"
            handleSwitchCoins={handleSwitchCoins}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            currentPrice={price}
            lowPrice={positionDetails?.minPrice?.toString()}
            highPrice={positionDetails?.maxPrice?.toString()}
            tickLower={positionDetails?.tickLower}
            tickUpper={positionDetails?.tickUpper}
            inRange={inRange}
            firstCoin={firstCoin}
            secondCoin={secondCoin}
          />
          {!walletAddress ? (
            <Button
              onClick={handleConnectWallet}
              className="bg-[#ccff004a] text-black py-7 text-xl font-semibold 
            rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              disabled={!formReady}
              className="bg-[#ccff004a] text-black py-7 text-xl font-semibold rounded-2xl 
            w-full hover:text-white hover:bg-primary hover:border-primary"
              onClick={() => setPreview(true)}
            >
              Preview
            </Button>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="max-w-[800px] min-h-[500px] w-[90%] h-auto text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.push("/pool")}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="cursor-pointer" />
          Back to Pool
        </span>
      </div>
    </div>
  );
};

export default IncreaseLiquidity;
