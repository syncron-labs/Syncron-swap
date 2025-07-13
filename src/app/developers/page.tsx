import React from 'react';

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Developers
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Build on Syncron with our comprehensive APIs, SDKs, and developer tools.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Contracts</h3>
              <p className="text-gray-300 mb-4">
                Access our audited smart contracts and integrate directly with the Syncron protocol.
              </p>
              <a href="#" className="text-primary hover:text-lime-300 text-sm font-medium">
                View Contracts →
              </a>
            </div>

            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">SDK & APIs</h3>
              <p className="text-gray-300 mb-4">
                TypeScript SDK and REST APIs for easy integration with your applications.
              </p>
              <a href="#" className="text-primary hover:text-lime-300 text-sm font-medium">
                View Documentation →
              </a>
            </div>

            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tutorials</h3>
              <p className="text-gray-300 mb-4">
                Step-by-step guides to help you build your first DeFi application.
              </p>
              <a href="#" className="text-primary hover:text-lime-300 text-sm font-medium">
                Start Learning →
              </a>
            </div>
          </div>

          <div className="rounded-3xl ring-1 ring-gray-800 p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Start</h3>
            <div className="bg-slate-900 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Install the Syncron SDK</h4>
              <div className="bg-black rounded-md p-4 font-mono text-sm text-gray-300 mb-4">
                <div className="text-primary">npm install @syncron/sdk</div>
              </div>
              <div className="bg-black rounded-md p-4 font-mono text-sm text-gray-300">
                <div className="text-blue-400">import</div> {`{ SyncronSDK } `}<div className="text-blue-400">from</div> <div className="text-green-400">'@syncron/sdk'</div><br/>
                <br/>
                <div className="text-blue-400">const</div> sdk = <div className="text-blue-400">new</div> <div className="text-yellow-400">SyncronSDK</div>()<br/>
                <div className="text-blue-400">const</div> pools = <div className="text-blue-400">await</div> sdk.<div className="text-yellow-400">getPools</div>()
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Developer Resources</h3>
              <div className="space-y-4">
                <a href="#" className="block p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
                  <h4 className="font-semibold text-white">API Reference</h4>
                  <p className="text-sm text-gray-400 mt-1">Complete API documentation and examples</p>
                </a>
                <a href="#" className="block p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
                  <h4 className="font-semibold text-white">GitHub Repository</h4>
                  <p className="text-sm text-gray-400 mt-1">Open source code and contribution guidelines</p>
                </a>
                <a href="#" className="block p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
                  <h4 className="font-semibold text-white">Developer Discord</h4>
                  <p className="text-sm text-gray-400 mt-1">Join our community for support and discussions</p>
                </a>
              </div>
            </div>

            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Developer Grant Program</h3>
              <p className="text-gray-300 mb-6">
                Build innovative applications on Syncron and receive funding up to $50,000 for qualifying projects.
              </p>
              <div className="space-y-3 text-gray-300 text-sm mb-6">
                <div>• DeFi applications and integrations</div>
                <div>• Developer tools and infrastructure</div>
                <div>• Educational content and tutorials</div>
                <div>• Analytics and monitoring tools</div>
              </div>
              <button className="w-full rounded-md bg-gradient-to-r from-primary via-primary to-lime-400 px-6 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90">
                Apply for Grant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
