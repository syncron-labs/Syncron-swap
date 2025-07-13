import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

import { X } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { CoinData } from "@/src/utils/types";

const ConfirmSwapSection = ({
  openStatus,
  setOpenStatus,
  fromCoin,
  toCoin,
  fromAmount,
  toAmount,
  handleConfirmSwap,
}: {
  openStatus: boolean;
  setOpenStatus: any;
  fromCoin: CoinData;
  toCoin: CoinData;
  fromAmount: string;
  toAmount: string;
  handleConfirmSwap: () => void;
}) => {
  return (
    <Dialog open={openStatus}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md border border-slate-900 bg-slate-950 h-auto flex flex-col justify-start">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white">Review swap</DialogTitle>
          <X
            className="text-white"
            size={20}
            onClick={() => setOpenStatus(false)}
          />
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5  py-2 rounded-2xl">
            <Label htmlFor="name" className="text-gray-400">
              You Pay
            </Label>
            <div className="flex items-center justify-between space-x-2">
              <div className="bg-transparent p-0 border-none text-white placeholder:text-gray-400 text-4xl placeholder:text-4xl py-2 font-medium focus:outline-none focus:border-none">
                <h1>{fromAmount}</h1>
              </div>

              <div className="flex flex-col items-end space-y-1.5">
                {" "}
                <img
                  src={fromCoin?.basic.icon}
                  className="h-9 w-9 rounded-full mr-4"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-1.5  py-2 rounded-2xl">
            <Label htmlFor="name" className="text-gray-400">
              You Revieve (Est.)
            </Label>
            <div className="flex items-center justify-between space-x-2">
              <div className="bg-transparent p-0 border-none text-white placeholder:text-gray-400 text-4xl placeholder:text-4xl py-2 font-medium focus:outline-none focus:border-none">
                <h1>{toAmount}</h1>
              </div>

              <div className="flex flex-col items-end space-y-1.5">
                {" "}
                <img
                  src={toCoin?.basic.icon}
                  className="h-9 w-9 rounded-full mr-4"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <span className="w-full border border-gray-800"></span>

        {/* <div className="text-gray-400 text-xs w-full">
          <div className="flex item-center justify-between my-2">
            <p>Rate</p>{" "}
            <p className="text-gray-200">1 ETH = 51,152.40 DKFT20</p>
          </div>
          <div className="flex item-center justify-between my-2">
            <p>Price impact</p> <p className="text-red-600">~7.908%</p>
          </div>
          <div className="flex item-center justify-between my-2">
            <p>Max. slippage</p> <p className="text-gray-200">0.5%</p>
          </div>
          <div className="flex item-center justify-between my-2">
            <p>Receive at least</p>{" "}
            <p className="text-gray-200">50.8978 DKFT20</p>
          </div>
          <div className="flex item-center justify-between my-2">
            <p>Fee</p> <p className="text-gray-200">0 DKFT20</p>
          </div>
        </div> */}

        <Button
          onClick={handleConfirmSwap}
          className="bg-[#ccff004a] text-black py-7 text-xl font-semibold 
            rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary  "
        >
          Confirm Swap
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmSwapSection;
