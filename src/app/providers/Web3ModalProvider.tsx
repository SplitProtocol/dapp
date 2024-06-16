import { createWeb3Modal } from "@web3modal/wagmi/react";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from '@/shared/configs/wagmiConfig';

import { PropsWithChildren, FC } from "react";

// Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_PROJECT_ID;

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

export const Web3ModalProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};
