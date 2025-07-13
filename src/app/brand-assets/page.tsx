import React from 'react';

export default function BrandAssetsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Brand Assets
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Download official Syncron logos, brand guidelines, and media assets.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold tracking-tight text-white">Logo Package</h3>
              <p className="mt-6 text-base leading-7 text-gray-300">
                Official Syncron logos in various formats including PNG, SVG, and vector files.
              </p>
              <div className="mt-6 flex justify-center">
                <img src="/logo.webp" className="w-32 h-auto" alt="Syncron Logo" />
              </div>
              <div className="mt-6">
                <button className="w-full rounded-md bg-gradient-to-r from-primary via-primary to-lime-400 px-6 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90">
                  Download Logo Pack
                </button>
              </div>
            </div>
            
            <div className="rounded-3xl ring-1 ring-gray-800 p-8">
              <h3 className="text-2xl font-bold tracking-tight text-white">Brand Guidelines</h3>
              <p className="mt-6 text-base leading-7 text-gray-300">
                Comprehensive brand guidelines including colors, typography, and usage instructions.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-sm font-medium">Primary Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary"></div>
                    <span className="text-xs text-gray-400">#CCFF00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <span className="text-sm font-medium">Background</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-950 border border-gray-600"></div>
                    <span className="text-xs text-gray-400">#020617</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 rounded-3xl ring-1 ring-gray-800 p-8">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-6">Usage Guidelines</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-primary mb-3">✓ Do</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Use official logo files only</li>
                  <li>• Maintain proper spacing around the logo</li>
                  <li>• Use approved color variations</li>
                  <li>• Ensure legibility at all sizes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-3">✗ Don't</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Alter or modify the logo</li>
                  <li>• Use unapproved color combinations</li>
                  <li>• Stretch or distort the logo</li>
                  <li>• Place logo on busy backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
