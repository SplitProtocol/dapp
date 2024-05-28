/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ethers } from "ethers";
import type {
  SwapBody,
  SwapCrossResponseFromChain,
  SwapResponse,
  SwapState,
  TokenGetOutAmountBody,
  TokenGetOutAmountState,
} from "../model/types";
import { useEffect } from "react";
import { addTransaction } from "@/entities/Transaction";
import { useSendTransaction } from "wagmi";

export const tokenGetOutAmountQueryKey = "tokenGetOutAmount";

export const fetchTokenGetOutAmount = async (
  state: TokenGetOutAmountState
): Promise<Record<string, string> | null> => {
  const { volume, fromDecimals, fromChainID, ...restState } = state;
  const body: TokenGetOutAmountBody = {
    ...restState,
    volume: ethers.parseUnits(volume, fromDecimals).toString(),
  };
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${fromChainID}/getOut`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST" as const,
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();

  return result;
};

export const swapTokens = async (state: SwapState) => {
  const { fromChainID, ...restState } = state;
  const body: SwapBody = {
    ...restState
  }
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${fromChainID}/swap`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST" as const,
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();
  const mergedResult = { ...result, fromChainID };
  return mergedResult;
};

export const swapTokenCross = async (state: SwapState) => {
  const { fromChainID, destChainID, fromToken, toToken, trader, volume } = state;
  const response = await fetch(
    `https://li.quest/v1/quote?fromChain=${fromChainID}&toChain=${destChainID}&fromToken=${fromToken}&toToken=${toToken}&fromAddress=${trader}&toAddress=${trader}&fromAmount=${volume}&order=RECOMMENDED`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "GET" as const,
    }
  );

  const result = await response.json();
  const mergedResult = { ...result, fromChainID };
  return mergedResult;
};

export const useFetchTokenGetOutAmount = (body: TokenGetOutAmountState) => {
  const queryClient = useQueryClient();
  const { volume, fromToken, toToken, destChainID } = body;
  const data = useQuery({
    queryKey: [
      tokenGetOutAmountQueryKey,
      fromToken,
      toToken,
      destChainID,
      volume,
    ],
    queryFn: () => fetchTokenGetOutAmount(body),
    enabled: !!volume,
    retry: true,
  });

  useEffect(() => {
    if (volume) {
      queryClient.invalidateQueries({
        queryKey: [tokenGetOutAmountQueryKey],
        refetchType: "active",
      });
    }
  }, [volume, queryClient]);

  return data;
};

export const useSwapTokensApi = (): UseMutationResult<
  SwapResponse,
  unknown,
  SwapState
> => {
  return useMutation({
    mutationFn: (state) => swapTokens(state),
    onSuccess: (data: SwapResponse) => {
      addTransaction({
        txHash: data.txhash,
        isCompleted: false,
        chainId: data.destChainID,
      });
    },
  });
};

export const useSwapTokensCrossApi = (): UseMutationResult<
  SwapCrossResponseFromChain,
  unknown,
  SwapState
> => {
  const { data: hash, sendTransactionAsync } = useSendTransaction()

  return useMutation({
    // mutationFn: (state) => swapTokenCross(state),
    mutationFn: (state) => swapTokens(state),
    onSuccess: async (data: SwapCrossResponseFromChain) => {
      const { tx, fromChainID } = data
      console.log(data, hash);
      await sendTransactionAsync({ ...tx })
      addTransaction({
        txHash: hash as string,
        isCompleted: false,
        chainId: fromChainID,
      });
    },
  });
};
