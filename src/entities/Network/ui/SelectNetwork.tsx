import { ActionIcon as MantineActionButton } from "@mantine/core";
import { useSwitchChain } from "wagmi";
import { renderNewtworkLogoByChainId } from "..";
import { clsxMerge } from "@/shared/lib/clsxMerge";
import { FC } from "react";

type SelectNetworkProps = {
  selectedNetwork?: number | null;
  setSelectedNetwork: (value: number) => void;
};

export const SelectNetwork: FC<SelectNetworkProps> = (props) => {
  const { selectedNetwork, setSelectedNetwork } = props;
  const { chains } = useSwitchChain();
  return (
    <div className="flex flex-row flex-wrap w-[calc(100%+0.5rem)] mx-[-0.25rem] mb-4">
      {chains.map((x) => (
        <MantineActionButton
          disabled={x.id === selectedNetwork}
          key={x.id}
          variant="light"
          className={clsxMerge(
            "w-[calc(1/6*100%-0.5rem)] bg-gray-500 hover:bg-gray-800 mx-[0.25rem] mb-[0.25rem] h-[2.75rem]",
            x.id === selectedNetwork && "bg-primary/50 border-primary"
          )}
          onClick={() => setSelectedNetwork(x.id)}
        >
          <div className="w-[2rem] h-[2rem] shrink-0 [&_svg]:w-full [&_svg]:h-full">
            {renderNewtworkLogoByChainId(x.id)}
          </div>
        </MantineActionButton>
      ))}
    </div>
  );
};
