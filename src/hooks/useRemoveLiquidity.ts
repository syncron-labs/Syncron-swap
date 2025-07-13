import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PositionInfo,
  getPositionInfo,
  removeLiquidity,
} from "../utils/uniswap/liquidity";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { useToast } from "../components/ui/use-toast";
import { getCoinData } from "../utils/network/coin-data";
import { CoinData } from "../utils/types";
import { getProvider } from "../utils/wallet";
import { beautifyNumber, noExponents } from "../utils/corefunctions";

const useRemoveLiquidity = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { tokenId } = useParams<{ tokenId: string }>();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const [positionDetails, setPositionDetails] = useState<PositionInfo>(null);
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [fromAmount, setFromAmount] = useState("0");
  const [toAmount, setToAmount] = useState("0");
  const [percent, setPercent] = useState(0);
  const [liquidity, setLiquidity] = useState("0");

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [assistMessage, setAssistMessage] = useState<string>("");
  const [formReady, setFormReady] = useState<boolean>(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

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

  useEffect(() => {
    if (
      walletAddress &&
      positionDetails &&
      walletAddress.toLowerCase() != positionDetails.owner?.toLowerCase()
    ) {
      toast({ title: "Error", description: "Not Authorized!!" });
      router.push(`/pool/${tokenId}`);
    }
  }, [walletAddress]);

  // all dependencis
  useEffect(() => {
    // console.log({
    //   fromCoin,
    //   toCoin,
    //   percent,
    //   liquidity,
    //   fromAmount,
    //   toAmount,
    // });

    if (fromCoin && toCoin && percent && Number(liquidity)) {
      setFormReady(true);
    } else {
      setFormReady(false);
    }
  }, [positionDetails, fromCoin, toCoin, percent]);
  /*  */

  /* core functions */
  const getPositionDetails = async (
    tokenId: string,
    load = true,
  ): Promise<PositionInfo> => {
    try {
      load && setLoading(true);
      const position = await getPositionInfo(tokenId, provider, null, true);
      // console.log("position: ", position);
      if (walletAddress.toLowerCase() != position.owner.toLowerCase()) {
        throw new Error("Not Authorized!!");
      }

      setPositionDetails(position);
      setFromCoin(await getCoinData(position.token0, provider));
      setToCoin(await getCoinData(position.token1, provider));

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
  /*  */

  /* handlers */
  const handlePercentChange = (percent: number | string) => {
    try {
      percent = Number(percent);
      setPercent(percent);

      const liquidity = noExponents(
        Math.round((Number(positionDetails.liquidity) * percent) / 100),
      );
      setLiquidity(liquidity);

      const fromAmount = beautifyNumber(
        (positionDetails.other_details.token0Amount * percent) / 100,
        3,
      );
      setFromAmount(fromAmount);

      const toAmount = beautifyNumber(
        (positionDetails.other_details.token1Amount * percent) / 100,
        3,
      );
      setToAmount(toAmount);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleRemoveLiquidity = async () => {
    try {
      setPreview(false);
      setLoadingModal(true);
      setAssistMessage("Wait for transaction completion ...");

      const liq = percent == 100 ? positionDetails.liquidity : liquidity;

      // console.log({
      //   tokenId,
      //   fromCoin,
      //   toCoin,
      //   positionDetails,
      //   liq,
      //   fromAmount,
      //   toAmount,
      // });

      await removeLiquidity(
        tokenId,
        fromCoin,
        toCoin,
        liq,
        Number(fromAmount),
        Number(toAmount),
      );

      toast({
        title: "Success",
        description: `Liquidity ${percent == 100 ? "Removed" : "Decreased"} Successfully.`,
      });
      router.push(`/pool/${tokenId}`);
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
    positionDetails,
    fromCoin,
    toCoin,
    fromAmount,
    toAmount,
    percent,
    liquidity,
    provider,
    assistMessage,
    formReady,
    preview,
    loading,
    loadingModal,
    setPreview,
    setLoadingModal,
    handlePercentChange,
    handleRemoveLiquidity,
  };
};

export default useRemoveLiquidity;
