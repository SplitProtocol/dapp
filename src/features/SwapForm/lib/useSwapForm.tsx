import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
import { useFetchTokenGetOutAmount } from "../api/swapApi";
import { ethers } from "ethers";

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

  const debounced = useDebounce(payAmount, 1000);

  const [switchButtonClicked, setSwitchButtonClicked] = useState(false);
  const [slippage, setSlippage] = useState(slippageOptions[0].value);
  const result = useReadContract({
    abi: abiERC20,
    address: (destinationFrom.address as `0x${string}`) || "0x",
    functionName: "balanceOf",
    chainId,
  });
  console.log(result?.data);
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

  const memoizedGetOut = useMemo(
    () => {
      if (getAmount && destinationTo.decimals) {
        return ethers.formatUnits(getAmount.out, destinationTo.decimals)
      } else {
        return "0"
      }
    },
    [getAmount, destinationTo.decimals]
  );

  console.log('getAmountgetAmount', getAmount, memoizedGetOut);

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
    handleBackAction,
    setPayAmount,
    setDestinationFrom,
    setDestinationTo,
    handleOpenDestination,
    switchDestinations,
    setSlippage,
  };
};
