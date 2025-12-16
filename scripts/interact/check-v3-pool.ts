import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import UniswapV3FactoryArtifact from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import UniswapV3PoolArtifact from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import TestTokenArtifact from "../../artifacts/contracts/token/TestToken.sol/TestToken.json";

async function main() {
    console.log("Checking Uniswap V3 Pool Information...\n");

    const [deployer] = await ethers.getSigners();

    // Load deployment info
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const fileName = chainId === 33431n ? "edge-testnet.json" : `deployment-${chainId}.json`;
    const filePath = path.join(__dirname, "../../deployments", fileName);

    if (!fs.existsSync(filePath)) {
        throw new Error("Deployment file not found.");
    }

    const deployment = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Use the first pool from deployment if exists, otherwise use current testTokens
    let tokenA: string, tokenB: string, fee: number;

    if (deployment.v3.pools && deployment.v3.pools.length > 0) {
        // Use the first created pool
        const firstPool = deployment.v3.pools[0];
        tokenA = firstPool.tokenA;
        tokenB = firstPool.tokenB;
        fee = firstPool.fee;
        console.log("Checking first created pool from deployment records...");
    } else {
        // Use current testTokens
        tokenA = deployment.testTokens.tokenA;
        tokenB = deployment.testTokens.tokenB;
        fee = 3000; // default
        console.log("No pools found in records, checking current testTokens...");
    }

    const factoryAddress = deployment.v3.factory;

    console.log("Factory:", factoryAddress);
    console.log("Token A:", tokenA);
    console.log("Token B:", tokenB);
    console.log("Fee Tier:", fee, `(${fee / 10000}%)`);

    // Get factory contract
    const factory = new ethers.Contract(
        factoryAddress,
        UniswapV3FactoryArtifact.abi,
        deployer
    );

    // Check pool
    const poolAddress = await factory.getPool(tokenA, tokenB, fee);

    if (poolAddress === ethers.ZeroAddress) {
        console.log("\n❌ Pool does not exist yet.");
        console.log("\nTo create this pool:");
        console.log("  pnpm hardhat run scripts/interact/create-v3-pool.ts --network localhost");

        // List all pools
        if (deployment.v3.pools && deployment.v3.pools.length > 0) {
            console.log("\n\nOTHER CREATED POOLS");
            console.log("=".repeat(60));
            deployment.v3.pools.forEach((p: any, index: number) => {
                console.log(`\n${index + 1}. Pool: ${p.pool}`);
                console.log(`   Token A: ${p.tokenA}`);
                console.log(`   Token B: ${p.tokenB}`);
                console.log(`   Fee Tier: ${p.fee / 10000}% (${p.fee})`);
                console.log(`   Initial Price: ${p.initialPrice}`);
                console.log(`   Created: ${p.createdAt}`);
            });
            console.log("\n" + "=".repeat(60));
        }
        return;
    }

    console.log("\n✅ Pool exists:", poolAddress);

    // Get pool contract
    const pool = new ethers.Contract(
        poolAddress,
        UniswapV3PoolArtifact.abi,
        deployer
    );

    // Get pool info
    const token0 = await pool.token0();
    const token1 = await pool.token1();
    const liquidity = await pool.liquidity();
    const slot0 = await pool.slot0();
    const tickSpacing = await pool.tickSpacing();

    // Get token info
    const token0Contract = new ethers.Contract(token0, TestTokenArtifact.abi, deployer);
    const token1Contract = new ethers.Contract(token1, TestTokenArtifact.abi, deployer);

    const token0Symbol = await token0Contract.symbol();
    const token1Symbol = await token1Contract.symbol();
    const token0Name = await token0Contract.name();
    const token1Name = await token1Contract.name();
    const token0Decimals = await token0Contract.decimals();
    const token1Decimals = await token1Contract.decimals();

    // Calculate price from sqrtPriceX96
    const sqrtPriceX96 = slot0.sqrtPriceX96;
    const isInitialized = sqrtPriceX96 > 0n;

    console.log("\n" + "=".repeat(60));
    console.log("POOL DETAILS");
    console.log("=".repeat(60));
    console.log(`Pool Address:     ${poolAddress}`);
    console.log(`Fee Tier:         ${fee / 10000}% (${fee})`);
    console.log(`Tick Spacing:     ${tickSpacing}`);
    console.log(`Total Liquidity:  ${liquidity.toString()}`);
    console.log(`Initialized:      ${isInitialized ? 'YES ✅' : 'NO ❌'}`);

    if (isInitialized) {
        console.log(`Current Tick:     ${slot0.tick}`);
        console.log(`SqrtPriceX96:     ${sqrtPriceX96.toString()}`);
        console.log(`Observation Idx:  ${slot0.observationIndex}`);
        console.log(`Observation Card: ${slot0.observationCardinality}`);
    }

    console.log("\n" + "-".repeat(60));
    console.log("TOKEN 0");
    console.log("-".repeat(60));
    console.log(`Address:          ${token0}`);
    console.log(`Name:             ${token0Name}`);
    console.log(`Symbol:           ${token0Symbol}`);
    console.log(`Decimals:         ${token0Decimals}`);

    console.log("\n" + "-".repeat(60));
    console.log("TOKEN 1");
    console.log("-".repeat(60));
    console.log(`Address:          ${token1}`);
    console.log(`Name:             ${token1Name}`);
    console.log(`Symbol:           ${token1Symbol}`);
    console.log(`Decimals:         ${token1Decimals}`);

    if (isInitialized && liquidity > 0n) {
        // Calculate human-readable price
        // price = (sqrtPriceX96 / 2^96)^2
        const Q96 = BigInt(2) ** BigInt(96);
        const sqrtPrice = Number(sqrtPriceX96) / Number(Q96);
        const price = sqrtPrice * sqrtPrice;

        // Adjust for decimals
        const decimalAdjust = Math.pow(10, Number(token0Decimals) - Number(token1Decimals));
        const adjustedPrice = price * decimalAdjust;

        console.log("\n" + "=".repeat(60));
        console.log("PRICE INFORMATION");
        console.log("=".repeat(60));
        console.log(`1 ${token0Symbol} = ${adjustedPrice.toFixed(6)} ${token1Symbol}`);
        console.log(`1 ${token1Symbol} = ${(1 / adjustedPrice).toFixed(6)} ${token0Symbol}`);
        console.log("\nFormula:");
        console.log(`  Price = (sqrtPriceX96 / 2^96)^2`);
        console.log(`  SqrtPrice = ${sqrtPrice.toFixed(18)}`);
        console.log(`  Raw Price = ${price.toFixed(18)}`);
        console.log("=".repeat(60));
    } else if (isInitialized && liquidity === 0n) {
        // Calculate price even without liquidity
        const Q96 = BigInt(2) ** BigInt(96);
        const sqrtPrice = Number(sqrtPriceX96) / Number(Q96);
        const price = sqrtPrice * sqrtPrice;
        const decimalAdjust = Math.pow(10, Number(token0Decimals) - Number(token1Decimals));
        const adjustedPrice = price * decimalAdjust;

        console.log("\n" + "=".repeat(60));
        console.log("PRICE INFORMATION (No Liquidity)");
        console.log("=".repeat(60));
        console.log(`1 ${token0Symbol} = ${adjustedPrice.toFixed(6)} ${token1Symbol}`);
        console.log(`1 ${token1Symbol} = ${(1 / adjustedPrice).toFixed(6)} ${token0Symbol}`);
        console.log("\n⚠️  Pool is initialized but has no liquidity yet.");
        console.log("=".repeat(60));
    } else {
        console.log("\n" + "=".repeat(60));
        console.log("⚠️  Pool exists but not initialized yet.");
        console.log("\nTo initialize this pool:");
        console.log("  pnpm hardhat run scripts/interact/create-v3-pool.ts --network localhost");
        console.log("=".repeat(60));
    }

    // List all pools from deployment file
    if (deployment.v3.pools && deployment.v3.pools.length > 0) {
        console.log("\n\nALL CREATED POOLS");
        console.log("=".repeat(60));
        deployment.v3.pools.forEach((p: any, index: number) => {
            const isCurrent = p.pool === poolAddress;
            console.log(`\n${index + 1}. Pool: ${p.pool} ${isCurrent ? '← CURRENT' : ''}`);
            console.log(`   Token A: ${p.tokenA}`);
            console.log(`   Token B: ${p.tokenB}`);
            console.log(`   Fee Tier: ${p.fee / 10000}% (${p.fee})`);
            console.log(`   Initial Price: ${p.initialPrice}`);
            console.log(`   Created: ${p.createdAt}`);
        });
        console.log("\n" + "=".repeat(60));
    }

    // Check other fee tiers for same token pair
    console.log("\n\nOTHER FEE TIERS FOR THIS PAIR");
    console.log("=".repeat(60));
    const feeTiers = [500, 3000, 10000];
    for (const feeTier of feeTiers) {
        if (feeTier === fee) continue; // Skip current fee tier
        const otherPool = await factory.getPool(tokenA, tokenB, feeTier);
        if (otherPool !== ethers.ZeroAddress) {
            console.log(`✅ ${feeTier / 10000}% Fee Pool: ${otherPool}`);
        } else {
            console.log(`❌ ${feeTier / 10000}% Fee Pool: Not created`);
        }
    }
    console.log("=".repeat(60));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
