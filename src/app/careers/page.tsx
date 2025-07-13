import React from 'react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Careers
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join our team and help build the future of decentralized finance.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="mailto:careers@syncron.network"
              className="rounded-md bg-gradient-to-r from-primary via-primary to-lime-400 px-6 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Contact Us
            </a>
          </div>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold tracking-tight text-white">Why Syncron?</h3>
              <p className="mt-6 text-base leading-7 text-gray-300">
                Work with cutting-edge blockchain technology, competitive compensation, and a remote-first culture that values innovation and collaboration.
              </p>
              <ul className="mt-6 space-y-2 text-gray-300">
                <li>• Remote-first work environment</li>
                <li>• Competitive salary & equity</li>
                <li>• Health & wellness benefits</li>
                <li>• Professional development opportunities</li>
              </ul>
            </div>
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold tracking-tight text-white">Open Positions</h3>
              <p className="mt-6 text-base leading-7 text-gray-300">
                We're always looking for talented individuals to join our growing team.
              </p>
              <div className="mt-6 space-y-3">
                <div className="p-4 bg-slate-900 rounded-lg">
                  <h4 className="font-semibold text-white">Frontend Developer</h4>
                  <p className="text-sm text-gray-400">React, TypeScript, Web3</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg">
                  <h4 className="font-semibold text-white">Smart Contract Developer</h4>
                  <p className="text-sm text-gray-400">Solidity, DeFi Protocols</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
