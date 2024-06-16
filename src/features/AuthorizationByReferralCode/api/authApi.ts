import { UseMutationResult, useMutation } from "@tanstack/react-query";
import type {
  AuthorizationByReferralResponse,
  AuthorizationByReferralState,
} from "../model/types";

export const loginByReferralCode = async (
  state: AuthorizationByReferralState
): Promise<AuthorizationByReferralResponse> => {
  const { chainId, ...restState } = state;
  const response = await fetch(
    `${
      import.meta.env.DEV ? "/splitexapi" : import.meta.env.VITE_API_URL
    }/${chainId}/auth`,
    {
      method: "POST" as const,
      body: JSON.stringify(restState),
    }
  );
  const result = await response.json();
  return result;
};

export const useLoginByReferralCodeApi = (): UseMutationResult<
  AuthorizationByReferralResponse,
  unknown,
  AuthorizationByReferralState
> => {
  return useMutation({
    mutationFn: (state) => loginByReferralCode(state),
    onSuccess: (data: AuthorizationByReferralResponse) => {
      if (typeof window !== 'undefined' && data.authSuccess) {
        localStorage.removeItem('inviter');
      }
    },
  });
};
