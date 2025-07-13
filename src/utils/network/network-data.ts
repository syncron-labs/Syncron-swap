import { ChainId } from "@uniswap/sdk-core";
import { NetworkCoinData, NetworkData } from "../types";
import { COIN_SLUG } from "./coin-data";
import { CommonContractData, CommonExplorerData } from "./common-data";
import { loadContractObject } from "../corefunctions";
import { eth_coin_data } from "./coins/ethereum";
import { goerli_eth_coin_data } from "./coins/goerli-eth";
import { sepolia_eth_coin_data } from "./coins/sepolia-eth";

export enum NETWORK_SLUG {
  ETHEREUM = "ethereum",
  GOERLI_ETH = "goerli-eth",
  SPOLIA_ETH = "spolia-eth",
  POLYGON = "polygon",
  MUMBAI_POLY_TEST = "mumbai_polygon_testnet",
  BINANCE_SMART_CHAIN = "binane-smart-chain",
  BINANCE_TESTNET = "binance-testnet",
}

export enum OtherChainId {
  BINANCE_TESTNET = 97,
}

export const CHAIN_SLUG_MAPPING: { [chian_id: number]: string } = {
  [ChainId.MAINNET]: NETWORK_SLUG.ETHEREUM,
  [ChainId.GOERLI]: NETWORK_SLUG.GOERLI_ETH,
  [ChainId.SEPOLIA]: NETWORK_SLUG.SPOLIA_ETH,
  [ChainId.POLYGON]: NETWORK_SLUG.POLYGON,
  [ChainId.POLYGON_MUMBAI]: NETWORK_SLUG.MUMBAI_POLY_TEST,
  [ChainId.BNB]: NETWORK_SLUG.BINANCE_SMART_CHAIN,
  [OtherChainId.BINANCE_TESTNET]: NETWORK_SLUG.BINANCE_TESTNET,
};

export const NETWORK_COIN_DATA: { [net_slug: string]: NetworkCoinData } = {
  [NETWORK_SLUG.ETHEREUM]: eth_coin_data,
  [NETWORK_SLUG.GOERLI_ETH]: goerli_eth_coin_data,
  [NETWORK_SLUG.SPOLIA_ETH]: sepolia_eth_coin_data,
};

export const NETWORK_DATA: { [slug: string]: NetworkData } = {
  [NETWORK_SLUG.ETHEREUM]: {
    value: NETWORK_SLUG.ETHEREUM,
    chain_id: ChainId.MAINNET,
    native_currency_code: COIN_SLUG.ETH,
    icon: "/networks/ethereum.png",
    label: "Ethereum",
    contract: CommonContractData,
    coin_or_token: NETWORK_COIN_DATA[NETWORK_SLUG.ETHEREUM],
    explorer_info: {
      ...CommonExplorerData,
      base_url: "https://etherscan.io",
    },
  },
  // [NETWORK_SLUG.GOERLI_ETH]: {
  //   value: NETWORK_SLUG.GOERLI_ETH,
  //   chain_id: ChainId.GOERLI,
  //   native_currency_code: COIN_SLUG.ETH,
  //   icon: "/networks/ethereum.png",
  //   label: "Goerli",
  //   contract: CommonContractData,
  //   coin_or_token: NETWORK_COIN_DATA[NETWORK_SLUG.GOERLI_ETH],
  //   explorer_info: {
  //     ...CommonExplorerData,
  //     base_url: "https://goerli.etherscan.io",
  //   },
  // },
  [NETWORK_SLUG.SPOLIA_ETH]: {
    value: NETWORK_SLUG.SPOLIA_ETH,
    chain_id: ChainId.SEPOLIA,
    native_currency_code: COIN_SLUG.ETH,
    icon: "/networks/ethereum.png",
    label: "Sepolia",
    contract: loadContractObject(
      "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
      "0x013C34d683BA9e5712118Ba290190d9ff508bAef",
      "0x5502365e486Ed7F5a62E80e8035aE1635dEd4Fa6",
      "0x2b669B8dF849a250CB3D228C80CcF21D02F4C5dF",
      "0x1238536071E1c677A632429e3655c799b22cDA52",
      "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    ),
    coin_or_token: NETWORK_COIN_DATA[NETWORK_SLUG.SPOLIA_ETH],
    explorer_info: {
      ...CommonExplorerData,
      base_url: "https://sepolia.etherscan.io",
    },
  },
};

// console.log('Goerli data: ', NETWORK_DATA[NETWORK_SLUG.GOERLI_ETH]);
// console.log('Goerli Dkft20 using NETWORK_DATA: ', NETWORK_DATA[NETWORK_SLUG.GOERLI_ETH].coin_or_token[COIN_SLUG.DKFT20]);
// console.log('Goerli Dkft20 NETWORK_COIN_DATA: ', NETWORK_COIN_DATA[NETWORK_SLUG.GOERLI_ETH][COIN_SLUG.DKFT20].token_info['address']);
// console.log(
//   "Goerli ETH NETWORK_COIN_DATA: ",
//   NETWORK_COIN_DATA[NETWORK_SLUG.GOERLI_ETH][COIN_SLUG.ETH],
// );

// export const Networks = [
//   {
//     value: "bsc",
//     label: "BSC",
//     icon: "/networks/bsc.png",
//   },
//   {
//     value: "solana",
//     label: "Solana",
//     icon: "/networks/solana.png",
//   },
//   {
//     value: "polygon",
//     label: "Polygon",
//     icon: "/networks/polygon.png",
//   },
//   {
//     value: "ethereum",
//     label: "Ethereum",
//     icon: "/networks/ethereum.png",
//   },
//   {
//     value: "arbitrum",
//     label: "Arbitrum",
//     icon: "/networks/arbitrum.png",
//   },
//   {
//     value: "fantom",
//     label: "Fantom",
//     icon: "/networks/fantom.png",
//   },
// ];
