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
    <div className="container text-white mt-36 px-72">
      <div className="flex justify-between items-center mb-6">
        <div className="text-4xl font-bold">Positions</div>
        <Link href={"/pool/add"}>
          <button className="bg-primary text-white font-bold py-2 px-4 rounded-full flex flex-row items-center">
            <Plus className="h-5 w-5 mr-2" /> New Position
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
                <div className="flex rounded-lg py-5 flex-row items-center justify-between px-4">
                  <div className="">
                    <div className="flex items-center mb-2">
                      <div className="relative">
                        <img
                          src={COIN_BAISC_DATA[position.token0.symbol].icon}
                          className="h-7 w-7 ml-[20] rounded-full"
                          alt=""
                        />
                        <img
                          src={COIN_BAISC_DATA[position.token1.symbol].icon}
                          className="h-7 w-7 top-0 absolute left-2  rounded-full"
                          alt=""
                        />
                      </div>
                      <div className="flex items-center gap-2 ml-5">
                        <h3 className="text-[16px] font-medium text-white">
                          {position.token0.symbol} / {position.token1.symbol}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {PoolFeeText[position.fee]}%
                        </span>
                      </div>
                    </div>

                    <div className="text-[14px]">
                      <span className=" mr-2 text-gray-500">
                        Min:{" "}
                        <span className="text-white">
                          {renderLiquidityRangePrice(
                            position.minPrice,
                            position.tickLower,
                            position.fee,
                          )}{" "}
                          {renderCoinPerText(position)}
                        </span>
                      </span>
                      ... {"  "}
                      <span className=" text-gray-500 ">
                        Max:{" "}
                        <span className="text-white">
                          {renderLiquidityRangePrice(
                            position.maxPrice,
                            position.tickUpper,
                            position.fee,
                          )}{" "}
                          {renderCoinPerText(position)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-[14px] text-gray-400 mr-2">
                      {position.closed ? (
                        <span className="text-gray-500">Closed</span>
                      ) : position.inRange ? (
                        <span className="text-green-500">In Range</span>
                      ) : (
                        <span className="text-yellow-500">Out of Range</span>
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
