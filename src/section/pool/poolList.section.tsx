"use client";
import { PoolFeeText } from "@/src/utils/coreconstants";
import { COIN_BAISC_DATA } from "@/src/utils/network/coin-data";
import {
  PositionInfo,
  renderLiquidityRangePrice,
  getPositions,
} from "@/src/utils/uniswap/liquidity";
import { IRootState } from "@/store";
import { Plus, Rows3 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PoolListSection = () => {
  const [positions, setPositions] = useState<PositionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClosed, setShowClosed] = useState(false);

  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const handlePositionList = async (load = true) => {
    try {
      if (load) setLoading(true);
      const positions = walletAddress ? await getPositions() : [];
      setPositions(positions);
      if (load) setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePositionList();
  }, [walletAddress, chain_id]);

  useEffect(() => {
    handlePositionList(false);
  }, [block_number]);

  const toggleClosedShowHide = () => {
    setShowClosed((prev) => !prev);
  };

  const renderCoinPerText = (position: PositionInfo) => {
    return `${position.token1.symbol} per ${position.token0.symbol}`;
  };

  return (
    <div className="container text-white mt-20 md:mt-36 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold">Positions</div>
        <Link href={"/pool/add"}>
          <button className="bg-primary text-black font-bold py-2 px-4 rounded-full flex flex-row items-center text-sm md:text-base hover:opacity-80 transition-opacity w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" /> New Position
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border border-slate-800 rounded-lg py-4  flex flex-col">
          <div className="flex justify-between mb-4 border-b border-slate-800 pb-4 px-4">
            <h2 className="text-xs ">Your positions ({positions.length})</h2>
            <h2
              className="text-xs underline cursor-pointer"
              onClick={toggleClosedShowHide}
            >
              {showClosed ? "Hide Closed" : "Show Closed"}
            </h2>
          </div>
          {positions.map((position, idx) =>
            !position.closed || showClosed ? (
              <Link key={idx} href={`/pool/${position.tokenId}`}>
                <div className="flex flex-col sm:flex-row rounded-lg py-4 sm:py-5 items-start sm:items-center justify-between px-4 hover:bg-slate-800/50 transition-colors">
                  <div className="w-full sm:w-auto">
                    <div className="flex items-center mb-2">
                      <div className="relative flex-shrink-0">
                        <img
                          src={COIN_BAISC_DATA[position.token0.symbol].icon}
                          className="h-6 w-6 sm:h-7 sm:w-7 rounded-full"
                          alt=""
                        />
                        <img
                          src={COIN_BAISC_DATA[position.token1.symbol].icon}
                          className="h-6 w-6 sm:h-7 sm:w-7 top-0 absolute left-2 rounded-full"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 ml-4 sm:ml-5">
                        <h3 className="text-sm sm:text-base font-medium text-white">
                          {position.token0.symbol} / {position.token1.symbol}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-400">
                          {PoolFeeText[position.fee]}%
                        </span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm space-y-1 sm:space-y-0">
                      <div className="block sm:inline">
                        <span className="text-gray-500">
                          Min:{" "}
                          <span className="text-white">
                            {renderLiquidityRangePrice(
                              position.minPrice,
                              position.tickLower,
                              position.fee,
                            )}{" "}
                            <span className="hidden sm:inline">{renderCoinPerText(position)}</span>
                          </span>
                        </span>
                      </div>
                      <div className="block sm:inline sm:ml-4">
                        <span className="text-gray-500">
                          Max:{" "}
                          <span className="text-white">
                            {renderLiquidityRangePrice(
                              position.maxPrice,
                              position.tickUpper,
                              position.fee,
                            )}{" "}
                            <span className="hidden sm:inline">{renderCoinPerText(position)}</span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex justify-start sm:justify-end">
                    <span className="font-medium text-xs sm:text-sm px-2 py-1 rounded-full border">
                      {position.closed ? (
                        <span className="text-gray-500 border-gray-500">Closed</span>
                      ) : position.inRange ? (
                        <span className="text-green-400 border-green-400">In Range</span>
                      ) : (
                        <span className="text-yellow-400 border-yellow-400">Out of Range</span>
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              ""
            ),
          )}
          {positions.length === 0 && (
            <div className="text-center mt-4 text-gray-500">
              <Rows3 className="h-20 w-20 mx-auto" />
              <span className="">No positions to show</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolListSection;
