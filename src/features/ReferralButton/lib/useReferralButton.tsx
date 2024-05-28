import { errorHandler } from "@/shared/api/apiClient";
import {
  notification,
  notificationMessages,
  notificationTitles,
} from "@/shared/helpers/notificationMessages";
import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";

export const useReferralButton = () => {
  const { address } = useAccount();

  const memoizedReferralLink = useMemo(() => {
    return `${import.meta.env.VITE_MAIN_URL}/?ref=${address}`;
  }, [address]);

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(memoizedReferralLink);
      notification.success(
        notificationTitles.success,
        notificationMessages.referralLinkWasCopySoccess
      );
    } catch (error) {
      errorHandler(error);
    }
  }, [memoizedReferralLink]);
  return {
    address,
    memoizedReferralLink,
    handleCopyToClipboard,
  };
};
