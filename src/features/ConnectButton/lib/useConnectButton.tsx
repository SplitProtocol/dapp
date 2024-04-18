import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export const useConnectButton = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  const handleOpenModal = () => open();

  return {
    address,
    handleOpenModal,
  };
};
