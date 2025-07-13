import React from 'react';

export default function VotePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Vote
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Participate in Syncron governance and help shape the future of the protocol.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-3xl ring-1 ring-gray-800 p-8 mb-8">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-6">Active Proposals</h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">SIP-001: Fee Structure Optimization</h4>
                    <p className="text-sm text-gray-400 mt-1">Proposed by: Core Team • Ends in 3 days</p>
                  </div>
                  <span className="px-3 py-1 bg-primary text-black text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Proposal to adjust swap fees from 0.3% to 0.25% to increase trading volume and competitiveness.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-400">✓ For: 85% (12,450 votes)</span>
                    <span className="text-red-400">✗ Against: 15% (2,150 votes)</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md">
                      Vote For
                    </button>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md">
                      Vote Against
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">SIP-002: New Token Listing Standards</h4>
                    <p className="text-sm text-gray-400 mt-1">Proposed by: Community • Ends in 5 days</p>
                  </div>
                  <span className="px-3 py-1 bg-primary text-black text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Establish minimum liquidity requirements and security standards for new token listings.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-400">✓ For: 72% (8,950 votes)</span>
                    <span className="text-red-400">✗ Against: 28% (3,450 votes)</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md">
                      Vote For
                    </button>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md">
                      Vote Against
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold tracking-tight text-white">Your Voting Power</h3>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">SYNC Tokens</span>
                  <span className="text-white font-semibold">0 SYNC</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Voting Power</span>
                  <span className="text-white font-semibold">0 votes</span>
                </div>
                <button className="w-full rounded-md bg-gradient-to-r from-primary via-primary to-lime-400 px-6 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90">
                  Get SYNC Tokens
                </button>
              </div>
            </div>
            
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold tracking-tight text-white">How Voting Works</h3>
              <div className="mt-6 space-y-4 text-gray-300 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p>Hold SYNC tokens to participate in governance</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p>Review active proposals and their details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p>Cast your vote before the deadline</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <p>Implementation occurs if proposal passes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
