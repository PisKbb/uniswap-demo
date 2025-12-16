import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import UniswapV2FactoryArtifact from "@uniswap/v2-core/build/UniswapV2Factory.json";
import UniswapV2PairArtifact from "@uniswap/v2-core/build/UniswapV2Pair.json";
import TestTokenArtifact from "../../artifacts/contracts/token/TestToken.sol/TestToken.json";

async function main() {
    console.log("Checking Uniswap V2 Pair Information...\n");

    const [deployer] = await ethers.getSigners();

    // Load deployment info
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const fileName = chainId === 33431n ? "edge-testnet.json" : `deployment-${chainId}.json`;
    const filePath = path.join(__dirname, "../../deployments", fileName);

    if (!fs.existsSync(filePath)) {
        throw new Error("Deployment file not found.");
    }

    const deployment = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const factoryAddress = deployment.v2.factory;
    const tokenA = deployment.testTokens.tokenA;
    const tokenB = deployment.testTokens.tokenB;

    console.log("Factory:", factoryAddress);
    console.log("Token A:", tokenA);
    console.log("Token B:", tokenB);

    // Get factory contract
    const factory = new ethers.Contract(
        factoryAddress,
        UniswapV2FactoryArtifact.abi,
        deployer
    );

    // Check pair
    const pairAddress = await factory.getPair(tokenA, tokenB);

    if (pairAddress === ethers.ZeroAddress) {
        console.log("\n❌ Pair does not exist yet.");
        console.log("\nTo create this pair:");
        console.log("  pnpm hardhat run scripts/interact/create-v2-pair.ts --network localhost");
        return;
    }

    console.log("\n✅ Pair exists:", pairAddress);

    // Get pair contract
    const pair = new ethers.Contract(
        pairAddress,
        UniswapV2PairArtifact.abi,
        deployer
    );

    // Get pair info
    const token0 = await pair.token0();
    const token1 = await pair.token1();
    const reserves = await pair.getReserves();
    const totalSupply = await pair.totalSupply();

    // Get token info
    const token0Contract = new ethers.Contract(token0, TestTokenArtifact.abi, deployer);
    const token1Contract = new ethers.Contract(token1, TestTokenArtifact.abi, deployer);

    const token0Symbol = await token0Contract.symbol();
    const token1Symbol = await token1Contract.symbol();
    const token0Name = await token0Contract.name();
    const token1Name = await token1Contract.name();

    console.log("\n" + "=".repeat(60));
    console.log("PAIR DETAILS");
    console.log("=".repeat(60));
    console.log(`Pair Address:     ${pairAddress}`);
    console.log(`Total LP Supply:  ${ethers.formatEther(totalSupply)}`);
    console.log("\n" + "-".repeat(60));
    console.log("TOKEN 0");
    console.log("-".repeat(60));
    console.log(`Address:          ${token0}`);
    console.log(`Name:             ${token0Name}`);
    console.log(`Symbol:           ${token0Symbol}`);
    console.log(`Reserve:          ${ethers.formatEther(reserves[0])}`);
    console.log("\n" + "-".repeat(60));
    console.log("TOKEN 1");
    console.log("-".repeat(60));
    console.log(`Address:          ${token1}`);
    console.log(`Name:             ${token1Name}`);
    console.log(`Symbol:           ${token1Symbol}`);
    console.log(`Reserve:          ${ethers.formatEther(reserves[1])}`);
    console.log("\n" + "=".repeat(60));

    if (totalSupply > 0n) {
        const price0 = reserves[1] * BigInt(1e18) / reserves[0];
        const price1 = reserves[0] * BigInt(1e18) / reserves[1];
        console.log("\nPRICE INFORMATION");
        console.log("-".repeat(60));
        console.log(`1 ${token0Symbol} = ${ethers.formatEther(price0)} ${token1Symbol}`);
        console.log(`1 ${token1Symbol} = ${ethers.formatEther(price1)} ${token0Symbol}`);
        console.log("=".repeat(60));
    } else {
        console.log("\n⚠️  No liquidity in this pair yet.");
        console.log("=".repeat(60));
    }

    // List all pairs from deployment file
    if (deployment.v2.pairs && deployment.v2.pairs.length > 0) {
        console.log("\n\nALL CREATED PAIRS");
        console.log("=".repeat(60));
        deployment.v2.pairs.forEach((p: any, index: number) => {
            console.log(`\n${index + 1}. Pair: ${p.pair}`);
            console.log(`   Token A: ${p.tokenA}`);
            console.log(`   Token B: ${p.tokenB}`);
            console.log(`   Created: ${p.createdAt}`);
        });
        console.log("\n" + "=".repeat(60));
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
