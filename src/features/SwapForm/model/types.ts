import { TokenListItem } from "@/entities/Token";

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
  priceUSD: string | null;
};

export type TokenGetOutAmountState = {
  fromToken: string;
  fromDecimals: number;
  toToken: string;
  volume: string;
  destChainID: number;
  fromChainID: number;
}

export type TokenGetOutAmountBody = {
  fromToken: string;
  toToken: string;
  volume: string;
  destChainID: number;
}

export type SwapState = {
  fromToken: string;
  toToken: string;
  volume: string;
  trader: string;
  unsignedHash: string;
  signedHash: string;
  fromChainID: number;
  destChainID: number;
  partner?: string;
  partnerShare?: string;
  burnAmount?: number;
  slippage: number;
  stopLoss?: string;
  takeProfit?: string;
  trailingStopLoss?: string;
}

export type SwapBody = Omit<SwapState, 'fromChainID'>

export type SwapResponse = {
  txhash: string;
  destChainID: number;
}

type Token = {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

type ToolDetails = {
  key: string;
  name: string;
  logoURI: string;
}

type Action = {
  fromToken: Token;
  fromAmount: string;
  toToken: Token;
  fromChainId: number;
  toChainId: number;
  slippage: number;
  fromAddress: string;
  toAddress: string;
}

type FeeCost = {
  name: string;
  description: string;
  token: Token;
  amount: string;
  amountUSD: string;
  percentage: string;
  included: boolean;
}

type GasCost = {
  type: string;
  price: string;
  estimate: string;
  limit: string;
  amount: string;
  amountUSD: string;
  token: Token;
}

type Estimate = {
  tool: string;
  approvalAddress: string;
  toAmountMin: string;
  toAmount: string;
  fromAmount: string;
  feeCosts: FeeCost[];
  gasCosts: GasCost[];
  executionDuration: number;
  fromAmountUSD: string;
  toAmountUSD: string;
}

type StepAction = {
  fromChainId: number;
  fromAmount: string;
  fromToken: Token;
  toChainId: number;
  toToken: Token;
  slippage: number;
  fromAddress: string;
  toAddress: string;
  destinationGasConsumption?: string;
}

type StepEstimate = {
  tool: string;
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  approvalAddress: string;
  executionDuration: number;
  feeCosts: FeeCost[];
  gasCosts: GasCost[];
}

type IncludedStep = {
  id: string;
  type: string;
  action: StepAction;
  estimate: StepEstimate;
  tool: string;
  toolDetails: ToolDetails;
}

type TransactionRequest = {
  data: `0x${string}`;
  to: `0x${string}`;
  value: bigint | undefined;
  from: string;
  chainId: number;
  gasPrice: bigint | undefined;
  gasLimit: string;
}

export type SwapCrossResponse = {
  type: string;
  id: string;
  tool: string;
  toolDetails: ToolDetails;
  action: Action;
  estimate: Estimate;
  includedSteps: IncludedStep[];
  integrator: string;
  tx: TransactionRequest;
}

export type SwapCrossResponseFromChain = SwapCrossResponse & {
  fromChainID: number;
}

export type ImportedTokensStoreState = {
  importedTokens: TokenListItem[];
}

export type ImportedTokensStoreAction = {
  addImportedToken: (token: TokenListItem) => void;
  clearImportedTokens: () => void;
}