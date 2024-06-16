export type Token = {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals: number;
  chainId: number;
  priceUSD: string;
};

export type TokenListItem = {
  chainId: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  providers?: string[];
  tags?: string[];
  priceUSD: string;
};

export type TokenChartStoreState = {
  symbols: string | null;
  isExpertMode: boolean;
};

export type TokenChartStoreAction = {
  setSymbols: (value: string | null) => void;
  dropChart: () => void;
  setIsExpertMode: (value: boolean) => void;
};
