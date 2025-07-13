import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setToInitialWallet,
  setWallet,
  walletSliceType,
} from "@/store/slice/wallet.slice";
import { useToast } from "../components/ui/use-toast";
import { setToLocalStorage } from "../utils/corefunctions";
import { LOCAL_STORAGE_KEY } from "../utils/coreconstants";
import {
  isDisconnected,
  getChainInfo,
  isNetworkSupported,
  getBalance,
  onAccountsChanged,
  onDisconnect,
  onMessage,
  onChainChanged,
  isMetaMaskInstalled,
  getAddress,
  ConnectInfo,
  ProviderMessage,
  ProviderRpcError,
  onConnect,
} from "../utils/wallet";

interface WalletHookReturnType {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  switchToNetwork: (chain_id: number) => Promise<boolean>;
  balance: string | null;
}

export const useWallet = (): WalletHookReturnType => {
  const [balance, setBalance] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { toast } = useToast();

  /* use effects */
  useEffect(() => {
    onConnect(handleConnect);
    onDisconnect(handleDisconnect);
    onMessage(handleMessage);
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);
    loadWalletData();

    // Clean up subscriptions when component unmounts
    return () => {
      // window.ethereum.off("accountsChanged", handleAccountsChanged);
      // window.ethereum.off("chainChanged", handleChainChanged);
    };
  }, []);
  /*  */

  /* core functions  */
  const loadWalletData = async () => {
    try {
      let address = "";
      let chain = null;

      if (!isDisconnected()) {
        address = await getAddress();
        // const { networkName } = await getNetworkInfo();
        chain = await getChainInfo();

        if (!isNetworkSupported(chain)) {
          disconnect();
          console.log("Network not supported");
          toast({
            title: `Network not supported`,
            description: "Please switch to a supported network.",
          });
          return;
        }

        const walletBalance = await getBalance(address);
        setBalance(walletBalance);
      }

      if (isDisconnected()) {
        dispatch(setToInitialWallet());
      } else {
        dispatch(
          setWallet<walletSliceType>({
            chain_id: chain,
            wallet_address: address?.toLowerCase() ?? "",
          }),
        );
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
  };

  const connect = async (
    wallet: "metamask" | "coinbase" = "metamask",
  ): Promise<boolean> => {
    try {
      if (wallet == "metamask" && !isMetaMaskInstalled()) {
        toast({
          title: `Metamask not installed`,
          description: "Please install metamask wallet browser extension.",
        });
        throw new Error("Metamask not installed");
      }

      setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, "0");
      window.ethereum.request({ method: "eth_requestAccounts" });
      loadWalletData();

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const disconnect = async (): Promise<boolean> => {
    try {
      setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, "1");
      loadWalletData();
      return true;
    } catch (e) {
      console.error("Error disconnecting Wallet:", e);
      return false;
    }
  };

  const switchToNetwork = async (chain_id: number): Promise<boolean> => {
    if (!isMetaMaskInstalled()) return false;
    try {
      setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, "0");
      chain_id &&
        (await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${chain_id.toString(16)}`,
            },
          ],
        }));
      loadWalletData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  /*  */

  /* handlers */
  const handleConnect = async (connectInfo: ConnectInfo) => {
    console.log("onConnect: ", connectInfo);
  };

  const handleDisconnect = async (error: ProviderRpcError) => {
    console.log("onDisconnect: ", error);
    disconnect();
  };

  const handleMessage = async (message: ProviderMessage) => {
    console.log("onMessage: ", message);
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    // console.log("Wallet address changed: ", accounts);
    if (!accounts[0]) {
      disconnect();
      return;
    }
    loadWalletData();
  };

  const handleChainChanged = async (chainId: string) => {
    if (!chainId) return;
    console.log("Wallet chain changed: ", chainId);
    // window.ethereum.off("accountsChanged", handleAccountsChanged);

    if (!isDisconnected() && !isNetworkSupported(Number(chainId))) {
      console.log("Network not supported");
      disconnect();
      toast({
        title: `Network not supported`,
        description: "Please switch to a supported network.",
      });
      return;
    }
    await loadWalletData();
    onAccountsChanged(handleAccountsChanged);
  };
  /*  */

  return {
    connect,
    disconnect,
    switchToNetwork,
    balance,
  };
};
