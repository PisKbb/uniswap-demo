'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { localhost, edgeTestnet } from '@/lib/wagmi';
import { CHAIN_IDS } from '@/lib/constants';

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const networks = [
    { id: CHAIN_IDS.LOCALHOST, name: 'Localhost', icon: '🏠', color: 'bg-green-100 text-green-800 border-green-300' },
    { id: CHAIN_IDS.EDGE_TESTNET, name: 'Edge Testnet', icon: '🌐', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  ];

  const currentNetwork = networks.find(n => n.id === chainId);
  const isConnectedToSupportedNetwork = !!currentNetwork;

  return (
    <div className="flex items-center space-x-2">
      {/* Current Network Badge */}
      {isConnectedToSupportedNetwork ? (
        <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${currentNetwork.color}`}>
          <span className="mr-1">{currentNetwork.icon}</span>
          {currentNetwork.name}
        </div>
      ) : (
        <div className="px-3 py-1.5 rounded-lg border text-sm font-medium bg-red-100 text-red-800 border-red-300">
          <span className="mr-1">⚠️</span>
          Unsupported Network
        </div>
      )}

      {/* Network Switcher Dropdown */}
      <div className="relative group">
        <button className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
          Switch Network ↓
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="py-1">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => switchChain({ chainId: network.id })}
                disabled={chainId === network.id}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center transition-colors ${
                  chainId === network.id ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <span className="mr-2">{network.icon}</span>
                <span className="flex-1">{network.name}</span>
                {chainId === network.id && (
                  <span className="text-xs text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Network Info */}
          <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
            <div className="mb-1">
              <strong>Localhost:</strong> http://127.0.0.1:8545
            </div>
            <div>
              <strong>Edge Testnet:</strong> Chain ID 33431
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
