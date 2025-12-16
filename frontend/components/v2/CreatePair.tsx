'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { getContracts } from '@/lib/constants';
import { ABIS } from '@/lib/contracts';

export default function CreatePair() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const CONTRACTS = getContracts(chainId);
  const [tokenA, setTokenA] = useState(CONTRACTS.TEST_TOKENS.TOKEN_A);
  const [tokenB, setTokenB] = useState(CONTRACTS.TEST_TOKENS.TOKEN_B);
  const [createdPairAddress, setCreatedPairAddress] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if pair already exists
  const { data: existingPair } = useReadContract({
    address: CONTRACTS.V2.FACTORY as `0x${string}`,
    abi: ABIS.UNISWAP_V2_FACTORY,
    functionName: 'getPair',
    args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
  }) as { data: string | undefined };

  const pairExists = !!(existingPair && existingPair !== '0x0000000000000000000000000000000000000000');
  const wasJustCreated = !!(createdPairAddress && pairExists && existingPair === createdPairAddress);

  // Update created pair address when transaction succeeds
  useEffect(() => {
    if (isSuccess && pairExists && !createdPairAddress) {
      setCreatedPairAddress(existingPair as string);
    }
  }, [isSuccess, pairExists, createdPairAddress, existingPair]);

  const handleCreate = () => {
    if (!tokenA || !tokenB) return;

    writeContract({
      address: CONTRACTS.V2.FACTORY as `0x${string}`,
      abi: ABIS.UNISWAP_V2_FACTORY,
      functionName: 'createPair',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
    });
  };

  const handleTokenChange = (value: string, type: 'A' | 'B') => {
    if (type === 'A') {
      setTokenA(value);
    } else {
      setTokenB(value);
    }
    setCreatedPairAddress(null);
    reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-pink-700 mb-2">
          Uniswap V2 - Create Trading Pair
        </h3>
        <p className="text-sm text-gray-600">
          Create a Uniswap V2 trading pair for any two ERC20 tokens
        </p>
      </div>

      {/* Token A Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Token A Address
        </label>
        <input
          type="text"
          value={tokenA}
          onChange={(e) => handleTokenChange(e.target.value, 'A')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm font-mono"
          placeholder="0x..."
        />
        <button
          onClick={() => handleTokenChange(CONTRACTS.TEST_TOKENS.TOKEN_A, 'A')}
          className="mt-1 text-xs text-pink-600 hover:text-pink-800"
        >
          Use TKA
        </button>
      </div>

      {/* Token B Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Token B Address
        </label>
        <input
          type="text"
          value={tokenB}
          onChange={(e) => handleTokenChange(e.target.value, 'B')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm font-mono"
          placeholder="0x..."
        />
        <button
          onClick={() => handleTokenChange(CONTRACTS.TEST_TOKENS.TOKEN_B, 'B')}
          className="mt-1 text-xs text-pink-600 hover:text-pink-800"
        >
          Use TKB
        </button>
      </div>

      {/* Existing Pair Warning - only show if not just created */}
      {pairExists && !wasJustCreated && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Pair already exists:
          </p>
          <p className="text-xs text-yellow-700 font-mono mt-1 break-all">
            {existingPair as string}
          </p>
        </div>
      )}

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={!isConnected || isPending || isConfirming || !tokenA || !tokenB || (pairExists && !wasJustCreated)}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          !isConnected || isPending || isConfirming || !tokenA || !tokenB || (pairExists && !wasJustCreated)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-pink-600 hover:bg-pink-700'
        }`}
      >
        {!isConnected
          ? 'Connect Wallet First'
          : (pairExists && !wasJustCreated)
          ? 'Pair Already Exists'
          : isPending
          ? 'Awaiting Confirmation...'
          : isConfirming
          ? 'Creating...'
          : 'Create V2 Pair'}
      </button>

      {/* Status Messages */}
      {hash && (
        <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-lg">
          <p className="text-sm text-pink-900">
            <strong>Transaction Hash:</strong>
          </p>
          <p className="text-xs text-pink-700 font-mono break-all mt-1">
            {hash}
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-900 font-semibold">✅ Pair Created Successfully!</p>
          <p className="text-sm text-green-700 mt-1">
            V2 trading pair is ready. You can add liquidity (coming in next phase)
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-900 font-semibold">❌ Creation Failed</p>
          <p className="text-sm text-red-700 mt-1">
            {error.message}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 V2 Features: One pair per token combination, 0.3% fixed fee
        </p>
      </div>
    </div>
  );
}
