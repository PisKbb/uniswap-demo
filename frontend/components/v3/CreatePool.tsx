'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { getContracts } from '@/lib/constants';
import { ABIS } from '@/lib/contracts';

const FEE_TIERS = [
  { value: 500, label: '0.05%', description: 'Stable pairs' },
  { value: 3000, label: '0.3%', description: 'Standard' },
  { value: 10000, label: '1%', description: 'High volatility' },
];

export default function CreatePool() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const CONTRACTS = getContracts(chainId);
  const [tokenA, setTokenA] = useState(CONTRACTS.TEST_TOKENS.TOKEN_A);
  const [tokenB, setTokenB] = useState(CONTRACTS.TEST_TOKENS.TOKEN_B);
  const [fee, setFee] = useState(3000);
  const [initialPrice, setInitialPrice] = useState('1');
  const [createdPoolAddress, setCreatedPoolAddress] = useState<string | null>(null);

  const { writeContract, data: createHash, isPending: isCreatePending, error: createError, reset: resetCreate } = useWriteContract();
  const { writeContract: initializePool, data: initHash, isPending: isInitPending, error: initError } = useWriteContract();

  const { isLoading: isCreateConfirming, isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({
    hash: createHash,
  });
  const { isLoading: isInitConfirming, isSuccess: isInitSuccess } = useWaitForTransactionReceipt({
    hash: initHash,
  });

  // Check if pool already exists
  const { data: existingPool, refetch: refetchPool } = useReadContract({
    address: CONTRACTS.V3.FACTORY as `0x${string}`,
    abi: ABIS.UNISWAP_V3_FACTORY,
    functionName: 'getPool',
    args: [tokenA as `0x${string}`, tokenB as `0x${string}`, fee],
  });

  const poolExists = !!(existingPool && existingPool !== '0x0000000000000000000000000000000000000000');
  const wasJustCreated = !!(createdPoolAddress && poolExists && existingPool === createdPoolAddress);

  // Update created pool address when transaction succeeds
  useEffect(() => {
    if (isCreateSuccess && poolExists && !createdPoolAddress) {
      setCreatedPoolAddress(existingPool as string);
    }
  }, [isCreateSuccess, poolExists, createdPoolAddress, existingPool]);

  // Calculate sqrtPriceX96 from initial price
  // sqrtPriceX96 = sqrt(price) * 2^96
  const calculateSqrtPriceX96 = (price: string): bigint => {
    try {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        // Default to 1:1 price
        return BigInt('79228162514264337593543950336'); // 2^96
      }

      const sqrtPrice = Math.sqrt(priceNum);
      const Q96 = BigInt(2) ** BigInt(96);
      return BigInt(Math.floor(sqrtPrice * Number(Q96)));
    } catch {
      // Default to 1:1 price
      return BigInt('79228162514264337593543950336');
    }
  };

  const handleCreatePool = async () => {
    if (!tokenA || !tokenB) return;

    writeContract({
      address: CONTRACTS.V3.FACTORY as `0x${string}`,
      abi: ABIS.UNISWAP_V3_FACTORY,
      functionName: 'createPool',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`, fee],
    });
  };

  const handleInitializePool = async () => {
    if (!existingPool || !initialPrice) return;

    const sqrtPriceX96 = calculateSqrtPriceX96(initialPrice);

    initializePool({
      address: existingPool as `0x${string}`,
      abi: ABIS.UNISWAP_V3_POOL,
      functionName: 'initialize',
      args: [sqrtPriceX96],
    });
  };

  const handleTokenChange = (value: string, type: 'A' | 'B') => {
    if (type === 'A') {
      setTokenA(value);
    } else {
      setTokenB(value);
    }
    setCreatedPoolAddress(null);
    resetCreate();
  };

  const handleFeeChange = (newFee: number) => {
    setFee(newFee);
    setCreatedPoolAddress(null);
    resetCreate();
  };

  // Refetch pool after creation
  if (isCreateSuccess && !poolExists) {
    refetchPool();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">
          Uniswap V3 - Create Liquidity Pool
        </h3>
        <p className="text-sm text-gray-600">
          Create and initialize a Uniswap V3 liquidity pool (multiple fee tiers supported)
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
          placeholder="0x..."
        />
        <button
          onClick={() => handleTokenChange(CONTRACTS.TEST_TOKENS.TOKEN_A, 'A')}
          className="mt-1 text-xs text-blue-600 hover:text-blue-800"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
          placeholder="0x..."
        />
        <button
          onClick={() => handleTokenChange(CONTRACTS.TEST_TOKENS.TOKEN_B, 'B')}
          className="mt-1 text-xs text-blue-600 hover:text-blue-800"
        >
          Use TKB
        </button>
      </div>

      {/* Fee Tier Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fee Tier
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FEE_TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => handleFeeChange(tier.value)}
              className={`p-2 rounded-lg border-2 transition-all text-center ${
                fee === tier.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm">{tier.label}</div>
              <div className="text-xs text-gray-500">{tier.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Initial Price Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Initial Price (Token B / Token A)
        </label>
        <input
          type="number"
          value={initialPrice}
          onChange={(e) => setInitialPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="e.g.: 1 means 1:1"
          min="0"
          step="0.000001"
        />
        <p className="mt-1 text-xs text-gray-500">
          Example: 1 = 1:1 price, 2 = 1 Token A = 2 Token B
        </p>
      </div>

      {/* Existing Pool Warning - only show if not just created */}
      {poolExists && !wasJustCreated && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Pool already exists:
          </p>
          <p className="text-xs text-yellow-700 font-mono mt-1 break-all">
            {existingPool as string}
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            You can initialize this pool directly
          </p>
        </div>
      )}

      {/* Create Pool Button */}
      {(!poolExists || wasJustCreated) && (
        <button
          onClick={handleCreatePool}
          disabled={!isConnected || isCreatePending || isCreateConfirming || !tokenA || !tokenB || (poolExists && !wasJustCreated)}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all mb-3 ${
            !isConnected || isCreatePending || isCreateConfirming || !tokenA || !tokenB
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {!isConnected
            ? 'Connect Wallet First'
            : isCreatePending
            ? 'Awaiting Confirmation...'
            : isCreateConfirming
            ? 'Creating...'
            : '1. Create V3 Pool'}
        </button>
      )}

      {/* Initialize Pool Button */}
      {poolExists && (
        <button
          onClick={handleInitializePool}
          disabled={!isConnected || isInitPending || isInitConfirming || !initialPrice}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
            !isConnected || isInitPending || isInitConfirming || !initialPrice
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {!isConnected
            ? 'Connect Wallet First'
            : isInitPending
            ? 'Awaiting Confirmation...'
            : isInitConfirming
            ? 'Initializing...'
            : '2. Initialize Price'}
        </button>
      )}

      {/* Status Messages */}
      {createHash && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Create Transaction Hash:</strong>
          </p>
          <p className="text-xs text-blue-700 font-mono break-all mt-1">
            {createHash}
          </p>
        </div>
      )}

      {initHash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900">
            <strong>Initialize Transaction Hash:</strong>
          </p>
          <p className="text-xs text-green-700 font-mono break-all mt-1">
            {initHash}
          </p>
        </div>
      )}

      {isCreateSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-900 font-semibold">✅ Pool Created Successfully!</p>
          <p className="text-sm text-green-700 mt-1">
            Please continue by clicking the "Initialize Price" button
          </p>
        </div>
      )}

      {isInitSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-900 font-semibold">✅ Price Initialized Successfully!</p>
          <p className="text-sm text-green-700 mt-1">
            V3 liquidity pool is ready. You can add liquidity (coming in next phase)
          </p>
        </div>
      )}

      {(createError || initError) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-900 font-semibold">❌ Operation Failed</p>
          <p className="text-sm text-red-700 mt-1">
            {createError?.message || initError?.message}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 V3 Features: Multiple pools with different fees for same token pair, price must be initialized before use
        </p>
      </div>
    </div>
  );
}
