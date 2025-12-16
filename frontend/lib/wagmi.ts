'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Localhost Hardhat Network
export const localhost = defineChain({
  id: 31337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545']
    },
  },
  testnet: true,
});

// Edge Testnet
export const edgeTestnet = defineChain({
  id: 33431,
  name: 'Edge Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['https://edge-testnet.g.alchemy.com/public']
    },
  },
  blockExplorers: {
    default: {
      name: 'Edge Explorer',
      url: 'https://edge-testnet.explorer.alchemy.com'
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: 'Uniswap Demo - Multi Network',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [edgeTestnet, localhost],
  ssr: true,
});
