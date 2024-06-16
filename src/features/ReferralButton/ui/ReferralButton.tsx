import { IconCopy } from "@tabler/icons-react";
import { useReferralButton } from "../lib/useReferralButton";
import { FC } from "react";
import { clsxMerge } from "@/shared/lib/clsxMerge";

const referralButtonClassName =
  "flex relative flex-row w-full max-w-[28rem] justify-between items-center rounded-xl bg-gray-800 h-auto py-2 px-4 md:px-8 border-primary/50 hover:border-primary transition-all";

const referralButtonInnerClassName = "flex flex-col flex-auto w-64 px-0";

type ReferralButtonProps = {
  className?: string;
};

export const ReferralButton: FC<ReferralButtonProps> = (props) => {
  const { className } = props;
  const { memoizedReferralLink, handleCopyToClipboard } = useReferralButton();

  const mergedClassNames = clsxMerge(
    referralButtonClassName,
    className && className
  );

  return (
    <button
      type="button"
      className={mergedClassNames}
      onClick={handleCopyToClipboard}
    >
      <div className={referralButtonInnerClassName}>
        <div className="text-xs text-left text-primary">Your referral link</div>
        <div className="text-sm text-left text-white font-medium truncate w-full">
          {memoizedReferralLink}
        </div>
      </div>
      <div className="flex flex-none items-center justify-center flex-col shrink-0 w-[2rem] h-[2rem]">
        <IconCopy size={18} className="text-primary " />
      </div>
    </button>
  );
};
