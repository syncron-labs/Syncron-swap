import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { ChevronDown, Search, X } from "lucide-react";
import { getNetworkCoins } from "@/src/utils/corefunctions";
import { CHAIN_SLUG_MAPPING } from "@/src/utils/network/network-data";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import { CoinData } from "@/src/utils/types";

const SelectCoinSection = ({
  coin,
  setCoin,
  handleConnectWallet,
  walletAddress,
  setSecondarayCoin,
}: {
  coin: CoinData;
  setCoin: (coin: CoinData) => void;
  handleConnectWallet: () => void;
  walletAddress: string;
  setSecondarayCoin?: (coin: CoinData) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { chain_id } = useSelector((state: IRootState) => state.wallet);

  const [coins, setCoins] = useState<CoinData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    chain_id && setCoins(getNetworkCoins(CHAIN_SLUG_MAPPING[chain_id]));
  }, [chain_id]);

  const handleCoinSelect = (coin: CoinData) => {
    setCoin(coin);
    setSecondarayCoin && setSecondarayCoin(coin);
    setOpen(false);
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.basic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.basic.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!walletAddress) {
          return handleConnectWallet();
        }
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        {coin ? (
          <Button className="text-xl cursor-pointer font-semibold text-white bg-slate-950 w-auto  h-10 flex items-center justify-center border border-slate-800 px-3 rounded-3xl hover:bg-slate-800 hover:border-slate-700">
            <img src={coin.basic.icon} className="h-5  mr-3 shrink-0" />
            {coin.basic.code}
            <ChevronDown className="ml-2" size={18} />
          </Button>
        ) : (
          <Button className="text-md cursor-pointer font-semibold text-black bg-primary w-auto h-10 flex items-center justify-center px-3 py-1 rounded-3xl">
            {"Select Coin"}
            <ChevronDown className="ml-2" size={18} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-slate-900 bg-slate-950 h-[600px] flex flex-col justify-start">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white">Select Coin</DialogTitle>
          <X className="text-white" size={20} onClick={() => setOpen(false)} />
        </DialogHeader>
        <div className="">
          <div className="relative w-full flex items-center">
            <Search className="text-white absolute left-3" size={20} />
            <input
              type="text"
              placeholder="Search names or code"
              className="bg-slate-950 border border-gray-800 w-full h-10 text-white pl-10 pr-4 rounded-2xl focus:outline-none focus:ring focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-[350px] overflow-y-auto mt-4">
          <h1 className="text-white text-sm ">Available Coins</h1>
          {filteredCoins.map((c) => (
            <div
              key={c.basic.code}
              className={`${
                coin === c ? "bg-gray-800" : ""
              } text-white text-sm py-4 flex items-center justify-start rounded-2xl cursor-pointer`}
              onClick={() => handleCoinSelect(c)}
            >
              <img
                src={c.basic.icon}
                className="h-9 w-9 rounded-full mr-4"
                alt=""
              />
              {c.basic.name}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCoinSection;
