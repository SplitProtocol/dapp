import {
  Token,
  TokenListItem,
  useFetchTokenListByChainId,
} from "@/entities/Token";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SwapDestinationState } from "../model/types";
import { destinationStateDefault } from "./consts";
import { useImportedTokensStore } from "../model/store";
import { useWeb3 } from "@/shared/lib/useWeb3";
import { isValidEthereumAddress } from "@/shared/lib/utils";
import { Nullable } from "@/shared/types/sharedTypes";
import { useDebounce } from "@/shared/lib/useDebounce";

export const useSwapDestination = (
  setDestination: (destination: SwapDestinationState) => void,
  onBack: () => void,
  destination: "from" | "to",
  destinationPoint: SwapDestinationState,
  desinationOpposite: SwapDestinationState,
  chainId?: Nullable<number>
) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<TokenListItem[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);

  const { getTokenInfo } = useWeb3()

  const { importedTokens, addImportedToken } = useImportedTokensStore();

  const { data: tokenList, isLoading: isLoadingTokens } =
    useFetchTokenListByChainId(selectedNetwork || chainId);

  const memoizedTokenList = useMemo(() => {
    if (tokenList) {
      return [...importedTokens.filter((token) => token.chainId === chainId), ...tokenList]
    }
    return [...importedTokens.filter((token) => token.chainId === chainId)]
  }, [tokenList, chainId, importedTokens]);

  useEffect(() => {
    if (destination === "to" && chainId) {
      setSelectedNetwork(chainId);
    }
  }, [destination, chainId]);

  const debouncedSearch = useDebounce(search, 500);

  const handleSearch = useCallback(async () => {
    if (!chainId) return false;
    if (memoizedTokenList) {
      const results = searchTokens(memoizedTokenList, debouncedSearch);
      if (!results.length && isValidEthereumAddress(debouncedSearch)) {
        const token = await getTokenInfo(debouncedSearch as `0x${string}`, chainId);
        const isTokenExist = importedTokens.some((t) => t.address === token.address && t.chainId === chainId);
        if (isTokenExist) {
          setSearchResults([token]);
          return;
        }
        addImportedToken(token);
        setSearchResults([token]);
        return;
      }
      setSearchResults(results);
    }
  }, [debouncedSearch, memoizedTokenList, importedTokens]);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearch, handleSearch]);

  const handleInputChange = (value: string) => {
    setSearch(value);
  };

  const handleSetNetwork = (value: number) => {
    setDestination({ ...destinationPoint, chainId: value });
  };

  const handleAddToken = useCallback(async(address: `0x${string}`, chainId: number) => {
    const token = await getTokenInfo(address, chainId);
    if (!token) return null;
    addImportedToken(token)
  }, [addImportedToken, getTokenInfo])

  const searchTokens = (tokens: TokenListItem[], searchTerm: string) => {
    searchTerm = searchTerm.toLowerCase();
    return tokens.filter((token) => {
      const name = token.name.toLowerCase();
      const symbol = token.symbol.toLowerCase();
      const address = token.address.toLowerCase();
      return (
        name.includes(searchTerm) ||
        symbol.includes(searchTerm) ||
        address.includes(searchTerm)
      );
    });
  };

  const handleSetDestination = (selectToken: Token) => {
    const { name, address, logoURI, symbol, chainId, decimals, priceUSD } =
      selectToken;
    if (desinationOpposite.address === address) {
      setDestination(destinationStateDefault);
      return onBack();
    }
    const selectedToken: SwapDestinationState = {
      name,
      address,
      logoURI,
      symbol,
      chainId,
      decimals,
      priceUSD,
    };
    if (destination === "to") {
      setDestination({ ...selectedToken, chainId: selectedNetwork });
      return onBack();
    }
    setDestination(selectedToken);
    onBack();
  };

  const memoizedSearchResult = useMemo(() => [...importedTokens, ...searchResults], [importedTokens, searchResults])
  return {
    search,
    tokenList,
    searchResults,
    isLoadingTokens,
    selectedNetwork,
    memoizedSearchResult,
    memoizedTokenList,
    setSelectedNetwork,
    handleSetNetwork,
    handleInputChange,
    handleSetDestination,
    handleAddToken,
  };
};
