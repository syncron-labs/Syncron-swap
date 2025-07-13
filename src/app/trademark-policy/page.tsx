import React from 'react';

export default function TrademarkPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Trademark Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Last updated: December 13, 2024
          </p>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div className="rounded-3xl ring-1 ring-gray-800 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Syncron Trademark Guidelines</h2>
            <p className="text-gray-300 mb-4">
              The Syncron name, logo, and other trademarks are owned by Syncron Labs Inc. These guidelines 
              explain how you can and cannot use our trademarks.
            </p>
            
            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Permitted Uses</h3>
            <p className="text-gray-300 mb-4">You may use our trademarks to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Reference Syncron in news articles, blog posts, or academic papers</li>
              <li>Describe your integration with Syncron protocol</li>
              <li>Link to our website or social media pages</li>
              <li>Participate in our community discussions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Prohibited Uses</h3>
            <p className="text-gray-300 mb-4">You may not use our trademarks to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Create confusingly similar logos, names, or domain names</li>
              <li>Suggest that your product is made, endorsed, or approved by Syncron</li>
              <li>Use our trademarks in a way that is misleading or deceptive</li>
              <li>Modify our logos or trademarks</li>
              <li>Use our trademarks for commercial purposes without permission</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Guidelines for Use</h3>
            <div className="text-gray-300 space-y-4">
              <p>
                <strong className="text-white">Proper Attribution:</strong> Always acknowledge that Syncron is a trademark 
                of Syncron Labs Inc.
              </p>
              <p>
                <strong className="text-white">Accurate Usage:</strong> Use our trademarks accurately and don't alter their 
                spelling or capitalization.
              </p>
              <p>
                <strong className="text-white">Clear Distinction:</strong> Make it clear that your product or service is 
                separate from Syncron.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Requesting Permission</h3>
            <p className="text-gray-300 mb-4">
              If you want to use our trademarks in ways not covered by these guidelines, please contact us at{' '}
              <a href="mailto:legal@syncron.network" className="text-primary hover:text-lime-300">
                legal@syncron.network
              </a>. Include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>A description of your intended use</li>
              <li>The duration of the proposed use</li>
              <li>Mockups or examples of how you plan to use our trademarks</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Enforcement</h3>
            <p className="text-gray-300 mb-4">
              We actively protect our trademarks. If you become aware of any misuse of our trademarks, 
              please report it to us. We reserve the right to take action against unauthorized use of our 
              intellectual property.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Changes to This Policy</h3>
            <p className="text-gray-300 mb-4">
              We may update this trademark policy from time to time. Any changes will be posted on this 
              page with an updated effective date.
            </p>

            <div className="mt-8 p-4 bg-slate-900 rounded-lg">
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Questions?</strong> Contact our legal team at{' '}
                <a href="mailto:legal@syncron.network" className="text-primary hover:text-lime-300">
                  legal@syncron.network
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
