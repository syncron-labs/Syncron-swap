"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DropdownWithIcon } from "../dropdowns/dropdownWithIcon";
import { getNetworks } from "@/src/utils/corefunctions";
import WalletConnectSection from "@/src/section/global/walletConnect.section";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import {
  CHAIN_SLUG_MAPPING,
  NETWORK_DATA,
} from "@/src/utils/network/network-data";
import { useWallet } from "@/src/hooks/useWallet";
import { toast } from "../ui/use-toast";

export default function Navbar() {
  const [scrolling, setScrolling] = useState(false);

  const { switchToNetwork } = useWallet();

  const { chain_id } = useSelector((state: IRootState) => state.wallet);

  const [network, setNetwork] = useState<string>("");
  const networks = getNetworks();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolling(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    chain_id && setNetwork(CHAIN_SLUG_MAPPING[chain_id]);
  }, [chain_id]);

  useEffect(() => {
    network &&
      (async () => {
        const chain = NETWORK_DATA[network]?.chain_id;
        if (await switchToNetwork(chain)) {
          setNetwork(network);
        } else {
          setNetwork(CHAIN_SLUG_MAPPING[chain_id]);
        }
      })();
  }, [network]);

  useEffect(() => {
    setNetwork(CHAIN_SLUG_MAPPING[chain_id] ?? "");
  }, [chain_id]);

  return (
    <nav
      className={`bg-${
        scrolling
          ? "bg-gray-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 "
          : "transparent"
      } text-white fixed top-0 w-full z-10 mx-auto`}
    >
      <div className="px-4 py-3 grid grid-cols-3 z-10  items-center justify-center">
        <div className="flex items-center">
          <Link className="text-3xl font-bold font-heading" href="/">
            <img className="h-9" src="/logo.webp" alt="logo" />
          </Link>
          <ul className="hidden lg:flex gap-4 ml-10">
            <li>
              <Link className="hover:text-gray-200" href="/swap">
                Swap
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-200" href="/pool">
                Pool
              </Link>
            </li>
            <li>
              <a className="hover:text-gray-200" href="https://dex.syncron.network/" target="_blank" rel="noopener noreferrer">
                DEX Futures
              </a>
            </li>
            <li>
              <a className="hover:text-gray-200" href="http://beta.syncron.network/" target="_blank" rel="noopener noreferrer">
                Syncron Exchange
              </a>
            </li>
            <li>
              <a className="hover:text-gray-200" href="http://v3.syncron.network/" target="_blank" rel="noopener noreferrer">
                Syncron U.S.
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center">
          {/* <div className="relative w-full flex items-center">
            <Search className="text-white absolute left-3" size={20} />
            <input
              type="text"
              placeholder="Search Coins..."
              className="bg-slate-950 border border-gray-800 w-full h-10 text-white pl-10 pr-4 rounded-2xl focus:outline-none focus:ring focus:border-primary"
            />
          </div> */}
        </div>
        <div className="flex items-center justify-end gap-4">
          <DropdownWithIcon
            options={networks}
            placeholder="Select a Network"
            value={network}
            setValue={setNetwork}
          />

          <WalletConnectSection />
        </div>
      </div>
    </nav>
  );
}
