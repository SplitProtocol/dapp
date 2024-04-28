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
  TokenGetOutAmountBody,
  TokenGetOutAmountState,
} from "../model/types";
import { useEffect } from "react";
import { addTransaction } from "@/entities/Transaction";

export const tokenGetOutAmountQueryKey = "tokenGetOutAmount";

export const fetchTokenGetOutAmount = async (
  state: TokenGetOutAmountState
): Promise<Record<string, string> | null> => {
  const { volume, fromDecimals, destChainID, ...restState } = state;
  const body: TokenGetOutAmountBody = {
    ...restState,
    destChainID,
    volume: ethers.parseUnits(volume, fromDecimals).toString(),
  };
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${destChainID}/getOut`,
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

type SwapMergedResponse = {
  result: SwapResponse;
  destChainID: number;
};

export const swapTokens = async (body: SwapBody) => {
  const { destChainID } = body;
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${destChainID}/swap`,
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
  const mergedResult = { ...result, destChainID };
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
  SwapMergedResponse,
  unknown,
  SwapBody
> => {
  return useMutation({
    mutationFn: (state) => swapTokens(state),
    onSuccess: (data: SwapMergedResponse) => {
      console.log(data);
      addTransaction({
        txHash: data.result.txhash,
        isCompleted: false,
        chainId: data.destChainID,
      });
    },
  });
};
