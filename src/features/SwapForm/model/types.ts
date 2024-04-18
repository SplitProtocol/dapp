export enum SwapHeaderCaptions {
  HOME = "Exchange",
  FROM = "Exchange from",
  TO = "Exchange to",
}

export type SwapDestinationState = {
  symbol: string | null;
  name: string | null;
  address: string | null;
  logoURI: string | null;
  decimals: number | null;
  chainId: number | null;
};

export type TokenGetOutAmountState = {
  fromToken: string;
  fromDecimals: number;
  toToken: string;
  volume: string;
  destChainID: number;
}

export type TokenGetOutAmountBody = {
  fromToken: string;
  toToken: string;
  volume: string;
  destChainID: number;
}