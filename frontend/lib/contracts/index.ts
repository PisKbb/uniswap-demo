import TestTokenABI from './TestToken.json';
import UniswapV2FactoryABI from './UniswapV2Factory.json';
import UniswapV3FactoryABI from './UniswapV3Factory.json';
import UniswapV3PoolABI from './UniswapV3Pool.json';

export const ABIS = {
  ERC20: TestTokenABI,
  TEST_TOKEN: TestTokenABI,
  UNISWAP_V2_FACTORY: UniswapV2FactoryABI,
  UNISWAP_V3_FACTORY: UniswapV3FactoryABI,
  UNISWAP_V3_POOL: UniswapV3PoolABI,
} as const;
