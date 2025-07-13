import React from 'react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Stay updated with the latest news, insights, and developments from Syncron.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-3xl ring-1 ring-gray-800 p-6">
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-400">Dec 12, 2024</time>
                <span className="relative z-10 rounded-full bg-primary px-3 py-1.5 font-medium text-black">
                  Protocol
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                  Introducing Syncron V2
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                  We're excited to announce the launch of Syncron V2 with improved efficiency, lower gas costs, and enhanced user experience.
                </p>
              </div>
            </article>

            <article className="rounded-3xl ring-1 ring-gray-800 p-6">
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-400">Dec 8, 2024</time>
                <span className="relative z-10 rounded-full bg-gray-800 px-3 py-1.5 font-medium text-white">
                  Tutorial
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                  How to Provide Liquidity
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                  Learn how to earn fees by providing liquidity to our pools in this comprehensive step-by-step guide.
                </p>
              </div>
            </article>

            <article className="rounded-3xl ring-1 ring-gray-800 p-6">
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-400">Dec 5, 2024</time>
                <span className="relative z-10 rounded-full bg-gray-800 px-3 py-1.5 font-medium text-white">
                  Community
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                  Community Governance Launch
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                  The community can now participate in protocol governance and vote on important proposals.
                </p>
              </div>
            </article>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-400">More articles coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
