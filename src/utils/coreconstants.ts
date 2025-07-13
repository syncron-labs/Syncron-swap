import { FeeAmount } from "@uniswap/v3-sdk";

export enum LOCAL_STORAGE_KEY {
  IS_DISCONNECTED = "is_disconnected",
}

export const MAX_APPROVE_AMOUNT_INT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const LIQUIDITY_PRICE_RANGE: {
  [fee: number]: {
    // min_price: number;
    // max_price: number;
    min_tick: number;
    max_tick: number;
  };
} = {
  [FeeAmount.LOW]: {
    // min_price: 0.000000000000000000000000000000000000002939544628365392,
    // max_price: 340188745682039630000000000000000000000,
    min_tick: -887270,
    max_tick: 887270,
  },
  [FeeAmount.MEDIUM]: {
    // min_price: 0.0000000000000000000000000000000000000029542784186117496,
    // max_price: 338492131851916600000000000000000000000,
    min_tick: -887220,
    max_tick: 887220,
  },
  [FeeAmount.HIGH]: {
    // min_price: 0.000000000000000000000000000000000000002960192591947277,
    // max_price: 337815857900711430000000000000000000000,
    min_tick: -887200,
    max_tick: 887200,
  },
};

export const PoolFeeText = {
  [FeeAmount.LOW]: "0.05",
  [FeeAmount.MEDIUM]: "0.30",
  [FeeAmount.HIGH]: "1.00",
};

export const ETH_NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const INFINITY_TEXT = "∞";

export enum ORDER_DIRECTION {
  ASC = "asc",
  DESC = "desc",
}
