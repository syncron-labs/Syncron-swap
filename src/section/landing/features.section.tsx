import React from 'react'
import { DollarSign, Filter, Moon, Zap } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="mx-auto  rounded-3xl shadow-[0_10px_50px_5px_#CCFF00] shadow-primary/40 my-6 bg-slate-950 border border-slate-900 py-32 max-w-7xl px-4 sm:px-6   lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto inline-flex rounded-full bg-primary px-4 py-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-black">
            Features
          </p>
        </div>
        <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Discover our Features
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-y-8 text-center sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
        <div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-lime-400">
            <DollarSign className="h-9 w-9 text-black" />
          </div>
          <h3 className="mt-8 text-lg font-semibold text-white">
            Automated Market Maker
          </h3>
        </div>
        <div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-lime-400">
            <Zap className="h-9 w-9 text-black" />
          </div>
          <h3 className="mt-8 text-lg font-semibold text-white">
            Liquidity Pools
          </h3>
        </div>
        <div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-lime-400">
            <Moon className="h-9 w-9 text-black" />
          </div>
          <h3 className="mt-8 text-lg font-semibold text-white">Token Swaps</h3>
        </div>
        <div>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-lime-400">
            <Filter className="h-9 w-9 text-black" />
          </div>
          <h3 className="mt-8 text-lg font-semibold text-white">
            Decentralization
          </h3>
        </div>
      </div>
      HeroSection
    </div>
  );
}

export default FeaturesSection