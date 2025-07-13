import { providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { CHAIN_SLUG_MAPPING, NETWORK_DATA } from "./network/network-data";
import { getFromLocalStorage } from "./corefunctions";
import { LOCAL_STORAGE_KEY } from "./coreconstants";

export interface ConnectInfo {
  chainId: string;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export const isNetworkSupported = (chainId: number): boolean => {
  const networkSlug = CHAIN_SLUG_MAPPING[chainId];
  return !!NETWORK_DATA[networkSlug];
};

export const ellipseAddress = (
  address: string = "",
  width: number = 7,
): string => {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === "undefined") return false;
  const { ethereum } = window;
  const is_installed = Boolean(ethereum && ethereum.isMetaMask);
  // if (!is_installed) {
  //   const msg = 'Metamask is not installed';
  //   console.error(msg);
  // }
  return is_installed;
};

export const getProvider = (): providers.Web3Provider | null => {
  if (!isMetaMaskInstalled()) return null;
  return new providers.Web3Provider(window.ethereum);
};

export const sendTransactionViaExtension = async (
  transaction: providers.TransactionRequest,
): Promise<any> => {
  try {
    const provider = getProvider();
    const txHash = await provider?.send("eth_sendTransaction", [transaction]);
    return txHash;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getChainInfo = async (
  provider?: providers.Web3Provider,
): Promise<number> => {
  provider = provider ?? getProvider();
  if (!provider) return -1;
  return (await provider.getNetwork()).chainId;
};

export const onConnect = (
  callback: (connectInfo: ConnectInfo) => void,
): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("connect", callback);
};

export const onDisconnect = (
  callback: (error: ProviderRpcError) => void,
): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("disconnect", callback);
};

export const onMessage = (
  callback: (message: ProviderMessage) => void,
): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("disconnect", callback);
};

export const onAccountsChanged = (
  callback: (accounts: string[]) => void,
): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("accountsChanged", callback);
};

export const onChainChanged = (callback: (chainId: string) => void): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("chainChanged", callback);
};

export const getAddress = async (
  provider?: providers.Web3Provider,
): Promise<string | null> => {
  provider = provider ?? getProvider();
  if (!provider) return null;
  try {
    const accounts = await provider.listAccounts();
    return accounts?.[0] ?? null;
  } catch (e) {
    return null;
  }
};

export const getNetworkInfo = async (): Promise<{
  networkName: string | null;
}> => {
  const provider = getProvider();
  if (!provider) return { networkName: null };

  try {
    const network = await provider.getNetwork();
    const networkName = network.name;
    return { networkName };
  } catch (error) {
    return { networkName: null };
  }
};

export const getBalance = async (
  address: string,
  to_fixed = 5,
): Promise<string | null> => {
  const provider = getProvider();
  if (!address || !provider) return null;
  try {
    const balance = await provider.getBalance(address);
    let nativeBalance = formatEther(balance);
    nativeBalance = Math.abs(
      Number(Number(nativeBalance).toFixed(to_fixed)),
    ).toString();
    return nativeBalance;
  } catch (e) {
    console.error("Error fetching balance:", e);
    return null;
  }
};

export const isDisconnected = (): boolean => {
  return !!Number(getFromLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED));
};

// export const disconnectMetamask = async (): Promise<boolean> => {
//   if (!isMetaMaskInstalled()) return false;
//   try {
//     await window.ethereum.request({
//       method: "wallet_requestPermissions",
//       params: [
//         {
//           eth_accounts: {},
//         },
//       ],
//     });
//     return true;
//   } catch (e) {
//     console.error("Error disconnecting MetaMask:", e);
//     return false;
//   }
// };

// export const connectMetamask = async (): Promise<boolean> => {
//   if (!isMetaMaskInstalled()) return false;
//   try {
//     setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, '0');
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     return true;
//   } catch (e) {
//     console.error(e);
//     return false;
//   }
// };

export const watchTransaction = (
  txHash: string,
  callback: (transaction: any) => void,
): void => {
  const provider = getProvider();
  if (!provider) return;
  provider.once(txHash, (transaction) => {
    callback(transaction);
  });
};
