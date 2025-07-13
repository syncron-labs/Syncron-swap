import { ethers, providers } from "ethers";
import {
  getAddress,
  getProvider,
  sendTransactionViaExtension,
  watchTransaction,
} from "../wallet";
import { ERC20_ABI } from "./abi";
import { Token } from "@uniswap/sdk-core";
import {
  convertCoinAmountToDecimal,
  getNetworkData,
  sleep,
} from "../corefunctions";
import { NetworkData } from "../types";
import { MAX_APPROVE_AMOUNT_INT } from "../coreconstants";

export const getERC20Balance = async (
  token?: Token,
  contract_address?: string,
  wallet_address?: string,
  provider?: providers.Web3Provider,
): Promise<number> => {
  provider = provider ?? getProvider();
  wallet_address = wallet_address ?? (await getAddress(provider));
  if (!provider || !wallet_address) {
    throw new Error("No provider or wallet_address available");
  }

  contract_address = contract_address ?? token.address;
  const tokenContract = new ethers.Contract(
    contract_address,
    ERC20_ABI,
    provider,
  );

  const balance = await tokenContract.balanceOf(wallet_address);
  const decimals = token
    ? token.decimals
    : Number(await tokenContract.decimals());
  const token_balance = convertCoinAmountToDecimal(balance, decimals);
  return Number(token_balance);
};

export async function getTokenTransferApproval(
  token: Token,
  approval_to_address: string,
  min_amount: number | string,
  setInfo?: (msg: string) => void,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<providers.TransactionReceipt | boolean> {
  provider = provider ?? getProvider();
  const address = await getAddress(provider);
  if (!provider || !address) {
    throw new Error("No provider or addess available");
  }

  const signer = provider.getSigner();
  network_data = network_data ?? (await getNetworkData(provider));

  try {
    const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);

    let approvedAmount = await tokenContract.allowance(
      address,
      approval_to_address,
    );

    if (approvedAmount) {
      approvedAmount = convertCoinAmountToDecimal(
        approvedAmount,
        token.decimals,
      );

      if (Number(approvedAmount) >= Number(min_amount)) {
        return true;
      }
    }

    setInfo && setInfo("Approval needed!! Confirm the transaction.");

    const transaction: providers.TransactionResponse =
      await tokenContract.approve(approval_to_address, MAX_APPROVE_AMOUNT_INT);

    setInfo && setInfo("Wait for Approval process completion...");

    const txReceipt = await transaction.wait();

    return txReceipt;
  } catch (e) {
    console.error(e);
    return false;
  }
}
