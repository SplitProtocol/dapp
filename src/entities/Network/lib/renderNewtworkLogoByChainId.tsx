import {
  ArbitrumOne,
  Avalanche,
  BSC,
  Ethereum,
  Fantom,
  Polygon,
} from "@/shared/ui/SWG";

export const networkLogos = {
  1: <Ethereum />,
  137: <Polygon />,
  43114: <Avalanche />,
  42161: <ArbitrumOne />,
  56: <BSC />,
  250: <Fantom />,
} as const;

export const renderNewtworkLogoByChainId = (chaindId: number) => {
  return networkLogos[chaindId as keyof typeof networkLogos] || null;
};
