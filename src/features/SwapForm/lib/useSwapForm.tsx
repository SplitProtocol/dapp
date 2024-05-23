import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SwapDestinationState,
  SwapHeaderCaptions,
  SwapState,
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
import {
  useFetchTokenGetOutAmount,
  useSwapTokensApi,
  useSwapTokensCrossApi,
} from "../api/swapApi";
import { ethers } from "ethers";
import { useWeb3 } from "@/shared/lib/useWeb3";
import {
  notification,
  notificationTitles,
} from "@/shared/helpers/notificationMessages";
import {
  addTransaction,
  usePendingTransactionStore,
} from "@/entities/Transaction";
import { errorHandler } from "@/shared/api/apiClient";

export const useSwapForm = () => {
  const { chainId, connector, address } = useAccount();
  const { transactions } = usePendingTransactionStore();
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
  const [localTx, setLocalTx] = useState<string | null>(null);

  const { approve, signMessage } = useWeb3();

  const {
    mutateAsync,
    isPending: isPendingSwapOnChain,
    isSuccess: isSuccessSwapOnChain,
  } = useSwapTokensApi();

  const {
    mutateAsync: mutateAsyncCross,
    isPending: isPendingCross,
    isSuccess: isSuccessCross,
  } = useSwapTokensCrossApi();

  const { data: allowance } = useReadContract({
    abi: abiERC20,
    address: (destinationFrom.address as `0x${string}`) || "0x",
    functionName: "allowance",
    args: [
      address,
      destinationFrom.chainId === destinationTo.chainId
        ? import.meta.env.VITE_ROUTER_CONTRACT
        : import.meta.env.VITE_LIFI_ROUTER,
    ],
    chainId,
    query: {
      enabled: !!address && !!destinationFrom.address,
    },
  });

  const { data: toDecimals } = useReadContract({
    abi: abiERC20,
    address: (destinationTo.address as `0x${string}`) || "0x",
    functionName: "decimals",
    chainId: destinationTo.chainId as number | undefined,
    query: {
      enabled:
        !!address && !!destinationFrom.address && !!destinationTo.chainId,
    },
  });

  console.log(toDecimals);

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
      fromChainID: destinationFrom.chainId,
      fromDecimals: destinationFrom.decimals,
    }),
    [
      destinationFrom.address,
      destinationFrom.decimals,
      destinationTo.address,
      destinationTo.chainId,
      destinationFrom.chainId,
      debounced,
    ]
  ) as TokenGetOutAmountState;

  const { data: getAmount, isLoading: isLoadingGetAmount } =
    useFetchTokenGetOutAmount(memoizedGetOutAmount);

  const handleBackAction = () => setActiveScreen(SwapHeaderCaptions.HOME);

  const handleOpenDestination = (destination: SwapHeaderCaptions) =>
    setActiveScreen(destination);

  const memoizedGetOut = useMemo(() => {
    if (getAmount && destinationTo.decimals && typeof toDecimals === "number") {
      const amount = ethers.formatUnits(getAmount.out, toDecimals);
      const formattedAmount = parseFloat(amount).toFixed(8);
      return formattedAmount;
    } else {
      return "0";
    }
  }, [getAmount, destinationTo.decimals, toDecimals]);

  const handleSwap = useCallback(async () => {
    try {
      if (
        !destinationFrom.address ||
        !destinationFrom.decimals ||
        !destinationTo.address ||
        !destinationTo.decimals ||
        !address ||
        !destinationTo.chainId ||
        !destinationFrom.chainId
      )
        return;
      const singMessages = await signMessage(
        `Swap ${payAmount} ${destinationFrom.symbol} to ${memoizedGetOut} ${destinationTo.symbol}`,
        setIsPending
      );
      if (!singMessages?.signedHash || !singMessages?.unsignedHash) return;
      const state: SwapState = {
        fromToken: destinationFrom.address,
        toToken: destinationTo.address,
        volume: ethers
          .parseUnits(payAmount, destinationFrom.decimals)
          .toString(),
        trader: address,
        unsignedHash: singMessages?.unsignedHash,
        signedHash: singMessages?.signedHash,
        destChainID: destinationTo.chainId,
        fromChainID: destinationFrom.chainId,
      };
      if (destinationTo.chainId !== destinationFrom.chainId) {
        return await mutateAsyncCross(state);
      }
      await mutateAsync(state);
      console.log(singMessages);
    } catch (error) {
      errorHandler(error);
    }
  }, [
    address,
    destinationFrom,
    destinationTo,
    mutateAsync,
    payAmount,
    memoizedGetOut,
    signMessage,
    mutateAsyncCross,
  ]);

  const handleApprove = useCallback(async () => {
    try {
      if (
        !destinationFrom.decimals ||
        !destinationFrom.address ||
        !destinationFrom.chainId ||
        !destinationTo.chainId
      )
        return;
      const tx = await approve(
        destinationFrom.address as `0x${string}`,
        destinationFrom.chainId === destinationTo.chainId
        ? import.meta.env.VITE_ROUTER_CONTRACT
        : import.meta.env.VITE_LIFI_ROUTER,
        destinationFrom.chainId,
        BigInt(Number(payAmount) * 10 ** destinationFrom.decimals).toString(),
        setIsPending,
        addTransaction
      );
      if (tx) setLocalTx(tx);
    } catch (error) {
      errorHandler(error);
    }
  }, [
    destinationFrom.decimals,
    destinationFrom.address,
    destinationFrom.chainId,
    destinationTo.chainId,
    approve,
    payAmount,
  ]);

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
      const bigAmount = BigInt(
        Number(payAmount) * 10 ** destinationFrom.decimals
      );
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
    if (isSuccessCross || isSuccessSwapOnChain) {
      notification.success(
        notificationTitles.pending,
        `Transaction successfully created`
      );
    }
  }, [isSuccessSwapOnChain, isSuccessCross]);

  useEffect(() => {
    if (transactions.length) {
      transactions.forEach((item) => {
        if (item.txHash === localTx && item.isCompleted) {
          setIsApproveAvailable(true);
        }
      });
    }
  }, [transactions, localTx]);

  const isPendingSwap = isPendingSwapOnChain || isPendingCross;

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
