import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SwapBody,
  SwapDestinationState,
  SwapHeaderCaptions,
  TokenGetOutAmountState,
} from "../model/types";
import { destinationStateDefault, slippageOptions } from "./consts";
import { useAccount, useReadContract, useSwitchChain } from "wagmi";
import {
  useFetchTokenPriceByAddresses,
  useTokenChartStore,
  abiERC20,
} from "@/entities/Token";
import { useDebounce } from "@/shared/lib/useDebounce";
import { useFetchTokenGetOutAmount, useSwapTokensApi } from "../api/swapApi";
import { ethers } from "ethers";
import { useWeb3 } from "@/shared/lib/useWeb3";
import { notification, notificationTitles } from "@/shared/helpers/notificationMessages";

export const useSwapForm = () => {
  const { chainId, connector, address } = useAccount();
  const { setSymbols, dropChart } = useTokenChartStore();
  const { isSuccess: isSuccessSwitchChain, switchChain } = useSwitchChain();
  const [activeScreen, setActiveScreen] = useState<SwapHeaderCaptions>(
    SwapHeaderCaptions.HOME
  );

  const [destinationFrom, setDestinationFrom] = useState<SwapDestinationState>(
    () => destinationStateDefault
  );
  const [destinationTo, setDestinationTo] = useState<SwapDestinationState>(
    () => destinationStateDefault
  );
  const [payAmount, setPayAmount] = useState("");
  const [isApproveAvailable, setIsApproveAvailable] = useState(false);

  const debounced = useDebounce(payAmount, 1000);

  const [switchButtonClicked, setSwitchButtonClicked] = useState(false);
  const [slippage, setSlippage] = useState(slippageOptions[0].value);
  const [isPending, setIsPending] = useState(false);

  const { approve, signMessage } = useWeb3();

  const { mutateAsync, isPending: isPendingSwap, isSuccess: isSuccessSwap } = useSwapTokensApi();

  const { data: allowance } = useReadContract({
    abi: abiERC20,
    address: (destinationFrom.address as `0x${string}`) || "0x",
    functionName: "allowance",
    args: [address, import.meta.env.VITE_ROUTER_CONTRACT],
    chainId,
    query: {
      enabled: !!address && !!destinationFrom.address,
    },
  });

  const { data: pricesTokenFrom, isLoading: isLoadingPriceFrom } =
    useFetchTokenPriceByAddresses(
      {
        tokens: [destinationFrom.address],
        currency: "USD",
      },
      chainId
    );

  const { data: pricesTokenTo, isLoading: isLoadingPriceTo } =
    useFetchTokenPriceByAddresses(
      {
        tokens: [destinationTo.address],
        currency: "USD",
      },
      destinationTo.chainId
    );

  const memoizedGetOutAmount = useMemo(
    () => ({
      fromToken: destinationFrom.address,
      toToken: destinationTo.address,
      volume: debounced,
      destChainID: destinationTo.chainId,
      fromDecimals: destinationFrom.decimals,
    }),
    [
      destinationFrom.address,
      destinationFrom.decimals,
      destinationTo.address,
      destinationTo.chainId,
      debounced,
    ]
  ) as TokenGetOutAmountState;

  const { data: getAmount, isLoading: isLoadingGetAmount } =
    useFetchTokenGetOutAmount(memoizedGetOutAmount);

  const handleBackAction = () => setActiveScreen(SwapHeaderCaptions.HOME);

  const handleOpenDestination = (destination: SwapHeaderCaptions) =>
    setActiveScreen(destination);

  const memoizedGetOut = useMemo(() => {
    if (getAmount && destinationTo.decimals) {
      return ethers.formatEther(getAmount.out);
    } else {
      return "0";
    }
  }, [getAmount, destinationTo.decimals]);

  const handleSwap = useCallback(async () => {
    try {
      if (!destinationFrom.address || !destinationFrom.decimals || !destinationTo.address || !destinationTo.decimals || !address || !destinationTo.chainId) return;
      const singMessages = await signMessage(`Swap ${payAmount} ${destinationFrom.symbol} to ${memoizedGetOut} ${destinationTo.symbol}`, setIsPending);
      if (!singMessages?.signedHash || !singMessages?.unsignedHash) return;
      const body: SwapBody = {
        fromToken: destinationFrom.address,
        toToken: destinationTo.address,
        volume: ethers.parseUnits(payAmount, destinationFrom.decimals).toString(),
        trader: address,
        unsignedHash: singMessages?.unsignedHash,
        signedHash: singMessages?.signedHash,
        destChainID: destinationTo.chainId,
      }
      await mutateAsync(body);
      console.log(singMessages)
    } catch (error) {
      console.log(error)
    }
  }, [address, destinationFrom, destinationTo, mutateAsync, payAmount, memoizedGetOut, signMessage])

  const handleApprove = useCallback(async () => {
    if (!destinationFrom.decimals || !destinationFrom.address) return;
    await approve(
      destinationFrom.address as `0x${string}`,
      import.meta.env.VITE_ROUTER_CONTRACT,
      BigInt(Number(payAmount) * 10 ** destinationFrom.decimals).toString()
    );
  }, [approve, destinationFrom.address, destinationFrom.decimals, payAmount]);

  const switchDestinations = useCallback(async () => {
    if (destinationFrom.chainId === destinationTo.chainId) {
      setDestinationTo(destinationFrom);
      setDestinationFrom(destinationTo);
      return;
    }
    if (destinationTo.chainId) {
      switchChain({ connector, chainId: destinationTo.chainId });
      setSwitchButtonClicked(true);
    }
  }, [connector, destinationTo, destinationFrom, switchChain]);

  useEffect(() => {
    if (!Number.isNaN(payAmount) && destinationFrom.decimals) {
      const bigAmount = BigInt(Number(payAmount) * 10 ** destinationFrom.decimals);
      if (typeof allowance !== "bigint") return setIsApproveAvailable(false);
      if (typeof allowance === "bigint") {
        if (allowance >= bigAmount) {
          return setIsApproveAvailable(true);
        } else {
          return setIsApproveAvailable(false);
        }
      }
    }
  }, [allowance, payAmount, destinationFrom]);

  useEffect(() => {
    if (switchButtonClicked && isSuccessSwitchChain) {
      setDestinationTo(destinationFrom);
      setDestinationFrom(destinationTo);
      setSwitchButtonClicked(false);
    }
  }, [
    switchButtonClicked,
    isSuccessSwitchChain,
    destinationFrom,
    destinationTo,
  ]);

  useEffect(() => {
    if (!address) {
      setDestinationFrom(destinationStateDefault);
      setDestinationTo(destinationStateDefault);
    }
  }, [address]);

  useEffect(() => {
    if (destinationFrom.address && destinationTo.address) {
      setSymbols(`${destinationFrom.address}/${destinationTo.address}`);
    } else {
      setSymbols(null);
      dropChart();
    }
  }, [destinationFrom, destinationTo, setSymbols]);

  useEffect(() => {
    if (isSuccessSwap) {
      notification.success(notificationTitles.pending, `Transaction successfully created`)
    }
  }, [isSuccessSwap])

  

  return {
    activeScreen,
    destinationFrom,
    destinationTo,
    chainId,
    pricesTokenFrom,
    pricesTokenTo,
    isLoadingPriceFrom,
    isLoadingPriceTo,
    payAmount,
    slippage,
    memoizedGetOut,
    isLoadingGetAmount,
    allowance,
    isApproveAvailable,
    isPending,
    isPendingSwap,
    handleSwap,
    handleBackAction,
    handleApprove,
    setPayAmount,
    setDestinationFrom,
    setDestinationTo,
    handleOpenDestination,
    switchDestinations,
    setSlippage,
  };
};
