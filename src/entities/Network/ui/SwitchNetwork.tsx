import { Loader, ActionIcon as MantineActionButton } from "@mantine/core";
import { useAccount, useSwitchChain } from "wagmi";
import { renderNewtworkLogoByChainId } from "..";
import { clsxMerge } from "@/shared/lib/clsxMerge";

export const SwitchNetwork = () => {
  const { chain, connector } = useAccount();
  const { chains, error, isPending, switchChain } = useSwitchChain();
  return (
    <div className="flex flex-row flex-wrap w-[calc(100%+0.5rem)] mx-[-0.25rem] mb-4">
      {chains.map((x) => (
        <MantineActionButton
          disabled={!switchChain || x.id === chain?.id}
          key={x.id}
          variant="light"
          className={clsxMerge(
            "w-[calc(1/6*100%-0.5rem)] bg-gray-500 hover:bg-gray-800 mx-[0.25rem] mb-[0.25rem] h-[2.75rem]",
            x.id === chain?.id && "bg-primary/50 border-primary"
          )}
          onClick={() => switchChain({ connector, chainId: x.id })}
        >
          {isPending && chain?.id === x.id ? (
            <Loader size="xs" color="white" />
          ) : (
            <div className="w-[2rem] h-[2rem] shrink-0 [&_svg]:w-full [&_svg]:h-full">
              {renderNewtworkLogoByChainId(x.id)}
            </div>
          )}
        </MantineActionButton>
      ))}
      <div>{error && error.message}</div>
    </div>
  );
};
