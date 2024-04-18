import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { TokenGetOutAmountBody, TokenGetOutAmountState } from "../model/types"
import { useEffect } from "react";

export const tokenGetOutAmountQueryKey = 'tokenGetOutAmount'

export const fetchTokenGetOutAmount = async (
  state: TokenGetOutAmountState,
): Promise<Record<string, string> | null> => {
  const { volume, fromDecimals, destChainID, ...restState } = state;
  const body: TokenGetOutAmountBody = {
    ...restState,
    destChainID,
    volume: ethers.parseUnits(volume, fromDecimals).toString(),
  }
  const response = await fetch(`${import.meta.env.VITE_API_URL}/${destChainID}/getOut`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST" as const,
    body: JSON.stringify(body),
  });

  const result = await response.json();

  return result;
};

export const useFetchTokenGetOutAmount = (body: TokenGetOutAmountState) => {
	const queryClient = useQueryClient();
  const { volume, fromToken, toToken, destChainID } = body
	const data = useQuery({
		queryKey: [tokenGetOutAmountQueryKey, fromToken, toToken, destChainID, volume],
		queryFn: () => fetchTokenGetOutAmount(body),
		enabled: !!volume,
		retry: true,
	});

	useEffect(() => {
		if (volume) {
			queryClient.invalidateQueries({
				queryKey: [tokenGetOutAmountQueryKey],
				refetchType: 'active',
			});
		}
	}, [volume, queryClient]);

	return data;
};
