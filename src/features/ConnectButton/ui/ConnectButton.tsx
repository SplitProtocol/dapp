import { Button } from "@/shared/ui";
import { useConnectButton } from "../lib/useConnectButton";
import { convertAddressWallet } from "@/shared/lib/utils";

export const ConnectButton = () => {
  const { address, handleOpenModal } = useConnectButton();

  return (
    <Button type="button" size="base" onClick={handleOpenModal} color="base">
      {address ? convertAddressWallet(address, 8) : "Connect wallet"}
    </Button>
  );
};
