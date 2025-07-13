import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PositionInfo,
  collectFees,
  getPositionInfo,
} from "../utils/uniswap/liquidity";
import { useToast } from "../components/ui/use-toast";
import { IRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { Token } from "@uniswap/sdk-core";
import { CoinData } from "../utils/types";
import { getProvider } from "../utils/wallet";
import { getNetworkCoins, getNetworkData } from "../utils/corefunctions";
import { getCoinData } from "../utils/network/coin-data";

const usePoolDetails = () => {
  const { toast } = useToast();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);
  const dispatch = useDispatch();

  const [selectedCoin, setSelectedCoin] = useState<string>();
  const { tokenId } = useParams<{ tokenId: string }>();
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  // console.log(tokenId, "params");

  const [positionDetails, setPositionDetails] = useState<PositionInfo>(null);
  const [openClaim, setOpenClaim] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [firstCoin, setFirstCoin] = useState<CoinData>();
  const [secondCoin, setSecondCoin] = useState<CoinData>();

  const [assistMessage, setAssistMessage] = useState<string>("");
  const [loadingModal, setLoadingModal] = useState(false);

  /* core functions */
  const getPositionDetails = async (
    tokenId: string,
    load = true,
  ): Promise<PositionInfo> => {
    try {
      load && setLoading(true);
      const position = await getPositionInfo(
        tokenId,
        provider,
        null,
        true,
        true,
      );
      // console.log("position: ", position);

      setPositionDetails(position);
      setFromCoin(await getCoinData(position.token0, provider));
      setToCoin(await getCoinData(position.token1, provider));
      setFirstCoin(await getCoinData(position.token0, provider));
      setSecondCoin(await getCoinData(position.token1, provider));
      setSelectedCoin(position.token1.symbol);

      load && setLoading(false);
      return positionDetails;
    } catch (error) {
      setLoading(false);
      router.push("/pool");
      toast({
        title: "Error",
        description: "Something Went Wrong!! Try Again.",
      });
      console.error(error);
      return null;
    }
  };

  const clearData = (action: "clear_all" = "clear_all") => {};
  /*  */

  /* useEffects */

  useEffect(() => {
    setProvider(getProvider());
    tokenId && chain_id && getPositionDetails(tokenId);
  }, [tokenId, chain_id]);

  useEffect(() => {
    // chain_id && router.push("/pool");
  }, [chain_id]);

  useEffect(() => {
    tokenId &&
      chain_id &&
      getPositionDetails(tokenId, positionDetails ? false : true);
  }, [block_number]);
  /*  */

  /* handlers */
  const handleClearAll = () => {
    try {
      clearData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleConnectWallet = () => {
    try {
      dispatch(setWallet<walletSliceType>({ open_wallet_sidebar: true }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSwitchCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  const handleClaimFees = async () => {
    try {
      setOpenClaim(false);
      setLoadingModal(true);
      setAssistMessage("Wait for transaction completion ...");

      await collectFees(tokenId, fromCoin, toCoin);

      // console.log({
      //   tokenId,
      //   fromCoin,
      //   toCoin,
      // });

      toast({
        title: "Success",
        description: `Congratulations!! Fees Collected.`,
      });
      setLoadingModal(false);
    } catch (error) {
      // console.error(error.message);
      setLoadingModal(false);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  return {
    fromCoin,
    toCoin,
    positionDetails,
    loading,
    firstCoin,
    secondCoin,
    selectedCoin,
    tokenId,
    openClaim,
    assistMessage,
    loadingModal,
    setOpenClaim,
    setSelectedCoin,
    setLoadingModal,
    handleSwitchCoins,
    handleClaimFees,
  };
};
export default usePoolDetails;
