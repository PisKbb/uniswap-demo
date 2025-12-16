import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import UniswapV2FactoryArtifact from "@uniswap/v2-core/build/UniswapV2Factory.json";

async function main() {
    console.log("Creating Custom Uniswap V2 Pair...");

    const [deployer] = await ethers.getSigners();
    console.log("Account:", deployer.address);

    // Load deployment info
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const fileName = chainId === 33431n ? "edge-testnet.json" : `deployment-${chainId}.json`;
    const filePath = path.join(__dirname, "../../deployments", fileName);

    if (!fs.existsSync(filePath)) {
        throw new Error("Deployment file not found. Please deploy contracts first.");
    }

    const deployment = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!deployment.v2?.factory) {
        throw new Error("V2 Factory address not found.");
    }

    const factoryAddress = deployment.v2.factory;

    // You can modify these addresses or pass them as command line arguments
    // Option 1: Use Token C and D
    const tokenA = deployment.testTokens?.tokenC || deployment.testTokens.tokenA;
    const tokenB = deployment.testTokens?.tokenD || deployment.testTokens.tokenB;

    // Option 2: Manually specify addresses
    // const tokenA = "0x...";
    // const tokenB = "0x...";

    console.log("\nFactory:", factoryAddress);
    console.log("Token A:", tokenA);
    console.log("Token B:", tokenB);

    // Get factory contract
    const factory = new ethers.Contract(
        factoryAddress,
        UniswapV2FactoryArtifact.abi,
        deployer
    );

    // Check if pair already exists
    const existingPair = await factory.getPair(tokenA, tokenB);
    if (existingPair !== ethers.ZeroAddress) {
        console.log("\n⚠️  Pair already exists:", existingPair);
        console.log("\nIf you want to create a new pair:");
        console.log("1. Deploy new test tokens: pnpm hardhat run scripts/deploy/7-deploy-additional-tokens.ts --network localhost");
        console.log("2. Or restart Hardhat node and redeploy everything");
        return;
    }

    // Create pair
    console.log("\nCreating pair...");
    const tx = await factory.createPair(tokenA, tokenB);
    console.log("Transaction hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");

    // Get pair address
    const pairAddress = await factory.getPair(tokenA, tokenB);
    console.log("\n✅ Pair created successfully!");
    console.log("Pair address:", pairAddress);

    // Update deployment file
    deployment.v2.pairs = deployment.v2.pairs || [];
    deployment.v2.pairs.push({
        tokenA,
        tokenB,
        pair: pairAddress,
        createdAt: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(deployment, null, 2));
    console.log(`\nDeployment info updated in: ${filePath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
