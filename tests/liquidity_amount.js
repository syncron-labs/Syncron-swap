function getPrice(sqrtPriceX96) {
  // price from token0 to token1; 1 token0 = price token1
  return (sqrtPriceX96 / 2 ** 96) ** 2;
  //or
  // return (1.0001 ** currentTick);
};

function getTokenAmountsOurs(
  liquidity, 
  sqrtPriceX96, 
  tickLower, 
  tickUpper, 
  Decimal0, 
  Decimal1
) {
  const price = getPrice(sqrtPriceX96);
  const sqrtRatioL = Math.sqrt(1.0001 ** tickLower);
  const sqrtRatioU = Math.sqrt(1.0001 ** tickUpper);
  const sqrtP = Math.sqrt(price);

  let amount_token0 = 0;
  let amount_token1 = 0;

  const currentTick = Math.floor(Math.log(price) / Math.log(1.0001));

  if (currentTick < tickLower) {
    amount_token0 = Math.floor(
      liquidity * ((sqrtRatioU - sqrtRatioL) / (sqrtRatioL * sqrtRatioU)),
    );
  } else if (currentTick >= tickUpper) {
    amount_token1 = Math.floor(liquidity * (sqrtRatioU - sqrtRatioL));
  } else if (currentTick >= tickLower && currentTick < tickUpper) {
    amount_token0 = liquidity * ((sqrtRatioU - sqrtP) / (sqrtRatioU * sqrtP));
    amount_token1 = liquidity * (sqrtP - sqrtRatioL);
  }

  amount_token0 = (amount_token0 / 10 ** Decimal0).toFixed(Decimal0);
  amount_token1 = (amount_token1 / 10 ** Decimal1).toFixed(Decimal1);

  console.log("price:", 1 / price);
  console.log("Amount of Token0:", amount_token0.toString());
  console.log("Amount of Token1:", amount_token1.toString());
}

/* ===== */

const JSBI = require("jsbi");
const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

function getTickAtSqrtPrice(sqrtPriceX96) {
  let tick = Math.floor(Math.log((sqrtPriceX96 / Q96) ** 2) / Math.log(1.0001));
  return tick;
}

function getTokenAmountsTheirs(
  liquidity,
  sqrtPriceX96,
  tickLow,
  tickHigh,
  Decimal0,
  Decimal1,
) {
  let sqrtRatioL = Math.sqrt(1.0001 ** tickLow);
  let sqrtRatioU = Math.sqrt(1.0001 ** tickHigh);
  let currentTick = getTickAtSqrtPrice(sqrtPriceX96);
  let sqrtPrice = sqrtPriceX96 / Q96;
  let amount0 = 0;
  let amount1 = 0;
  if (currentTick < tickLow) {
    amount0 = Math.floor(
      liquidity * ((sqrtRatioU - sqrtRatioL) / (sqrtRatioL * sqrtRatioU)),
    );
  } else if (currentTick >= tickHigh) {
    amount1 = Math.floor(liquidity * (sqrtRatioU - sqrtRatioL));
  } else if (currentTick >= tickLow && currentTick < tickHigh) {
    amount0 = Math.floor(
      liquidity * ((sqrtRatioU - sqrtPrice) / (sqrtPrice * sqrtRatioU)),
    );
    amount1 = Math.floor(liquidity * (sqrtPrice - sqrtRatioL));
  }

  let amount0Human = (amount0 / 10 ** Decimal0).toFixed(Decimal0);
  let amount1Human = (amount1 / 10 ** Decimal1).toFixed(Decimal1);

  // console.log("Amount Token0 in lowest decimal: "+amount0);
  // console.log("Amount Token1 in lowest decimal: "+amount1);
  console.log("Amount Token0 : " + amount0Human);
  console.log("Amount Token1 : " + amount1Human);
  return [amount0, amount1];
}

module.exports = { getTokenAmountsOurs, getTokenAmountsTheirs };
