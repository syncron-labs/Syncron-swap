import React from 'react';

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Governance
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Learn about Syncron's decentralized governance model and how you can participate.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-3xl ring-1 ring-gray-800 p-8 mb-8">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-6">Governance Overview</h3>
            <p className="text-gray-300 mb-6">
              Syncron operates as a decentralized autonomous organization (DAO) where SYNC token holders can propose and vote on changes to the protocol. This ensures that the community has direct control over the future direction of the platform.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-slate-900 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">Proposal Process</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Community discussion on forum</li>
                  <li>• Formal proposal submission</li>
                  <li>• 7-day voting period</li>
                  <li>• Implementation if passed</li>
                </ul>
              </div>
              <div className="p-6 bg-slate-900 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">Voting Requirements</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Minimum 10,000 SYNC to propose</li>
                  <li>• 1 SYNC = 1 vote</li>
                  <li>• 4% quorum required</li>
                  <li>• Simple majority to pass</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-8">
            <div className="text-center p-6 rounded-3xl ring-1 ring-gray-800">
              <div className="text-3xl font-bold text-primary">127</div>
              <div className="text-gray-300 mt-2">Total Proposals</div>
            </div>
            <div className="text-center p-6 rounded-3xl ring-1 ring-gray-800">
              <div className="text-3xl font-bold text-primary">89%</div>
              <div className="text-gray-300 mt-2">Pass Rate</div>
            </div>
            <div className="text-center p-6 rounded-3xl ring-1 ring-gray-800">
              <div className="text-3xl font-bold text-primary">24.8K</div>
              <div className="text-gray-300 mt-2">Active Voters</div>
            </div>
          </div>

          <div className="rounded-3xl ring-1 ring-gray-800 p-8">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-6">Governance Categories</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-white">Protocol Changes</h4>
                <p className="text-sm text-gray-400 mt-1">Fee adjustments, new features, security updates</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-white">Treasury Management</h4>
                <p className="text-sm text-gray-400 mt-1">Fund allocation, grants, partnerships</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-white">Token Economics</h4>
                <p className="text-sm text-gray-400 mt-1">Emission rates, staking rewards, token distribution</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-white">Ecosystem Growth</h4>
                <p className="text-sm text-gray-400 mt-1">New integrations, marketing initiatives, community programs</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <a
                href="/vote"
                className="rounded-md bg-gradient-to-r from-primary via-primary to-lime-400 px-8 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Start Voting
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
