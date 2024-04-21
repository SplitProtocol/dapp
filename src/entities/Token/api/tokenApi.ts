import { useQuery } from "@tanstack/react-query";
import { newtworkName } from "@/entities/Network";
import { headers } from "@/shared/api/apiClient";
import { sortPopularToken } from "../lib/sortPopularToken";
import { TokenListItem } from "../model/types";

export const tokenListByChainIdQueryKey = "tokenListByChainId";
export const tokenPricesQueryKey = "tokenPrices";
export const tokenChartPairAddressQueryKey = "tokenChartPairAddress";

export const fetchTokenListByChainId = async (
  chainId?: number | null
): Promise<TokenListItem[]> => {
  const response = await fetch(
    `${import.meta.env.DEV ? '/splitexapi' : import.meta.env.VITE_API_URL}/${chainId}/getTokenList`,
    {
      method: "GET" as const,
    }
  );
  const result = await response.json();
  const symbolsToMove = ["WETH", "USDT", "USDC", "DAI", "WBTC"];
  const objectArray: TokenListItem[] = Object.values(result);
  const tokens = sortPopularToken(objectArray, symbolsToMove);
  return tokens;
};

export const fetchTokenPriceByAddresses = async (
  body: { tokens: (string | null)[]; currency: string },
  chainId?: number | null
): Promise<Record<string, string> | null> => {
  if (!body.tokens[0]) return null;
  const response = await fetch(`/1inchapi/price/v1.1/${chainId}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${import.meta.env.VITE_1INCH_API_KEY}`,
    },
    method: "POST" as const,
    mode: "cors",
    body: JSON.stringify(body),
  });

  const result = await response.json();

  return result;
};

export const fetchTokenChartData = async (
  addresses: string | null,
  chainId?: number | null
): Promise<any | null> => {
  // const response = await axios.get(`/chartapi/latest/dex/tokens/${addresses}`, {
  const response = await fetch(
    // `${
    //   import.meta.env.MODE === "development"
    //     ? "/chartapi"
    //     : import.meta.env.VITE_DEXSCREENER_URL
    // }/latest/dex/search/?q=${addresses}`,
    `/chartapi/latest/dex/search/?q=${addresses}`,
    {
      headers: {
        ...headers,
      },
      method: "GET" as const,
      mode: "cors",
    }
  );
  const resultJson = await response.json();
  const splitAddresses = addresses?.split("/");
  const result = resultJson.pairs.find(
    (item: any) =>
      item.chainId === newtworkName[chainId as keyof typeof newtworkName] &&
      splitAddresses?.includes(item.baseToken.address.toLowerCase()) &&
      splitAddresses?.includes(item.quoteToken.address.toLowerCase())
  );
  return result || null;
};

export const useFetchTokenListByChainId = (chainId?: number | null) =>
  useQuery({
    queryKey: [tokenListByChainIdQueryKey, chainId],
    queryFn: () => fetchTokenListByChainId(chainId),
    enabled: !!chainId,
  });

export const useFetchTokenPriceByAddresses = (
  body: { tokens: (string | null)[]; currency: string },
  chainId?: number | null
) =>
  useQuery({
    queryKey: [tokenPricesQueryKey, chainId, body],
    queryFn: () => fetchTokenPriceByAddresses(body, chainId),
    enabled: !!chainId,
  });

export const useFetchTokenChartData = (
  addresses: string | null,
  chainId?: number | null
) =>
  useQuery({
    queryKey: [tokenChartPairAddressQueryKey, addresses, chainId],
    queryFn: () => fetchTokenChartData(addresses, chainId),
    enabled: !!addresses,
  });
