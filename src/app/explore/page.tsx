import React from 'react';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Explore
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Discover new tokens, trending pairs, and market opportunities.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/swap"
              className="rounded-md bg-gradient-to-r from-primary via-primary to-lime-400 px-6 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Start Exploring
            </a>
          </div>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-800 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-white">Token Explorer</h3>
            <p className="mt-6 text-base leading-7 text-gray-300">
              Browse through thousands of tokens, view detailed analytics, and discover the next big opportunity in DeFi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
