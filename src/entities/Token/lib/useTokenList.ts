import { useCallback, useEffect, useState } from "react";
import { tokensList } from "./tokensList";
import { newtworkName } from "@/entities/Network";
import { TokenListItem } from "../model/types";
import { sortPopularToken } from "./sortPopularToken";

export const useTokenList = (chainId?: number | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenListItem[]>([]);

  const getTokensByChainId = useCallback((chainId?: number | null) => {
    setIsLoading(true);
    const tokens =
      tokensList[
        newtworkName[
          chainId as keyof typeof newtworkName
        ] as keyof typeof tokensList
      ] || null;

    if (!tokens) return [];
    const symbolsToMove = ["WETH", "USDT", "USDC", "DAI", "WBTC"];
    const objectArray: TokenListItem[] = Object.values(tokens);

    const result = sortPopularToken(objectArray, symbolsToMove);
    setIsLoading(false);
    return result;
  }, []);

  useEffect(() => {
    if (chainId !== undefined && chainId !== null) {
      const fetchedTokens = getTokensByChainId(chainId);
      setTokens(fetchedTokens);
    }
  }, [chainId, getTokensByChainId]);

  return {
    isLoading,
    tokens,
  };
};
