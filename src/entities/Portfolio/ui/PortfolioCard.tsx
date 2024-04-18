import { convertAddressWallet } from "@/shared/lib/utils";
import { useProfileCard } from "../lib/useProfileCard"
import { Skeleton, rem } from "@mantine/core";

export const PortfolioCard = () => {
  const { address, localBalance, } = useProfileCard();

  console.log(localBalance)
  return (
    <div className="flex flex-col w-full rounded-lg bg-gray-800 px-8 py-8">
      {!address && <Skeleton width={rem(220)} height={rem(16)} className="opacity-50" />}
      {address && <div className="text-lg text-white font-medium" title={address}>{convertAddressWallet(address, 18)}</div>}
      <div className="flex flex-col">
        {localBalance && <div className="text-2xl font-bold text-white">{localBalance}</div>}
      </div>
    </div>
  )
}