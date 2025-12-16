# Uniswap V2/V3 Demo Frontend

A demo application for creating Uniswap V2 trading pairs and V3 liquidity pools on Edge Testnet.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: RainbowKit + Wagmi v2 + Viem
- **Blockchain**: Edge Testnet (Chain ID: 33431)

## Features

### Current Phase ✅
- 🪙 **Mint Test Tokens**: Mint TKA and TKB tokens for free
- 🔀 **Create V2 Pairs**: Create Uniswap V2 trading pairs
- 🏊 **Create V3 Pools**: Create and initialize V3 liquidity pools with custom fee tiers

### Next Phase ⏳
- Add liquidity to V2/V3
- Swap tokens
- Remove liquidity

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MetaMask or other Web3 wallet

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Update `.env.local` with your values:
   - Get a WalletConnect Project ID from https://cloud.walletconnect.com
   - Update contract addresses after deployment

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage
│   ├── mint/page.tsx        # Mint tokens page
│   └── create-pair/page.tsx # Create pair/pool page
├── components/              # React components
│   ├── v2/CreatePair.tsx   # V2 pair creation
│   └── v3/CreatePool.tsx   # V3 pool creation
├── lib/                     # Utilities and configuration
│   ├── wagmi.ts            # Wagmi configuration
│   ├── constants.ts        # Contract addresses
│   └── contracts/          # Contract ABIs
└── public/                 # Static assets
```

## Usage

### 1. Connect Wallet

Click the "Connect Wallet" button in the header and select your wallet provider.

### 2. Switch to Edge Testnet

The app will automatically prompt you to add and switch to Edge Testnet network.

### 3. Mint Test Tokens

1. Go to "Mint Test Tokens" page
2. Select token (TKA or TKB)
3. Enter amount (e.g., 1000)
4. Click "Mint" and confirm transaction

### 4. Create V2 Pair

1. Go to "Create Pair/Pool" page
2. Select "Uniswap V2" tab
3. Enter Token A and Token B addresses
4. Click "Create V2 Pair" and confirm transaction

### 5. Create V3 Pool

1. Go to "Create Pair/Pool" page
2. Select "Uniswap V3" tab
3. Enter Token A and Token B addresses
4. Select fee tier (0.05%, 0.3%, or 1%)
5. Set initial price (e.g., 1 for 1:1 ratio)
6. Click "Create V3 Pool" and confirm
7. Click "Initialize Price" and confirm

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID | - |
| `NEXT_PUBLIC_CHAIN_ID` | Target chain ID | 31337 |
| `NEXT_PUBLIC_WETH_ADDRESS` | WETH contract address | localhost value |
| `NEXT_PUBLIC_V2_FACTORY` | V2 Factory address | localhost value |
| `NEXT_PUBLIC_V2_ROUTER` | V2 Router address | localhost value |
| `NEXT_PUBLIC_V3_FACTORY` | V3 Factory address | localhost value |
| `NEXT_PUBLIC_V3_SWAP_ROUTER` | V3 SwapRouter address | localhost value |
| `NEXT_PUBLIC_V3_POSITION_MANAGER` | V3 PositionManager address | localhost value |
| `NEXT_PUBLIC_TEST_TOKEN_A` | Test Token A address | localhost value |
| `NEXT_PUBLIC_TEST_TOKEN_B` | Test Token B address | localhost value |

### Update Contract Addresses

After deploying contracts to Edge Testnet:

1. Copy addresses from `../deployments/edge-testnet.json`
2. Update `.env.local` with new addresses
3. Restart the development server

## Build for Production

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Deploy to Vercel

The easiest way to deploy this Next.js app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/edge-chain-uniswap-demo&project-name=uniswap-demo&repository-name=uniswap-demo&root-directory=frontend&env=NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,NEXT_PUBLIC_CHAIN_ID,NEXT_PUBLIC_WETH_ADDRESS,NEXT_PUBLIC_V2_FACTORY,NEXT_PUBLIC_V2_ROUTER,NEXT_PUBLIC_V3_FACTORY,NEXT_PUBLIC_V3_SWAP_ROUTER,NEXT_PUBLIC_V3_POSITION_MANAGER,NEXT_PUBLIC_TEST_TOKEN_A,NEXT_PUBLIC_TEST_TOKEN_B)

**Important**: Set Root Directory to `frontend` in Vercel settings.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions and troubleshooting.

## Network Information

- **Network Name**: Edge Testnet
- **Chain ID**: 33431
- **RPC URL**: https://edge-testnet.g.alchemy.com/public
- **Explorer**: https://edge-testnet.explorer.alchemy.com

## Troubleshooting

### MetaMask Shows Wrong Network

Manually add Edge Testnet:
- Network Name: Edge Testnet
- RPC URL: https://edge-testnet.g.alchemy.com/public
- Chain ID: 33431
- Currency Symbol: ETH

### Transaction Fails

- Ensure you have enough ETH for gas
- Check contract addresses are correct
- Verify you're on Edge Testnet

### WalletConnect Not Working

- Get a valid Project ID from https://cloud.walletconnect.com
- Update `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`

## License

MIT
