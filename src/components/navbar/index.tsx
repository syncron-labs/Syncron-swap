"use client";
import { Search, ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
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
  const [logoDropdownOpen, setLogoDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { switchToNetwork } = useWallet();

  const { chain_id } = useSelector((state: IRootState) => state.wallet);

  const [network, setNetwork] = useState<string>("");
  const networks = getNetworks();

  // Logo dropdown links
  const logoDropdownLinks = [
    { href: "https://docs.syncron.network", name: "Docs", external: true },
    { href: "https://github.com/syncron-labs", name: "GitHub", external: true },
    { href: "https://syncron-trading-protocol.readme.io/", name: "API Docs", external: true },
    { href: "https://0x4e4541f7.explorer.aurora-cloud.dev/", name: "Block Explorer", external: true },
    { href: "https://syncron.network", name: "SyncedCap", external: true },
    { href: "https://dexscreener.com/solana/cdyuk9v2qjkn8wtauhwejxxly28f7wgfk7qxfqlwwfgs", name: "WOPEN Token", external: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolling(scrollTop > 100);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (logoDropdownRef.current && !logoDropdownRef.current.contains(event.target as Node)) {
        setLogoDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
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
      <div className="px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center">
          <div className="relative" ref={logoDropdownRef}>
            <button 
              onClick={() => setLogoDropdownOpen(!logoDropdownOpen)}
              className="text-3xl font-bold font-heading flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img className="h-8 md:h-9" src="/logo.webp" alt="logo" />
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-white transition-transform ${logoDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {logoDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                <Link 
                  href="/" 
                  className="block px-4 py-2 text-white hover:bg-slate-800 transition-colors"
                  onClick={() => setLogoDropdownOpen(false)}
                >
                  Home
                </Link>
                <div className="border-t border-slate-700 my-2"></div>
                {logoDropdownLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between px-4 py-2 text-white hover:bg-slate-800 transition-colors"
                    onClick={() => setLogoDropdownOpen(false)}
                  >
                    <span>{link.name}</span>
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                ))}
              </div>
            )}
          </div>
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-2 xl:gap-4 ml-6 xl:ml-10 items-center whitespace-nowrap">
            <li>
              <Link className="hover:text-gray-200 text-sm xl:text-base" href="/swap">
                Swap
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-200 text-sm xl:text-base" href="/pool">
                Pool
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-200 text-sm xl:text-base" href="/bridge">
                Bridge
              </Link>
            </li>
            <li>
              <a className="hover:text-gray-200 text-sm xl:text-base" href="https://dex.syncron.network/" target="_blank" rel="noopener noreferrer">
                DEX
              </a>
            </li>
            <li>
              <a className="hover:text-gray-200 text-sm xl:text-base" href="http://beta.syncron.network/" target="_blank" rel="noopener noreferrer">
                Exchange
              </a>
            </li>
            <li>
              <a className="hover:text-gray-200 text-sm xl:text-base" href="http://v3.syncron.network/" target="_blank" rel="noopener noreferrer">
                U.S.
              </a>
            </li>
          </ul>
        </div>
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <WalletConnectSection />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center justify-end gap-4">
          <DropdownWithIcon
            options={networks}
            placeholder="Select a Network"
            value={network}
            setValue={setNetwork}
          />
          <WalletConnectSection />
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden bg-slate-900 border-t border-slate-700 shadow-xl"
        >
          <div className="px-4 py-4 space-y-3">
            {/* Network Selector in Mobile Menu */}
            <div className="pb-3 border-b border-slate-700">
              <p className="text-gray-400 text-sm mb-2">Select Network:</p>
              <DropdownWithIcon
                options={networks}
                placeholder="Select a Network"
                value={network}
                setValue={setNetwork}
              />
            </div>
            <Link 
              href="/swap" 
              className="block py-2 text-white hover:text-lime-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Swap
            </Link>
            <Link 
              href="/pool" 
              className="block py-2 text-white hover:text-lime-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pool
            </Link>
            <Link 
              href="/bridge" 
              className="block py-2 text-white hover:text-lime-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bridge
            </Link>
            <a 
              href="https://dex.syncron.network/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 text-white hover:text-lime-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>DEX</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="http://beta.syncron.network/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 text-white hover:text-lime-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Exchange</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="http://v3.syncron.network/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 text-white hover:text-lime-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>U.S.</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
