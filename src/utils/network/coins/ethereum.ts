import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_BAISC_DATA } from "../coin-data";
import { NetworkCoinData } from "../../types";

export const eth_coin_data: NetworkCoinData = {
  [COIN_SLUG.ETH]: {
    is_native: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.ETH],
    token_info: new Token(
      ChainId.MAINNET,
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.ETH].code,
      COIN_BAISC_DATA[COIN_SLUG.ETH].name,
    ),
  },
  [COIN_SLUG.WETH]: {
    is_native_wrap: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.WETH],
    token_info: new Token(
      ChainId.MAINNET,
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.WETH].code,
      COIN_BAISC_DATA[COIN_SLUG.WETH].name,
    ),
  },
  [COIN_SLUG.USDC]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.USDC],
    token_info: new Token(
      ChainId.MAINNET,
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      6,
      COIN_BAISC_DATA[COIN_SLUG.USDC].code,
      COIN_BAISC_DATA[COIN_SLUG.USDC].name,
    ),
  },
  [COIN_SLUG.UNI]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.UNI],
    token_info: new Token(
      ChainId.MAINNET,
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.UNI].code,
      COIN_BAISC_DATA[COIN_SLUG.UNI].name,
    ),
  },
};
