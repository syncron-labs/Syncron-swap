export function getTickFromPrice(
  price: number,
  formTokenDecimal: number,
  toTokenDecimal: number,
  floorOrCeil: "floor" | "ceil" = "floor",
): number {
  const fromTokenSmallestUnit = 10 ** formTokenDecimal;
  const toTokenSmallestUnit = 10 ** toTokenDecimal;
  return Math[floorOrCeil](
    Math.log(price * (toTokenSmallestUnit / fromTokenSmallestUnit)) /
      Math.log(1.0001),
  );
}

export function getPriceFromTick(
  tick: number,
  formTokenDecimal: number,
  toTokenDecimal: number,
): number {
  const fromTokenSmallestUnit = 10 ** formTokenDecimal;
  const toTokenSmallestUnit = 10 ** toTokenDecimal;
  return 1.0001 ** tick * (fromTokenSmallestUnit / toTokenSmallestUnit);
}

//from token0 to token1
export function getPriceFromSqrtPx96(
  sqrtPx96: number,
  token0Decimal: number,
  token1Decimal: number,
): number {
  const token0SmallestUnit = 10 ** token0Decimal;
  const token1SmallestUnit = 10 ** token1Decimal;
  return (sqrtPx96 / 2 ** 96) ** 2 * (token0SmallestUnit / token1SmallestUnit);
}

//from token0 to token1
export function getSqrtPx96FromPrice(
  price: number,
  token0Decimal: number,
  token1Decimal: number,
): number {
  const token0SmallestUnit = 10 ** token0Decimal;
  const token1SmallestUnit = 10 ** token1Decimal;
  return Math.sqrt((price * token1SmallestUnit) / token0SmallestUnit) * 2 ** 96;
}

export function getTickAtSqrtPrice(
  sqrtPx96: number,
  token0Decimal: number,
  token1Decimal: number,
) {
  let tick = Math.floor(
    Math.log(getPriceFromSqrtPx96(sqrtPx96, token0Decimal, token1Decimal)) /
      Math.log(1.0001),
  );
  return tick;
}
