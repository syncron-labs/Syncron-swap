"use client";
import React, { useEffect } from "react";
import Navbar from "../navbar";
import {
  getAddress,
  getChainInfo,
  getProvider,
  isDisconnected,
} from "@/src/utils/wallet";
import { IRootState } from "@/store";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { useDispatch, useSelector } from "react-redux";

const LayoutWithHeader = ({ children }: { children: React.ReactNode }) => {
  const { chain_id, block_number } = useSelector(
    (state: IRootState) => state.wallet,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const provider = getProvider();
    provider && provider.off("block");
    provider &&
      provider.on("block", async (blockNumber: number) => {
        // console.log(`New block mined: ${blockNumber}`);
        let address: string = undefined;
        let chain_id: number = undefined;
        if (!isDisconnected()) {
          address = await getAddress(provider);
          chain_id = await getChainInfo(provider);
        } else {
          blockNumber = 0;
        }
        dispatch(
          setWallet<walletSliceType>({
            wallet_address: address,
            chain_id,
            block_number: blockNumber,
          }),
        );
      });

    return () => {
      provider && provider.off("block");
    };
  }, [chain_id]);

  return (
    <>
      <Navbar />
      {children}
      <div className="bg-slate-950 h-auto flex flex-col justify-start">
        <span className="text-left text-xs p-2 text-green-500">
          Block: {chain_id ? block_number : "N/A"}
        </span>
      </div>
    </>
  );
};

export default LayoutWithHeader;
