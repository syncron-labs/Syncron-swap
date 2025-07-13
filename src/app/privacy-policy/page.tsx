import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Last updated: December 13, 2024
          </p>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div className="rounded-3xl ring-1 ring-gray-800 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Privacy Matters</h2>
            <p className="text-gray-300 mb-6">
              At Syncron, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and protect your data when you use our decentralized exchange platform.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Information We Collect</h3>
            <div className="text-gray-300 space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Wallet Information</h4>
                <p>When you connect your wallet, we collect your public wallet address to facilitate transactions. We do not collect or store your private keys or seed phrases.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Transaction Data</h4>
                <p>We collect transaction data including token swaps, liquidity provision, and other on-chain activities to provide our services and improve user experience.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Usage Analytics</h4>
                <p>We collect anonymized usage data to understand how users interact with our platform and to improve our services.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">How We Use Your Information</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Facilitate cryptocurrency transactions and swaps</li>
              <li>Provide customer support and technical assistance</li>
              <li>Improve our platform's functionality and user experience</li>
              <li>Detect and prevent fraud or malicious activities</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Data Protection</h3>
            <div className="text-gray-300 space-y-4 mb-6">
              <p>
                <strong className="text-white">Decentralized Nature:</strong> Most of your data is stored on the blockchain, 
                which is decentralized and immutable. We do not control blockchain data.
              </p>
              <p>
                <strong className="text-white">Security Measures:</strong> We implement industry-standard security measures 
                to protect any data we do collect, including encryption and secure storage practices.
              </p>
              <p>
                <strong className="text-white">No Sale of Data:</strong> We do not sell, rent, or trade your personal 
                information to third parties for marketing purposes.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Third-Party Services</h3>
            <p className="text-gray-300 mb-4">
              Our platform integrates with various third-party services including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Wallet providers (MetaMask, WalletConnect, etc.)</li>
              <li>Blockchain networks and their APIs</li>
              <li>Analytics services (with anonymized data)</li>
              <li>Price feed providers</li>
            </ul>
            <p className="text-gray-300 mb-6">
              These services have their own privacy policies, and we encourage you to review them.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Your Rights</h3>
            <p className="text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Access the personal information we have about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information (where legally permissible)</li>
              <li>Object to certain processing of your information</li>
              <li>Withdraw consent where we rely on consent for processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Cookies and Tracking</h3>
            <p className="text-gray-300 mb-6">
              We use minimal cookies and local storage to enhance your user experience, such as remembering your 
              wallet connection preferences. You can disable cookies in your browser settings, though this may 
              affect some functionality.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">International Users</h3>
            <p className="text-gray-300 mb-6">
              Syncron is accessible globally. If you are located outside the United States, please be aware that 
              your information may be processed in the United States or other countries where our service providers 
              are located.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Changes to This Policy</h3>
            <p className="text-gray-300 mb-6">
              We may update this Privacy Policy from time to time. We will notify users of any material changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:privacy@syncron.network" className="text-primary hover:text-lime-300">
                  privacy@syncron.network
                </a>
              </p>
              <p className="text-gray-300 text-sm mt-2">
                <strong className="text-white">Address:</strong> Syncron Labs Inc., Privacy Department
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
