'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import NetworkSwitcher from '@/components/network/NetworkSwitcher';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Uniswap V2/V3 Demo - Edge Testnet
          </h1>
          <div className="flex items-center space-x-4">
            <NetworkSwitcher />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Uniswap Factory Create Pair Platform
          </h2>
          <p className="text-lg text-gray-600">
            Create Uniswap V2 trading pairs and V3 liquidity pools on Edge Testnet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Mint Tokens Card */}
          <Link
            href="/mint"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-500"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-900">
                Mint Test Tokens
              </h3>
            </div>
            <p className="text-gray-600">
              Mint TKA and TKB test tokens for free to create trading pairs and liquidity pools
            </p>
          </Link>

          {/* Create Pair/Pool Card */}
          <Link
            href="/create-pair"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-purple-500"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔀</span>
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-900">
                Create Pair/Pool
              </h3>
            </div>
            <p className="text-gray-600">
              Create Uniswap V2 trading pairs or V3 liquidity pools (with custom fees and prices)
            </p>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              📖 Features
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li>✅ <strong>Mint Test Tokens</strong>: Anyone can mint TKA and TKB tokens for free</li>
              <li>✅ <strong>Create V2 Pairs</strong>: Create Uniswap V2 trading pairs for any two tokens</li>
              <li>✅ <strong>Create V3 Pools</strong>: Create and initialize Uniswap V3 liquidity pools (0.3% fee)</li>
              <li className="text-gray-600">⏳ <strong>Add Liquidity</strong> (Coming in next phase)</li>
              <li className="text-gray-600">⏳ <strong>Swap Trading</strong> (Coming in next phase)</li>
            </ul>
          </div>
        </div>

        {/* Network Info */}
        <div className="mt-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🌐 Network Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Network Name:</span>
                <span className="ml-2 text-gray-600">Edge Testnet</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Chain ID:</span>
                <span className="ml-2 text-gray-600">33431</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">RPC URL:</span>
                <span className="ml-2 text-gray-600 text-xs">
                  https://edge-testnet.g.alchemy.com/public
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Block Explorer:</span>
                <a
                  href="https://edge-testnet.explorer.alchemy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline text-xs"
                >
                  Edge Explorer
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>Uniswap V2/V3 Factory Demo Project | Edge Testnet</p>
        </div>
      </footer>
    </div>
  );
}
