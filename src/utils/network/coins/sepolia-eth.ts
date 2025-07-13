import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_BAISC_DATA } from "../coin-data";
import { NetworkCoinData } from "../../types";

export const sepolia_eth_coin_data: NetworkCoinData = {
  [COIN_SLUG.ETH]: {
    is_native: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.ETH],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.ETH].code,
      COIN_BAISC_DATA[COIN_SLUG.ETH].name,
    ),
  },
  [COIN_SLUG.WETH]: {
    is_native_wrap: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.WETH],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.WETH].code,
      COIN_BAISC_DATA[COIN_SLUG.WETH].name,
    ),
  },
  [COIN_SLUG.DKFT20]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.DKFT20],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0x58D775552F9e3F6DcFB28C9a8F7B62Ac00fc1ac5",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].code,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].name,
    ),
  },
  [COIN_SLUG.WBTC]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.WBTC],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0x0F892c2988F620Ad27ABf876b74A9B1b4888E7Ac",
      8,
      COIN_BAISC_DATA[COIN_SLUG.WBTC].code,
      COIN_BAISC_DATA[COIN_SLUG.WBTC].name,
    ),
  },
  [COIN_SLUG.USDT]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.USDT],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0xDF63209324a4958F289178638972fcb76ef0917B",
      6,
      COIN_BAISC_DATA[COIN_SLUG.USDT].code,
      COIN_BAISC_DATA[COIN_SLUG.USDT].name,
    ),
  },
  [COIN_SLUG.UNI]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.UNI],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.UNI].code,
      COIN_BAISC_DATA[COIN_SLUG.UNI].name,
    ),
  },
};
