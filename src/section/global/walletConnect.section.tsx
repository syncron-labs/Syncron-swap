import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Check, Copy, Power } from "lucide-react";
import { useWallet } from "@/src/hooks/useWallet";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import {
  CHAIN_SLUG_MAPPING,
  NETWORK_DATA,
} from "@/src/utils/network/network-data";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { Button } from "@/src/components/ui/button";
import { ellipseAddress } from "@/src/utils/wallet";

const WalletConnectSection = () => {
  const { connect, disconnect, balance } = useWallet();
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const { wallet_address, chain_id, open_wallet_sidebar } = useSelector(
    (state: IRootState) => state.wallet,
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
      setShowCheckIcon(true);
      setTimeout(() => {
        setShowCheckIcon(false);
      }, 3000); // Hide check icon after three seconds
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const dispatch = useDispatch();

  const handleSideBarOpen = () => {
    dispatch(
      setWallet<walletSliceType>({
        open_wallet_sidebar: true,
      }),
    );
  };

  const handleSideBarClose = () => {
    dispatch(
      setWallet<walletSliceType>({
        open_wallet_sidebar: false,
      }),
    );
  };

  return (
    <Sheet open={open_wallet_sidebar}>
      <SheetTrigger className="text-white ">
        <div
          onClick={handleSideBarOpen}
          className="t bg-[#ccff004a] rounded-2xl px-6 text-lime-300 text-sm py-2 hover:text-gray-200"
        >
          {wallet_address ? ellipseAddress(wallet_address, 5) : "Connect"}
        </div>
      </SheetTrigger>
      <SheetContent
        handleClose={handleSideBarClose}
        className="bg-slate-950 border border-gray-800 rounded-xl"
      >
        {!wallet_address && (
          <div className="p-4 bg-slate-900 border border-gray-800 rounded-xl mt-8">
            <div
              className="flex items-center justify-between text-white w-full cursor-pointer"
              onClick={() => {
                connect();
              }}
            >
              <div className="flex items-center gap-6">
                <img
                  src="https://app.uniswap.org/static/media/metamask-icon.c8b2298e68e585a7f4d9c7b7e6320715.svg"
                  alt=""
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <span className="text-lg font-bold">Connect To MetaMask</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {wallet_address && (
          <div className="rounded-xl mt-8">
            <div className="flex items-center  text-white">
              <div className="flex items-start w-full justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/wallet-image.jpg"
                    alt=""
                    className="w-12 h-12 rounded-full "
                  />
                  <div className="flex items-center cursor-pointer">
                    <div
                      className="overflow-hidden whitespace-nowrap w-[140px] truncate"
                      onClick={() => copyToClipboard(wallet_address)}
                    >
                      <span className="text-sm font-bold">
                        {ellipseAddress(wallet_address)}
                      </span>
                    </div>

                    {showCheckIcon ? (
                      <Check className="text-green-500" size={15} />
                    ) : (
                      <button
                        className="text-lime-300 hover:text-gray-200 mr-4"
                        onClick={() => copyToClipboard(wallet_address)}
                      >
                        <Copy size={15} />
                      </button>
                    )}
                  </div>
                </div>
                {wallet_address && (
                  <button
                    className="text-slate-400 hover:text-gray-200"
                    onClick={() => {
                      disconnect();
                    }}
                  >
                    <Power />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-white text-2xl font-bold ">
                {balance}{" "}
                <span className="uppercase">
                  {NETWORK_DATA[CHAIN_SLUG_MAPPING[chain_id]]
                    ?.native_currency_code || ""}
                </span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WalletConnectSection;
