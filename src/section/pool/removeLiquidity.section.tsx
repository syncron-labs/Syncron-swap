import { Slider } from "@/src/components/ui/slider";
import useRemoveLiquidity from "@/src/hooks/useRemoveLiquidity";
import { IRootState } from "@/store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import RemoveOrClaimFeesModal from "./removeOrclaimFeesModal.section";
import LoadingModal from "@/src/components/loader/loader.section";

const RemoveLiquidity = () => {
  const router = useRouter();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const {
    positionDetails,
    fromCoin,
    toCoin,
    fromAmount,
    toAmount,
    percent,
    assistMessage,
    formReady,
    preview,
    loading,
    loadingModal,
    setPreview,
    setLoadingModal,
    handlePercentChange,
    handleRemoveLiquidity,
  } = useRemoveLiquidity();

  return chain_id ? (
    <div className="flex flex-col container mt-20 rounded-xl max-w-md border border-slate-800 py-6">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft
          className="text-white text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-sm text-white  font-bold ">Remove Liquidity</h1>
        <div className=""></div>
      </div>

      {loading ? (
        <div className="flex mt-6 justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
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
                  <h3 className="text-xl font-medium text-white">
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

          <div className="border mb-2 p-4 bg-slate-900 text-gray-400 border-slate-800 rounded-xl ">
            <p>Amount</p>
            <div className="w-full flex gap-3 justify-between items-center">
              <div className="w-1/4">
                <h1 className="text-4xl font-bold text-white">{percent}%</h1>
              </div>
              <div className="w-3/4 grid grid-cols-4 gap-2">
                <div
                  className="bg-primary/30 flex cursor-pointer justify-center items-center rounded-xl text-primary text-xs py-2 "
                  onClick={() => handlePercentChange(25)}
                >
                  25%
                </div>
                <div
                  className="bg-primary/30 flex cursor-pointer justify-center items-center rounded-xl text-primary text-xs py-2 "
                  onClick={() => handlePercentChange(50)}
                >
                  50%
                </div>
                <div
                  className="bg-primary/30 flex cursor-pointer justify-center items-center rounded-xl text-primary text-xs py-2 "
                  onClick={() => handlePercentChange(75)}
                >
                  75%
                </div>
                <div
                  className="bg-primary/30 flex cursor-pointer justify-center items-center rounded-xl text-primary text-xs py-2 "
                  onClick={() => handlePercentChange(100)}
                >
                  100%
                </div>
              </div>
            </div>

            <div className="my-5 cursor-pointer">
              <Slider
                value={[percent]}
                min={0}
                max={100}
                step={1}
                onValueChange={(amount) => {
                  console.log("percent: ", amount[0]);
                  handlePercentChange(amount[0]);
                }}
              />
            </div>
          </div>

          <div className="border mb-2 mt-6 bg-slate-900 text-gray-400 border-slate-800 rounded-xl  ">
            <div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>{fromCoin?.basic.code}</h1>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>{fromAmount}</h1>
                  <img
                    src={fromCoin?.basic.icon}
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>{toCoin?.basic.code}</h1>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>{toAmount}</h1>
                  <img
                    src={toCoin?.basic.icon}
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="items-center pt-2 flex justify-between">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap 
          ring-offset-background transition-colors focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 h-10 px-4 bg-[#ccff004a] 
          text-black py-7 text-xl font-semibold rounded-2xl w-full hover:text-white
          hover:bg-primary hover:border-primary"
              onClick={() => setPreview(true)}
              disabled={!formReady}
            >
              Preview
            </button>
          </div>

          <RemoveOrClaimFeesModal
            openStatus={preview}
            setOpenStatus={setPreview}
            coinA={fromCoin}
            coinB={toCoin}
            amounA={fromAmount}
            amounB={toAmount}
            submitHandler={handleRemoveLiquidity}
            title="Decrease or Remove"
            submitText="Confirm"
          />

          <LoadingModal
            openStatus={loadingModal}
            setOpenStatus={setLoadingModal}
            text={assistMessage}
          />
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

export default RemoveLiquidity;
