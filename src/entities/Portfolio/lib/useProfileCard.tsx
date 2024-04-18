import { useAccount, createConfig, http } from "wagmi";
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  mainnet,
  polygon,
} from "wagmi/chains";
import { getBalance } from "@wagmi/core";
import { useCallback, useEffect, useState } from "react";
import { formatEtherValue } from "@/shared/lib/utils";

const config = createConfig({
  chains: [mainnet, arbitrum, avalanche, fantom, bsc, polygon],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [fantom.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
  },
});

export const useProfileCard = () => {
  const { address, chainId } = useAccount();
  const [localBalance, setLocalBalance] = useState<string | null>(null);

  const displayBalance = useCallback(async () => {
    if (!chainId) return;
    const balance = await getBalance(config, {
      address: address || "0x",
      chainId: chainId as 1 | 42161 | 43114 | 250 | 56 | 137 | undefined,
    });
    return balance;
  }, [address, chainId]);

  useEffect(() => {
    displayBalance().then((balanceValue) => {
      if (balanceValue?.value)
        return setLocalBalance(
          formatEtherValue(balanceValue.value, balanceValue.decimals)
        );
      setLocalBalance("0.0");
    });
  }, [displayBalance]);
  return {
    address,
    localBalance,
    chainId,
    displayBalance,
  };
};
