import { SwapDestinationState } from "../model/types";

export const destinationStateDefault: SwapDestinationState = {
  symbol: null,
  name: null,
  address: null,
  logoURI: null,
  chainId: null,
  decimals: null,
}

export const slippageOptions = [
  {
    value: '0.1',
    label: '0.1%'
  },
  {
    value: '0.5',
    label: '0.5%'
  },
  {
    value: '1.0',
    label: '1.0%'
  }
]