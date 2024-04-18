import { clsxMerge } from "@/shared/lib/clsxMerge";
import { Button } from "@mantine/core"
import { useNetworkButton } from "../lib/useNetworkButton";
import { renderNewtworkLogoByChainId } from "@/entities/Network";
import { colorByChainId } from "@/entities/Network/lib/borderColorByChainId";

const networkButtonClassName = 'flex justify-center font-body items-center text-center whitespace-nowrap transition-all gap-x-2 bg-gray-600 rounded-lg border hover:bg-gray-600/50';

export const NetworkButton = () => {
  const { chain, handleOpenNetworksModal } = useNetworkButton();
  const mergedClassNames = clsxMerge(networkButtonClassName, chain && colorByChainId(chain.id))

  return (
    <Button type="button" className={mergedClassNames} onClick={handleOpenNetworksModal} disabled={!chain}>
      {chain ? <div className="flex flex-row items-center gap-x-2">{renderNewtworkLogoByChainId(chain.id)}<div className="md:flex hidden">{chain.name}</div></div> : "Wrong network"}
    </Button>
  )
}