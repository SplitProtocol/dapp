import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi"

export const useNetworkButton = () => {
  const { open } = useWeb3Modal();
  const { chain } = useAccount();

  const handleOpenNetworksModal = () => open({ view: 'Networks' })
  return {
    chain,
    handleOpenNetworksModal
  }
}