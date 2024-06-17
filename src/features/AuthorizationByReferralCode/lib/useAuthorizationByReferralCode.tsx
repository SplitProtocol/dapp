import { errorHandler } from "@/shared/api/apiClient";
import { useWeb3 } from "@/shared/lib/useWeb3";
import { useCallback, useState } from "react";
import { useLoginByReferralCodeApi } from "../api/authApi";
import { AuthorizationByReferralState } from "../model/types";

export const useAuthorizationByReferralCode = () => {
  const [isPendingSign, setIsPendingSign] = useState(false);

  const { signMessage } = useWeb3();

  const inviter = typeof window !== 'undefined' && localStorage.getItem(import.meta.env.VITE_INVITER_KEY);

  const { mutateAsync, isPending: isPendingLogin } = useLoginByReferralCodeApi();

  const isPending = isPendingSign || isPendingLogin;

  const handleSingMessage = useCallback(async(address: string | null, chainId: number) => {
    try {
      if (!address || !chainId) return;
      const singMessages = await signMessage(
        `Login as ${address}. Inviter: ${inviter || 'none'}`,
        setIsPendingSign
      );
      if (!singMessages?.signedHash || !singMessages?.unsignedHash) return;

      const state: AuthorizationByReferralState = {
        trader: address,
        unsignedHash: singMessages.unsignedHash,
        signedHash: singMessages.signedHash,
        ambassador: inviter || "",
        chainId,
      } 
      await mutateAsync(state);
    } catch (error) {
      errorHandler(error);
    }
  }, [inviter, mutateAsync, signMessage])

  return {
    isPending,
    isPendingLogin,
    inviter,
    handleSingMessage,
  }
}