import { ethers, providers } from "ethers";
import { getProvider } from "../wallet";
import { NetworkData } from "../types";
import { convertCoinAmountToInt, getNetworkData } from "../corefunctions";
import { COIN_SLUG, EVM_NATIVE_DECIMAL } from "../network/coin-data";
import { WETH_ABI } from "./abi";

export async function wrapETH(
  eth_amount: number | string,
  provider?: providers.Web3Provider,
  network_data?: NetworkData,
): Promise<providers.TransactionReceipt> {
  provider = provider ?? getProvider();
  network_data = network_data ?? (await getNetworkData(provider));
  const signer = provider.getSigner();
  const wethContract = new ethers.Contract(
    network_data.coin_or_token[COIN_SLUG.WETH].token_info.address,
    WETH_ABI,
    signer,
  );

  const tx: providers.TransactionResponse = await wethContract.deposit({
    value: ethers.utils.parseEther(String(eth_amount)),
  });

  const txReceipt = await tx.wait();
  return txReceipt;
}

export async function unwrapWETH(
  weth_amount?: number | string,
  raw_weth_amount?: string,
  provider?: providers.Web3Provider,
  network_data?: NetworkData,
): Promise<providers.TransactionReceipt> {
  provider = provider ?? getProvider();
  network_data = network_data ?? (await getNetworkData(provider));
  const signer = provider.getSigner();
  const wethContract = new ethers.Contract(
    network_data.coin_or_token[COIN_SLUG.WETH].token_info.address,
    WETH_ABI,
    signer,
  );

  let wad = "";
  if (weth_amount) {
    wad = String(convertCoinAmountToInt(weth_amount, EVM_NATIVE_DECIMAL));
  } else if (raw_weth_amount) {
    wad = raw_weth_amount;
  } else {
    throw new Error("weth_amount or raw_weth_amount must needed");
  }
  const tx: providers.TransactionResponse = await wethContract.withdraw(wad);

  const txReceipt = await tx.wait();
  return txReceipt;
}
