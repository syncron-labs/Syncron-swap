import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_BAISC_DATA } from "../coin-data";
import { NetworkCoinData } from "../../types";

export const goerli_eth_coin_data: NetworkCoinData = {
  [COIN_SLUG.ETH]: {
    is_native: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.ETH],
    token_info: new Token(
      ChainId.GOERLI,
      "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.ETH].code,
      COIN_BAISC_DATA[COIN_SLUG.ETH].name,
    ),
  },
  [COIN_SLUG.WETH]: {
    is_native_wrap: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.WETH],
    token_info: new Token(
      ChainId.GOERLI,
      "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.WETH].code,
      COIN_BAISC_DATA[COIN_SLUG.WETH].name,
    ),
  },
  [COIN_SLUG.DKFT20]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.DKFT20],
    token_info: new Token(
      ChainId.GOERLI,
      "0x2b669B8dF849a250CB3D228C80CcF21D02F4C5dF",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].code,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].name,
    ),
  },
  [COIN_SLUG.BTC]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.BTC],
    token_info: new Token(
      ChainId.GOERLI,
      "0x2B09F2115bcC45Ee32aD44C88344F97dE5f74E95",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.BTC].code,
      COIN_BAISC_DATA[COIN_SLUG.BTC].name,
    ),
  },
  [COIN_SLUG.USDT]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.USDT],
    token_info: new Token(
      ChainId.GOERLI,
      "0xa04D8fe28a8b17Ba33eC0d861aa9Ba78836Cf90C",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.USDT].code,
      COIN_BAISC_DATA[COIN_SLUG.USDT].name,
    ),
  },
  [COIN_SLUG.UNI]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.UNI],
    token_info: new Token(
      ChainId.GOERLI,
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.UNI].code,
      COIN_BAISC_DATA[COIN_SLUG.UNI].name,
    ),
  },
};
