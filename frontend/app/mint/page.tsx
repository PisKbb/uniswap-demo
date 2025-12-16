'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { getContracts } from '@/lib/constants';
import { ABIS } from '@/lib/contracts';
import NetworkSwitcher from '@/components/network/NetworkSwitcher';

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const CONTRACTS = getContracts(chainId);
  const [selectedToken, setSelectedToken] = useState<'A' | 'B'>('A');
  const [amount, setAmount] = useState('1000');

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = () => {
    if (!address) return;

    const tokenAddress =
      selectedToken === 'A'
        ? CONTRACTS.TEST_TOKENS.TOKEN_A
        : CONTRACTS.TEST_TOKENS.TOKEN_B;

    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ABIS.TEST_TOKEN,
      functionName: 'mint',
      args: [address, parseEther(amount)],
    });
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Mint Test Tokens</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NetworkSwitcher />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Mint Test Tokens for Free
            </h2>
            <p className="text-gray-600">
              Select token type and amount, then click Mint button
            </p>
          </div>

          {/* Token Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Token
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedToken('A')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedToken === 'A'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Token A (TKA)</div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {CONTRACTS.TEST_TOKENS.TOKEN_A}
                </div>
              </button>
              <button
                onClick={() => setSelectedToken('B')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedToken === 'B'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Token B (TKB)</div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {CONTRACTS.TEST_TOKENS.TOKEN_B}
                </div>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Tokens)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount to mint"
              min="0"
              step="1"
            />
            <p className="mt-2 text-sm text-gray-500">
              Recommended amount: 1,000 - 1,000,000
            </p>
          </div>

          {/* Mint Button */}
          <button
            onClick={handleMint}
            disabled={!isConnected || isPending || isConfirming || !amount}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
              !isConnected || isPending || isConfirming || !amount
                ? 'bg-gray-400 cursor-not-allowed'
                : selectedToken === 'A'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {!isConnected
              ? 'Connect Wallet First'
              : isPending
              ? 'Awaiting Confirmation...'
              : isConfirming
              ? 'Minting...'
              : `Mint ${amount} ${selectedToken === 'A' ? 'TKA' : 'TKB'}`}
          </button>

          {/* Status Messages */}
          {hash && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Transaction Hash:</strong>
              </p>
              <p className="text-xs text-blue-700 font-mono break-all mt-1">
                {hash}
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-900 font-semibold">✅ Minted Successfully!</p>
              <p className="text-sm text-green-700 mt-1">
                {amount} {selectedToken === 'A' ? 'TKA' : 'TKB'} has been sent to your wallet
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-900 font-semibold">❌ Minting Failed</p>
              <p className="text-sm text-red-700 mt-1">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            💡 <strong>Note:</strong> These are test tokens and anyone can mint them for free. After minting, you can use them to create Uniswap V2/V3 pairs and liquidity pools.
          </p>
        </div>
      </main>
    </div>
  );
}
