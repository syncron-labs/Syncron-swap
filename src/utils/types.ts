import { Token } from "@uniswap/sdk-core";

export class ContractData {
  address: string;
  // abi: any;
}

export class Contract {
  v3_factory: ContractData;
  nonfungible_position_manager: ContractData;
  quoter_v3: ContractData;
  quoter_v2: ContractData;
  swap_router: ContractData;
  universal_router: ContractData;
}

export class CoinBasic {
  code: string;
  name: string;
  icon: string;
}

export class NetworkData {
  label: string;
  value: string;
  chain_id: number;
  native_currency_code: string;
  icon: string;
  explorer_info?: NetworkExplorer;
  contract?: Contract;
  coin_or_token?: NetworkCoinData;
}

export class NetworkExplorer {
  base_url: string;
  token_endpoint: string;
  address_endpoint: string;
  tx_endpoint: string;
}

export class CoinData {
  token_info: Token;
  basic: CoinBasic;
  is_native?: boolean;
  is_native_wrap?: boolean;
}

export class NetworkCoinData {
  [coin_slug: string]: CoinData;
}
