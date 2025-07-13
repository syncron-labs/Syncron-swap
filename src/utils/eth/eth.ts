import { providers } from "ethers";
import { formatNumber } from "../corefunctions";
import { CoinData } from "../types";
import { getProvider, getAddress, getBalance } from "../wallet";
import { getERC20Balance } from "./erc20";

export const getCoinBalance = async (
  coin: CoinData,
  wallet_address?: string,
  provider?: providers.Web3Provider,
): Promise<number> => {
  let balance = 0;
  provider = provider ?? getProvider();
  wallet_address = wallet_address ?? (await getAddress(provider));
  if (coin) {
    if (coin.is_native) {
      const local_balance = await getBalance(
        wallet_address,
        coin.token_info.decimals,
      );
      balance = Number(local_balance);
    } else {
      balance = await getERC20Balance(coin.token_info);
    }
    return balance;
  }
};
