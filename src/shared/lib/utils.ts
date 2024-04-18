import { BigNumberish } from "ethers";
import { ethers } from "ethers";

export const convertAddressWallet = (address: string, length: number) => {
  if (address) {
    const firstStr = address.slice(0, length);
    const lastStr = address.slice(-4);
    return `${firstStr}...${lastStr}`;
  } else {
    return "";
  }
};

export const formatEtherValue = (value?: BigNumberish, decimals?: number) => {
  if (typeof value === 'undefined') return '0';
  const formattedValue = ethers.formatUnits(value, decimals);

  return formattedValue;
};

export const calculateTokenPrice = (token1PriceUSD?: number, token2PriceUSD?: number) => {
  if (Number.isNaN(token1PriceUSD) || Number.isNaN(token2PriceUSD)) return "Error"
  if (typeof token1PriceUSD !== 'number' || typeof token2PriceUSD !== 'number' || token1PriceUSD <= 0 || token2PriceUSD <= 0) {
      return "Error";
  }

  const token2PriceInToken1 = token2PriceUSD / token1PriceUSD;

  return token2PriceInToken1.toFixed(8);
}

export const calculateTokenCost = (quantity: number | string | undefined, priceUSD: number) => {
  if (Number.isNaN(quantity) || Number.isNaN(priceUSD)) return 0
  if (Number(quantity) <= 0 || Number(priceUSD) <= 0) {
      return 0;
  }
  const totalCost = Number(quantity) * Number(priceUSD);

  return totalCost.toFixed(2);
}

export const calculateTokenGetAmount = (token1Amount: number, token1PriceUSD: number, token2PriceUSD: number) => {
  if (Number.isNaN(token1Amount) || Number.isNaN(token1PriceUSD) || Number.isNaN(token2PriceUSD)) return 0
  if (Number(token1Amount) <= 0 || Number(token1PriceUSD) <= 0 || Number(token2PriceUSD) <= 0) {
      return 0;
  }

  let token2Amount = (token1Amount * token1PriceUSD) / token2PriceUSD;
  token2Amount = parseFloat(token2Amount.toFixed(8));

  return token2Amount;
}