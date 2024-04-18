import { Token, TokenListItem, useFetchTokenListByChainId } from "@/entities/Token";
import { useCallback, useEffect, useState } from "react";
import { SwapDestinationState } from "../model/types";
import { destinationStateDefault } from "./consts";

export const useSwapDestination = (
  setDestination: (destination: SwapDestinationState) => void,
  onBack: () => void,
  destination: "from" | "to",
  destinationPoint: SwapDestinationState,
  desinationOpposite: SwapDestinationState,
  chainId?: number | null,
) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<TokenListItem[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null)

  const { data: tokenList, isLoading: isLoadingTokens } = useFetchTokenListByChainId(selectedNetwork || chainId);

  useEffect(() => {
    if (destination === 'to' && chainId) {
      setSelectedNetwork(chainId)
    }
  }, [destination, chainId])

  const handleInputChange = useCallback(
    (value: string) => {
      setSearch(value);
      if (tokenList) {
        const results = searchTokens(tokenList, value);
        setSearchResults(results);
      }
    },
    [tokenList]
  );

  const handleSetNetwork = (value: number) => {
    setDestination({...destinationPoint, chainId: value})
  }

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
    const { name, address, logoURI, symbol, chainId, decimals } = selectToken;
    if (desinationOpposite.address === address) {
      setDestination(destinationStateDefault)
      return onBack();
    }
    const selectedToken: SwapDestinationState = {
      name,
      address,
      logoURI,
      symbol,
      chainId,
      decimals,
    };
    if (destination === "to") {
      setDestination({...selectedToken, chainId: selectedNetwork})
      return onBack();
    }
    setDestination(selectedToken);
    onBack();
  };
  return {
    search,
    tokenList,
    searchResults,
    isLoadingTokens,
    selectedNetwork,
    setSelectedNetwork,
    handleSetNetwork,
    handleInputChange,
    handleSetDestination,
  };
};
