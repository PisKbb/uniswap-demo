'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';
import CreatePair from '@/components/v2/CreatePair';
import CreatePool from '@/components/v3/CreatePool';
import NetworkSwitcher from '@/components/network/NetworkSwitcher';

export default function CreatePairPage() {
  const [activeTab, setActiveTab] = useState<'v2' | 'v3'>('v2');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create Pair/Pool</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NetworkSwitcher />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('v2')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'v2'
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">🦄</span>
              <span>Uniswap V2</span>
            </div>
            <div className="text-xs mt-1 opacity-90">
              Fixed 0.3% Fee
            </div>
          </button>

          <button
            onClick={() => setActiveTab('v3')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'v3'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">🦄</span>
              <span>Uniswap V3</span>
            </div>
            <div className="text-xs mt-1 opacity-90">
              Multiple Fee Tiers
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {activeTab === 'v2' ? <CreatePair /> : <CreatePool />}
        </div>

        {/* Comparison Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg border-2 ${
            activeTab === 'v2' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white'
          }`}>
            <h3 className="text-lg font-semibold text-pink-700 mb-3">
              V2 Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Simple constant product formula (x * y = k)</li>
              <li>✅ Fixed 0.3% trading fee</li>
              <li>✅ One pair per token combination</li>
              <li>✅ Full range liquidity (0 to ∞)</li>
              <li>✅ Easier for beginners</li>
            </ul>
          </div>

          <div className={`p-6 rounded-lg border-2 ${
            activeTab === 'v3' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`}>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              V3 Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Concentrated liquidity in price ranges</li>
              <li>✅ Multiple fee tiers (0.05%, 0.3%, 1%)</li>
              <li>✅ Multiple pools per token pair</li>
              <li>✅ Higher capital efficiency</li>
              <li>✅ NFT-based liquidity positions</li>
            </ul>
          </div>
        </div>

        {/* Process Guide */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📖 Process Guide
          </h3>
          {activeTab === 'v2' ? (
            <ol className="space-y-2 text-blue-800 text-sm">
              <li><strong>1. Enter token addresses</strong> - Input the addresses of two ERC20 tokens</li>
              <li><strong>2. Check if pair exists</strong> - System will automatically check</li>
              <li><strong>3. Create pair</strong> - Click button to create the trading pair</li>
              <li><strong>4. Wait for confirmation</strong> - Transaction will be confirmed on-chain</li>
              <li className="text-gray-600">⏳ <strong>Add liquidity</strong> (Coming in next phase)</li>
            </ol>
          ) : (
            <ol className="space-y-2 text-blue-800 text-sm">
              <li><strong>1. Enter token addresses</strong> - Input the addresses of two ERC20 tokens</li>
              <li><strong>2. Select fee tier</strong> - Choose appropriate fee tier (0.05%, 0.3%, or 1%)</li>
              <li><strong>3. Set initial price</strong> - Define the starting price ratio</li>
              <li><strong>4. Create pool</strong> - Click to create the liquidity pool</li>
              <li><strong>5. Initialize price</strong> - Initialize pool with the set price</li>
              <li className="text-gray-600">⏳ <strong>Add liquidity</strong> (Coming in next phase)</li>
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
