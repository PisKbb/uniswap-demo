// Contract addresses configuration for different networks

// Localhost (Hardhat) addresses - from deployment-31337.json
const LOCALHOST_CONTRACTS = {
  WETH: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  V2: {
    FACTORY: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    ROUTER: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  },
  V3: {
    FACTORY: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    SWAP_ROUTER: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    POSITION_MANAGER: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
  },
  TEST_TOKENS: {
    TOKEN_A: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    TOKEN_B: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
  },
} as const;

// Edge Testnet addresses - update after deployment
const EDGE_TESTNET_CONTRACTS = {
  WETH: process.env.NEXT_PUBLIC_WETH_ADDRESS || "",
  V2: {
    FACTORY: process.env.NEXT_PUBLIC_V2_FACTORY || "",
    ROUTER: process.env.NEXT_PUBLIC_V2_ROUTER || "",
  },
  V3: {
    FACTORY: process.env.NEXT_PUBLIC_V3_FACTORY || "",
    SWAP_ROUTER: process.env.NEXT_PUBLIC_V3_SWAP_ROUTER || "",
    POSITION_MANAGER: process.env.NEXT_PUBLIC_V3_POSITION_MANAGER || "",
  },
  TEST_TOKENS: {
    TOKEN_A: process.env.NEXT_PUBLIC_TEST_TOKEN_A || "",
    TOKEN_B: process.env.NEXT_PUBLIC_TEST_TOKEN_B || "",
  },
} as const;

// Get contracts for current chain
export const getContracts = (chainId: number) => {
  switch (chainId) {
    case 31337: // Localhost
      return LOCALHOST_CONTRACTS;
    case 33431: // Edge Testnet
      return EDGE_TESTNET_CONTRACTS;
    default:
      return LOCALHOST_CONTRACTS; // Default to localhost
  }
};

// Export default contracts (for backwards compatibility)
export const CONTRACTS = LOCALHOST_CONTRACTS;

// Chain IDs
export const CHAIN_IDS = {
  LOCALHOST: 31337,
  EDGE_TESTNET: 33431,
} as const;
