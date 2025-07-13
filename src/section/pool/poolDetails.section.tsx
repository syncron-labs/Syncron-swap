import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoveHorizontal } from "lucide-react";
import { INFINITY_TEXT, PoolFeeText } from "@/src/utils/coreconstants";
import usePoolDetails from "@/src/hooks/useDetailsLiquidity";
import Link from "next/link";
import RemoveOrClaimFeesModal from "./removeOrclaimFeesModal.section";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import {
  beautifyNumber,
  clearBothEndSlash,
  clearTrailingSlash,
  formatAmountKnL,
} from "@/src/utils/corefunctions";
import {
  CHAIN_SLUG_MAPPING,
  NETWORK_DATA,
} from "@/src/utils/network/network-data";
import { CoinData } from "@/src/utils/types";
import {
  PositionInfo,
  renderLiquidityRangePrice,
} from "@/src/utils/uniswap/liquidity";
import LoadingModal from "@/src/components/loader/loader.section";

const PoolDetailsSection = () => {
  const router = useRouter();

  const {
    fromCoin,
    toCoin,
    positionDetails,
    loading,
    firstCoin,
    secondCoin,
    selectedCoin,
    tokenId,
    openClaim,
    loadingModal,
    assistMessage,
    setOpenClaim,
    setSelectedCoin,
    setLoadingModal,
    handleSwitchCoins,
    handleClaimFees,
  } = usePoolDetails();

  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const isOwner = (): boolean => {
    return walletAddress?.toLowerCase() == positionDetails?.owner.toLowerCase();
  };

  const network_data = NETWORK_DATA[CHAIN_SLUG_MAPPING[chain_id]];

  const tokenLink = (coin: CoinData) => {
    if (!coin) return "";

    const explorer = network_data.explorer_info;
    const base_url = clearTrailingSlash(explorer.base_url);
    const token_endpoint = clearBothEndSlash(explorer.token_endpoint);

    return `${base_url}/${token_endpoint}/${coin.token_info.address}`;
  };

  const renderCoinPerText = () => {
    return `${toCoin?.basic.code} per ${fromCoin?.basic.code}`;
  };

  return chain_id ? (
    <div className="max-w-[800px] min-h-[500px] w-[90%] h-auto text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.push("/pool")}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="" />
          Back to Pool
        </span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          {/* Top */}
          <div className="my-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center ">
                <div className="relative">
                  <img
                    src={`${fromCoin?.basic.icon}`}
                    className="h-7 w-7 ml-[20] rounded-full"
                    alt=""
                  />
                  <img
                    src={`${toCoin?.basic.icon}`}
                    className="h-7 w-7 top-0 absolute left-2  rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex items-center gap-2 ml-5">
                  <h3 className="text-2xl font-medium text-white">
                    {fromCoin?.basic.code} / {toCoin?.basic.code}
                  </h3>
                  <span className="text-sm bg-slate-900 px-2 rounded-full py-1 sm:text-xs text-gray-400">
                    {PoolFeeText[positionDetails?.fee]} %
                  </span>
                  {/* <span className="flex items-center text-green-500 text-xs gap-2">
                    In Range
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </span> */}
                  {positionDetails?.closed ? (
                    <span className="text-xs text-gray-500">Closed</span>
                  ) : positionDetails?.inRange ? (
                    <span className="text-xs text-green-500">In Range</span>
                  ) : (
                    <span className="text-xs text-yellow-500">
                      Out of Range
                    </span>
                  )}
                </div>
              </div>
              {isOwner() && (
                <div className="flex items-center gap-2">
                  <Link href={`/pool/increase/${tokenId}`}>
                    <div className="px-3 rounded-3xl py-2 text-sm text-gray-400 border border-slate-800">
                      Increase Liquidity
                    </div>
                  </Link>
                  {!positionDetails?.closed && (
                    <Link href={`/pool/remove/${tokenId}`}>
                      <div className="bg-primary px-3 rounded-3xl py-2 text-sm text-white font-bold">
                        Remove Liquidity
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2  gap-5">
            {/* Image */}
            <div className="border border-slate-800 flex items-center justify-center rounded-3xl p-5">
              <img
                src={positionDetails?.other_details?.imgSrc}
                className="h-[320px] "
                alt=""
              />
            </div>

            <div className="flex gap-16 flex-col h-full">
              <div className="border rounded-3xl border-slate-800">
                <h1 className="p-2 text-white text-md font-medium">
                  Liquidity
                </h1>
                {/* <div className="text-white text-2xl font-bold p-2">
                  {positionDetails && "-"}
                </div> */}
                <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-3xl mx-2">
                  {positionDetails && (
                    <div>
                      {fromCoin && (
                        <div className="flex justify-between items-center px-2">
                          <a href={tokenLink(fromCoin)} target="_blank">
                            <div className="flex items-center gap-2 p-2 rounded-3xl">
                              <img
                                src={`${fromCoin?.basic.icon}`}
                                className="h-7 w-7 rounded-full"
                                alt=""
                              />
                              <h1>{fromCoin?.basic.code}</h1>
                            </div>
                          </a>
                          <div className="flex items-center gap-2 p-2 rounded-3xl">
                            <h1>
                              {beautifyNumber(
                                positionDetails?.other_details.token0Amount,
                                3,
                              )}
                            </h1>
                            <h1>
                              {
                                positionDetails?.other_details
                                  .token0AmountPercent
                              }{" "}
                              %
                            </h1>
                          </div>
                        </div>
                      )}
                      {toCoin && (
                        <div className="flex justify-between items-center px-2">
                          <a href={tokenLink(toCoin)} target="_blank">
                            <div className="flex items-center gap-2 p-2 rounded-3xl">
                              <img
                                src={`${toCoin?.basic.icon}`}
                                className="h-7 w-7 rounded-full"
                                alt=""
                              />
                              <h1>{toCoin?.basic.code}</h1>
                            </div>
                          </a>
                          <div className="flex items-center gap-2 p-2 rounded-3xl">
                            <h1>
                              {beautifyNumber(
                                positionDetails?.other_details.token1Amount,
                                3,
                              )}
                            </h1>
                            <h1>
                              {
                                positionDetails?.other_details
                                  .token1AmountPercent
                              }{" "}
                              %
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-3xl border-slate-800">
                <div className="flex justify-between items-center m-2">
                  <h1 className="p-2 text-white text-md font-medium">
                    Unclaimed fees
                  </h1>
                  {isOwner() &&
                  (positionDetails?.other_details.token0UnclaimedFee ||
                    positionDetails?.other_details.token1UnclaimedFee) ? (
                    <button
                      className="bg-primary px-3 rounded-3xl py-2 text-sm text-white font-bold"
                      onClick={() => {
                        setOpenClaim(true);
                      }}
                    >
                      Collect Fees
                    </button>
                  ) : (
                    ""
                  )}
                </div>

                {/* <div className="text-white text-2xl font-bold p-2">{"-"}</div> */}

                <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-3xl mx-2">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <img
                        src={`${fromCoin?.basic.icon}`}
                        className="h-7 w-7 rounded-full"
                        alt=""
                      />
                      <h1>{fromCoin?.basic.code}</h1>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <h1>
                        {beautifyNumber(
                          positionDetails?.other_details.token0UnclaimedFee,
                          3,
                        )}
                      </h1>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <img
                        src={`${toCoin?.basic.icon}`}
                        className="h-7 w-7 rounded-full"
                        alt=""
                      />
                      <h1>{toCoin?.basic.code}</h1>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <h1>
                        {beautifyNumber(
                          positionDetails?.other_details.token1UnclaimedFee,
                          3,
                        )}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-800 rounded-3xl  mt-4">
            <div className="my-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 ml-5">
                    <span className="">Price range</span>
                    <span className="flex items-center text-green-500 text-xs gap-2">
                      {/* {positionDetails?.inRange ? "In Range" : "Out of Range"}
                      <div
                        className={`h-2 w-2 ${positionDetails?.inRange ? "bg-green-500" : "bg-red-500"} rounded-full`}
                      ></div> */}
                      {positionDetails?.closed ? (
                        <span className="text-gray-500">Closed</span>
                      ) : positionDetails?.inRange ? (
                        <span className="text-green-500">In Range</span>
                      ) : (
                        <span className="text-yellow-500">Out of Range</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* swap section */}
                {/* <div className="border rounded-3xl flex justify-between items-center gap-2 text-gray-400 border-slate-800 mr-3 text-xs">
                  <div
                    className={`px-3 rounded-3xl py-1 text-white font-normal cursor-pointer ${selectedCoin === firstCoin?.basic.code ? "bg-slate-900" : ""}`}
                    onClick={() => {
                      if (selectedCoin === firstCoin?.basic.code) {
                        return;
                      }
                      setSelectedCoin(firstCoin?.basic.code);
                      handleSwapCoin();
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
                      handleSwapCoin();
                    }}
                  >
                    {secondCoin?.basic.code}
                  </div>
                </div> */}
              </div>
            </div>

            <div className="flex items-center justify-center rounded-3xl mb-5 mx-3">
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Min Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {renderLiquidityRangePrice(
                    positionDetails?.minPrice,
                    positionDetails?.tickLower,
                    positionDetails?.fee,
                  )}{" "}
                </h1>
                <p className="text-gray-400 text-md font-medium">
                  {renderCoinPerText()}
                </p>
              </div>
              <div className="w-[40px] flex items-center justify-center rounded-md h-full">
                <MoveHorizontal className="h-6 w-6 text-gray-400" />
              </div>
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {renderLiquidityRangePrice(
                    positionDetails?.maxPrice,
                    positionDetails?.tickUpper,
                    positionDetails?.fee,
                  )}{" "}
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
        </div>
      )}

      <RemoveOrClaimFeesModal
        openStatus={openClaim}
        setOpenStatus={setOpenClaim}
        coinA={fromCoin}
        coinB={toCoin}
        amounA={positionDetails?.other_details.token0UnclaimedFee}
        amounB={positionDetails?.other_details.token1UnclaimedFee}
        submitHandler={handleClaimFees}
        title="Claim Fees"
        submitText="Claim"
      />

      <LoadingModal
        openStatus={loadingModal}
        setOpenStatus={setLoadingModal}
        text={assistMessage}
      />
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

export default PoolDetailsSection;
