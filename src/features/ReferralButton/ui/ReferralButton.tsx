import { IconCopy } from "@tabler/icons-react";
import { useReferralButton } from "../lib/useReferralButton";
import { FC } from "react";
import { clsxMerge } from "@/shared/lib/clsxMerge";

const referralButtonClassName =
  "flex flex-row w-full max-w-[28rem] justify-between items-center rounded-xl bg-gray-800 gap-x-2 h-auto py-2 pl-4 pr-2 md:pl-8 md:pr-4 border-primary/50 hover:border-primary transition-all";

const referralButtonInnerClassName = "flex flex-col w-full px-0";

type ReferralButtonProps = {
  className?: string;
}

export const ReferralButton: FC<ReferralButtonProps> = (props) => {
  const { className } = props;
  const { memoizedReferralLink, handleCopyToClipboard } = useReferralButton();

  const mergedClassNames = clsxMerge(referralButtonClassName, className && className)

  return (
    <button type="button" className={mergedClassNames} onClick={handleCopyToClipboard}>
      <div className={referralButtonInnerClassName}>
        <div className="text-xs text-left text-primary">Your referral link</div>
        <div className="text-sm text-left text-white font-medium truncate max-w-[20rem]">
          {memoizedReferralLink}
        </div>
      </div>
      <div className="flex items-center justify-center flex-col shrink-0 w-[2rem] h-[2rem]">
        <IconCopy size={18} className="flex text-primary " />
      </div>
    </button>
  );
};
