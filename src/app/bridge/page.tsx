"use client";
import React, { useEffect } from 'react';

// Declare deBridge globally for TypeScript
declare global {
  interface Window {
    deBridge: {
      widget: (config: any) => void;
    };
  }
}

export default function BridgePage() {
  useEffect(() => {
    // Check if widget is already initialized
    const existingWidget = document.getElementById('debridgeWidget');
    if (existingWidget && existingWidget.children.length > 0) {
      return; // Widget already loaded, don't reinitialize
    }

    // Clear any existing content in the widget container
    if (existingWidget) {
      existingWidget.innerHTML = '';
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://app.debridge.finance/assets/scripts/widget.js"]');
    
    if (existingScript) {
      // Script already exists, just initialize the widget
      if (window.deBridge) {
        initializeWidget();
      } else {
        // Wait for script to load
        existingScript.addEventListener('load', initializeWidget);
      }
      return;
    }

    // Load the deBridge widget script
    const script = document.createElement('script');
    script.src = 'https://app.debridge.finance/assets/scripts/widget.js';
    script.async = true;
    script.id = 'debridge-script';
    
    script.onload = initializeWidget;
    script.onerror = () => {
      console.error('Failed to load deBridge widget script');
    };

    document.head.appendChild(script);

    function initializeWidget() {
      // Double-check widget container exists and is empty
      const widgetContainer = document.getElementById('debridgeWidget');
      if (!widgetContainer) return;
      
      // Clear any existing content
      widgetContainer.innerHTML = '';
      
      if (window.deBridge) {
        try {
          window.deBridge.widget({
            "v": "1",
            "element": "debridgeWidget",
            "title": "",
            "description": "",
            "width": "800",
            "height": "700",
            "r": "25005464",
            "affiliateFeePercent": "1",
            "affiliateFeeRecipient": "0x93Fd608bCb2D83e83E8b8d0a163760AD4DA9A6Bd",
            "supportedChains": "{\"inputChains\":{\"1\":\"all\",\"10\":\"all\",\"56\":\"all\",\"100\":\"all\",\"137\":\"all\",\"146\":\"all\",\"250\":\"all\",\"388\":\"all\",\"747\":\"all\",\"999\":\"all\",\"1088\":\"all\",\"1329\":\"all\",\"1514\":\"all\",\"2741\":\"all\",\"4158\":\"all\",\"5000\":\"all\",\"8453\":\"all\",\"32769\":\"all\",\"42161\":\"all\",\"43114\":\"all\",\"50104\":\"all\",\"60808\":\"all\",\"80094\":\"all\",\"98866\":\"all\",\"7565164\":\"all\",\"245022934\":\"all\"},\"outputChains\":{\"1\":\"all\",\"10\":\"all\",\"56\":\"all\",\"100\":\"all\",\"137\":\"all\",\"146\":\"all\",\"250\":\"all\",\"388\":\"all\",\"747\":\"all\",\"999\":\"all\",\"1088\":\"all\",\"1329\":\"all\",\"1514\":\"all\",\"2741\":\"all\",\"4158\":\"all\",\"5000\":\"all\",\"8453\":\"all\",\"32769\":\"all\",\"42161\":\"all\",\"43114\":\"all\",\"50104\":\"all\",\"60808\":\"all\",\"80094\":\"all\",\"98866\":\"all\",\"7565164\":\"all\",\"245022934\":\"all\"}}",
            "inputChain": 7565164,
            "outputChain": 8453,
            "inputCurrency": "",
            "outputCurrency": "",
            "address": "",
            "showSwapTransfer": true,
            "amount": "",
            "outputAmount": "",
            "isAmountFromNotModifiable": false,
            "isAmountToNotModifiable": false,
            "lang": "en",
            "mode": "deswap",
            "isEnableCalldata": false,
            "styles": "eyJwcmltYXJ5QnRuQmciOiIjQ0NGRjAwIiwicHJpbWFyeUJ0bkJnSG92ZXIiOiIjQ0NGRjAwIiwic2Vjb25kYXJ5QnRuQmdIb3ZlciI6IiNjY2ZmMDAifQ==",
            "theme": "dark",
            "isHideLogo": false,
            "logo": "https://syncron-swap.vercel.app/logo.webp",
            "disabledWallets": [],
            "disabledElements": []
          });
        } catch (error) {
          console.error('Error initializing deBridge widget:', error);
        }
      }
    }

    // Cleanup function to clear widget content when component unmounts
    return () => {
      const widgetContainer = document.getElementById('debridgeWidget');
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Cross-Chain <span className="text-primary">Bridge</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Seamlessly transfer assets across multiple blockchain networks with our integrated deBridge solution.
            Bridge tokens between Ethereum, Polygon, BSC, Arbitrum, and many more chains.
          </p>
        </div>

        {/* Bridge Widget Container */}
        <div className="flex justify-center">
          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800">
            <div id="debridgeWidget" className="w-full"></div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Chain Support</h3>
            <p className="text-gray-400">Bridge assets across 25+ supported blockchain networks including Ethereum, Polygon, BSC, and Arbitrum.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Trustless</h3>
            <p className="text-gray-400">Built on deBridge's secure infrastructure with smart contract validation and decentralized protocols.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029C10.792 13.807 10.304 14 10 14c-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H9a1 1 0 100-2h-.013a7.78 7.78 0 010-1H9a1 1 0 000-2h-.528c.082-.184.167-.36.264-.521z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Low Fees</h3>
            <p className="text-gray-400">Competitive bridging fees with transparent pricing and no hidden costs for cross-chain transfers.</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-sm text-gray-400 text-center">
            <strong>Disclaimer:</strong> Cross-chain bridging involves smart contract risks. Always verify transaction details and ensure you're using the correct addresses. 
            Syncron Swap integrates with deBridge but is not responsible for bridge operations. Please conduct your own research before bridging large amounts.
          </p>
        </div>
      </div>
    </div>
  );
}
