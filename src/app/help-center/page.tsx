import React from 'react';

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Help Center
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Find answers to common questions and get help with using Syncron.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          {/* Search Bar */}
          <div className="rounded-3xl ring-1 ring-gray-800 p-8 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Getting Started</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-white hover:text-primary">
                    <span>How do I connect my wallet?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="m6 9 6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-300 mt-3 text-sm">
                    Click the "Connect Wallet" button in the top right corner and select your preferred wallet provider (MetaMask, WalletConnect, etc.).
                  </p>
                </details>
                
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-white hover:text-primary">
                    <span>What tokens can I swap?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="m6 9 6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-300 mt-3 text-sm">
                    You can swap any ERC-20 token that has sufficient liquidity in our pools. Popular tokens include ETH, USDC, USDT, and many others.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-white hover:text-primary">
                    <span>What are the fees?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="m6 9 6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-300 mt-3 text-sm">
                    Syncron charges a 0.25% swap fee, plus network gas fees. Liquidity providers earn a portion of these fees.
                  </p>
                </details>
              </div>
            </div>

            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Liquidity & Pools</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-white hover:text-primary">
                    <span>How do I provide liquidity?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="m6 9 6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-300 mt-3 text-sm">
                    Navigate to the Pool section, select "Add Liquidity", choose your token pair, and deposit equal values of both tokens.
                  </p>
                </details>
                
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-white hover:text-primary">
                    <span>What is impermanent loss?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="m6 9 6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-300 mt-3 text-sm">
                    Impermanent loss occurs when token prices diverge from when you deposited. The loss is "impermanent" because it only becomes permanent when you withdraw.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-white hover:text-primary">
                    <span>How do I earn fees?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="m6 9 6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-300 mt-3 text-sm">
                    Liquidity providers automatically earn a portion of trading fees proportional to their share of the pool.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-3xl ring-1 ring-gray-800 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
            <p className="text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="rounded-md bg-gradient-to-r from-primary via-primary to-lime-400 px-6 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90"
              >
                Contact Support
              </a>
              <a
                href="https://discord.gg/syncron"
                className="rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
