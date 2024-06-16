export type AuthorizationByReferralState = {
  trader: string;
  unsignedHash: string;
  signedHash: string;
  ambassador: string;
  chainId: number;
}

export type AuthorizationByReferralResponse = {
  authSuccess: boolean;
  txhash: string;
}