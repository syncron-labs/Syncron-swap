import {
  Currency,
  NativeCurrencyName,
  NativeCurrency,
  Token,
} from "@uniswap/sdk-core";
import { CoinBasic, CoinData, NetworkData } from "../types";
import { getNetworkData } from "../corefunctions";
import { providers } from "ethers";
import { getProvider } from "../wallet";

export declare abstract class NativeCoin extends NativeCurrency {}

export const EVM_NATIVE_DECIMAL = 18;

export enum COIN_SLUG {
  //native
  ETH = NativeCurrencyName.ETHER,
  MATIC = NativeCurrencyName.MATIC,
  BNB = NativeCurrencyName.BNB,

  //token
  WETH = "WETH",
  WBTC = "WBTC",
  BTC = "BTC",
  UNI = "UNI",
  DKFT20 = "DKFT20",
  USDC = "USDC",
  USDT = "USDT",
}

export const COIN_BAISC_DATA: { [slug: string]: CoinBasic } = {
  //native
  [COIN_SLUG.ETH]: {
    code: NativeCurrencyName.ETHER,
    name: "Ether",
    icon: "/coins/eth.svg",
  },
  [COIN_SLUG.MATIC]: {
    code: NativeCurrencyName.MATIC,
    name: "Matic",
    icon: "/coins/matic.png",
  },
  [COIN_SLUG.BNB]: {
    code: NativeCurrencyName.BNB,
    name: "BNB Coin",
    icon: "/coins/bnb.png",
  },

  //token
  [COIN_SLUG.WETH]: {
    code: "WETH",
    name: "Wrapped Ether",
    icon: "/coins/weth.svg",
  },
  [COIN_SLUG.WBTC]: {
    code: "WBTC",
    name: "Wrapped BTC",
    icon: "/coins/wbtc.png",
  },
  [COIN_SLUG.BTC]: {
    code: "BTC",
    name: "Bitcoin",
    icon: "/coins/btc.png",
  },
  [COIN_SLUG.UNI]: {
    code: "UNI",
    name: "Uniswap",
    icon: "/coins/uni.png",
  },
  [COIN_SLUG.DKFT20]: {
    code: "DKFT20",
    name: "DK Free Token",
    icon: "/coins/dkft20.png",
  },
  [COIN_SLUG.USDC]: { code: "USDC", name: "USD//C", icon: "/coins/usdc.png" },
  [COIN_SLUG.USDT]: {
    code: "USDT",
    name: "Tether USD",
    icon: "/coins/usdt.png",
  },
};

export async function getCoinData(
  token: Token,
  provider?: providers.Web3Provider,
  network_data?: NetworkData,
): Promise<CoinData> {
  provider = provider ?? getProvider();
  network_data = network_data ?? (await getNetworkData(provider));
  return network_data.coin_or_token[token.symbol];
}
