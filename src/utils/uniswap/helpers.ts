import { Token } from "@uniswap/sdk-core";
import {
  getPriceFromSqrtPx96,
  getPriceFromTick,
  getSqrtPx96FromPrice,
  getTickFromPrice,
} from "./maths";
import {
  beautifyNumber,
  convertCoinAmountToInt,
  empty,
  formatAmountKnL,
  formatNumber,
} from "../corefunctions";
import { getPoolInfo } from "./pool";
import { NetworkData } from "../types";
import { EVM_NATIVE_DECIMAL } from "../network/coin-data";
import { FeeAmount, TICK_SPACINGS } from "@uniswap/v3-sdk";

export function getToken0Token1(
  tokenA: Token,
  tokenB: Token,
): { token0: Token; token1: Token } {
  const token0 = tokenA.address < tokenB.address ? tokenA : tokenB;
  const token1 = tokenA.address > tokenB.address ? tokenA : tokenB;
  return { token0, token1 };
}

export async function getPrice(params: {
  fromToken: Token;
  toToken: Token;
  fee?: number;
  network_data?: NetworkData;
  sqrtPx96?: number;
}): Promise<number> {
  if (empty(params.sqrtPx96) && empty(params.network_data)) {
    throw new Error("sqrtPx96 or network_data must required");
  }

  if (empty(params.sqrtPx96)) {
    const { sqrtPriceX96 } = await getPoolInfo(
      params.network_data,
      params.fromToken,
      params.toToken,
      params.fee,
    );
    params.sqrtPx96 = Number(sqrtPriceX96);
  }

  const { token0, token1 } = getToken0Token1(params.fromToken, params.toToken);

  let price = getPriceFromSqrtPx96(
    params.sqrtPx96,
    token0.decimals,
    token1.decimals,
  );
  if (params.fromToken.address > params.toToken.address) {
    price = 1 / price;
  }
  price = formatNumber(price, EVM_NATIVE_DECIMAL);
  return price;
}

export function getSqrtPx96(params: {
  fromToken: Token;
  toToken: Token;
  price: number;
}): number {
  if (params.fromToken.address > params.toToken.address) {
    params.price = 1 / params.price;
  }

  const { token0, token1 } = getToken0Token1(params.fromToken, params.toToken);

  const sqrtPx96 = getSqrtPx96FromPrice(
    params.price,
    token0.decimals,
    token1.decimals,
  );
  return sqrtPx96;
}

export function parseTokenURItoJson(tokenURI: string): {
  description: string;
  name: string;
  image: string;
} {
  tokenURI = tokenURI.split(",")[1];
  const jsonData = atob(tokenURI);
  const decodedData: {
    description: string;
    name: string;
    image: string;
  } = JSON.parse(jsonData);
  return decodedData;
}

export function getTickNPrice(
  fromToken: Token,
  toToken: Token,
  output_type: "rounded" | "next" | "prev",
  fee: FeeAmount,
  price?: number,
  tick?: number,
  rounded_formula: "floor" | "ceil" = "floor",
): { price: number; tick: number } {
  if (empty(price) && empty(tick)) {
    throw new Error("price or tick must required");
  }

  const tick_spacing = TICK_SPACINGS[fee];
  // console.log("tick_spacing: ", tick_spacing);

  price = price || getPriceFromTick(tick, fromToken.decimals, toToken.decimals);
  console.log("price: ", price);
  tick =
    tick ??
    getTickFromPrice(price, fromToken.decimals, toToken.decimals, "ceil");
  // console.log("tick: ", tick);

  if (output_type == "rounded") {
    const multiplier_of_tick_space = Math[rounded_formula](tick / tick_spacing);
    // console.log('multiplier_of_tick_space: ', multiplier_of_tick_space);

    const rounded_next_tick = multiplier_of_tick_space * tick_spacing;
    tick = rounded_next_tick;
  } else if (output_type == "next") {
    tick += tick_spacing;
  } else if (output_type == "prev") {
    tick -= tick_spacing;
  }
  // console.log('tick: ', tick);

  price = getPriceFromTick(tick, fromToken.decimals, toToken.decimals);
  // console.log("tick n price: ", { price, tick });
  return { price, tick };
}

export function getSlippageMinAmount(
  amount: number,
  decimal: number,
  percent = 10,
): string {
  return convertCoinAmountToInt(
    amount - (amount * percent) / 100,
    decimal,
  ).toString();
}
