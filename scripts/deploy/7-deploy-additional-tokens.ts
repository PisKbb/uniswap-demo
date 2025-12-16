import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    console.log("\nDeploying additional Test Tokens (C and D)...");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer account:", deployer.address);

    const TestToken = await ethers.getContractFactory("TestToken");

    // Deploy Token C
    console.log("\n1. Deploying Test Token C...");
    const tokenC = await TestToken.deploy(
        "Test Token C",
        "TKC",
        ethers.parseEther("1000000")
    );
    await tokenC.waitForDeployment();
    const tokenCAddress = await tokenC.getAddress();
    console.log("Test Token C deployed:", tokenCAddress);

    // Deploy Token D
    console.log("\n2. Deploying Test Token D...");
    const tokenD = await TestToken.deploy(
        "Test Token D",
        "TKD",
        ethers.parseEther("1000000")
    );
    await tokenD.waitForDeployment();
    const tokenDAddress = await tokenD.getAddress();
    console.log("Test Token D deployed:", tokenDAddress);

    // Load existing deployment
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const fileName = chainId === 33431n ? "edge-testnet.json" : `deployment-${chainId}.json`;
    const filePath = path.join(__dirname, "../../deployments", fileName);

    const deployment = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Add new tokens
    deployment.testTokens = {
        ...deployment.testTokens,
        tokenC: tokenCAddress,
        tokenD: tokenDAddress
    };

    fs.writeFileSync(filePath, JSON.stringify(deployment, null, 2));

    console.log("\n✅ Additional test tokens deployed!");
    console.log("Deployment info updated in:", filePath);
    console.log("\nNew tokens:");
    console.log("  Token C (TKC):", tokenCAddress);
    console.log("  Token D (TKD):", tokenDAddress);
    console.log("\nYou can now create a new pair with these tokens:");
    console.log("  pnpm hardhat run scripts/interact/create-v2-pair-custom.ts --network localhost");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
