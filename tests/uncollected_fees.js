const { Pool } = require("@uniswap/v3-sdk");
const { Position } = require("@uniswap/v3-sdk");
const { ethers } = require("ethers");
const { BigNumber } = require("@ethersproject/bignumber");
const IUniswapV3PoolABI = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const NonfungiblePositionManagerABI = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");
const { computePoolAddress } = require("@uniswap/v3-sdk");
const { noExponents } = require("./corefunctions");

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-sepolia.public.blastapi.io",
);

async function getUncollectedFees(
  token0_obj,
  token1_obj,
  pool_fee,
  pool_factory_address,
  position_contract_address,
  nft_token_id,
  owner,
  recipient,
) {
  const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);

  const positionContract = new ethers.Contract(
    position_contract_address,
    NonfungiblePositionManagerABI.abi,
    provider,
  );
  // console.log('positionContract: ', positionContract.getFunction('collect'), '\n');

  const poolInfo = await getPoolInfo(
    token0_obj,
    token1_obj,
    pool_fee,
    pool_factory_address,
  );
  // console.log('poolInfo: ', poolInfo, '\n');

  // construct pool instance
  const pool = new Pool(
    token0_obj,
    token1_obj,
    Number(poolInfo.fee),
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    Number(poolInfo.tick),
  );

  const positionInfo = await positionContract.positions(nft_token_id);
  // console.log('positionInfo: ', positionInfo, '\n');

  const position = new Position({
    pool: pool,
    liquidity: positionInfo.liquidity.toString(),
    tickLower: Number(positionInfo.tickLower),
    tickUpper: Number(positionInfo.tickUpper),
  });

  // liquidity token amount
  console.log("amount0:", position.amount0.toSignificant(6));
  console.log("amount1:", position.amount1.toSignificant(6));

  /* GET ACCRUED UNCLAIMDED FEES */
  // callStatic simulates a call without state changes
  const results = await positionContract.callStatic.collect(
    {
      tokenId: nft_token_id,
      recipient: recipient,
      amount0Max: MAX_UINT128,
      amount1Max: MAX_UINT128,
    },
    { from: owner },
  );
  // console.log("Fee0: ", parseFloat(results.amount0) / 100);
  // console.log("Fee1: ", parseFloat(results.amount1) / 100);

  const fee_token0 = (
    results.amount0 /
    10 ** Number(token0_obj.decimals)
  ).toFixed(Number(token0_obj.decimals));
  const fee_token1 = (
    results.amount1 /
    10 ** Number(token1_obj.decimals)
  ).toFixed(Number(token1_obj.decimals));

  console.log("fee_token0: ", fee_token0.toString());
  console.log("fee_token1: ", fee_token1.toString());
}

async function getPoolInfo(
  token0_obj,
  token1_obj,
  pool_fee,
  pool_factory_address,
) {
  if (!provider) {
    throw new Error("No provider");
  }

  const currentPoolAddress = computePoolAddress({
    factoryAddress: pool_factory_address,
    tokenA: token0_obj,
    tokenB: token1_obj,
    fee: pool_fee,
  });

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider,
  );

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

module.exports = { getUncollectedFees };
