import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ethers } from "ethers";
import type {
  SwapBody,
  SwapResponse,
  SwapState,
  TokenGetOutAmountBody,
  TokenGetOutAmountState,
} from "../model/types";
import { useEffect } from "react";
import { addTransaction } from "@/entities/Transaction";

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
      console.log(data);
      addTransaction({
        txHash: data.txhash,
        isCompleted: false,
        chainId: data.destChainID,
      });
    },
  });
};
