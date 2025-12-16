# Hardhat Smart Contract Development Scaffold

A Hardhat-based smart contract development scaffold project that provides complete smart contract development, testing, deployment, and verification capabilities.

## Features

- Written in TypeScript
- Supports Solidity 0.8.27
- Integrated with OpenZeppelin Contract Library
- Complete Testing Framework
- Gas Usage Reports
- Code Coverage Reports
- Multi-network Deployment Support
- Contract Verification Support

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Compile Contracts

```bash
pnpm compile
```

### Run Tests

```bash
pnpm test
```

### Check Code Coverage

```bash
pnpm coverage
```

### Deploy Contracts

Deploy to local network:
```bash
pnpm deploy
```

Deploy to test networks:
```bash
pnpm deploy:sepolia    # Sepolia Testnet
pnpm deploy:base-sepolia # Base Sepolia Testnet
```

## Project Structure

```
.
├── contracts/           # Smart contract source code
├── scripts/            # Deployment and management scripts
├── test/              # Test files
├── .env.example       # Environment variable template
└── hardhat.config.ts  # Hardhat configuration file
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the following environment variables:

- `PRIVATE_KEY`: Private key of the deployment account
- `SEPOLIA_RPC_URL`: Sepolia testnet RPC URL
- `BASE_SEPOLIA_RPC_URL`: Base Sepolia testnet RPC URL
- `ETHERSCAN_API_KEY`: Etherscan API key (for contract verification)
- `BASESCAN_API_KEY`: Basescan API key
- `COINMARKETCAP_API_KEY`: CoinMarketCap API key (for gas reporting)

## Example Contract

The project includes an example ERC20 token contract (`ExampleToken.sol`) that implements the following features:

- Basic ERC20 functionality
- Token minting
- Token burning
- Transfer pausing
- Role-based access control

## Script Description

- `scripts/deploy.ts`: Deploy contracts
- `scripts/verify.ts`: Verify contracts
- `scripts/manage-roles.ts`: Manage contract roles
- `scripts/manage-users.ts`: Manage users

## Testing

Run the complete test suite:

```bash
pnpm test
```

Generate code coverage report:

```bash
pnpm coverage
```

## Contributing

Issues and Pull Requests are welcome.

## License

MIT# uniswap-demo
