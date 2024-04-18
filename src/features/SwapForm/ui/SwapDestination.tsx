import { TokenListCard } from "@/entities/Token";
import { InputGenerator } from "@/shared/ui/Input/Input";
import { IconSearch } from "@tabler/icons-react";
import { FC } from "react";
import { useSwapDestination } from "../lib/useSwapDestination";
import { SwapDestinationState } from "../model/types";
import { SelectNetwork, SwitchNetwork } from "@/entities/Network";
import { Loader } from "@mantine/core";

type SwapDestinationProps = {
  chainId?: number | null;
  destination: "from" | "to";
  destinationPoint: SwapDestinationState;
  desinationOpposite: SwapDestinationState;
  setDestination: (destination: SwapDestinationState) => void;
  onBack: () => void;
};

export const SwapDestination: FC<SwapDestinationProps> = (props) => {
  const {
    chainId,
    destination,
    desinationOpposite,
    destinationPoint,
    setDestination,
    onBack,
  } = props;
  const {
    tokenList,
    search,
    isLoadingTokens,
    searchResults,
    handleInputChange,
    handleSetNetwork,
    handleSetDestination,
  } = useSwapDestination(
    setDestination,
    onBack,
    destination,
    destinationPoint,
    desinationOpposite,
    chainId
  );

  return (
    <div className="flex flex-col w-full">
      {destination === "from" && <SwitchNetwork />}
      {destination === "to" && (
        <SelectNetwork
          selectedNetwork={destinationPoint.chainId || chainId}
          setSelectedNetwork={handleSetNetwork}
        />
      )}
      <div className="flex flex-col w-full mb-2">
        <InputGenerator
          placeholder="Search by token name or address"
          leftSection={<IconSearch size={16} />}
          sizeInput="large"
          value={search}
          onChange={(event) => handleInputChange(event.currentTarget.value)}
        />
      </div>
      <div className="flex flex-col w-full max-h-[18.75rem] overflow-auto">
        {isLoadingTokens && (
          <div className="flex flex-col items-center justify-center">
            <Loader size="xs" color="orange" />
          </div>
        )}
        {!isLoadingTokens &&
          searchResults.length > 0 &&
          searchResults.map((token) => (
            <TokenListCard
              key={token.address}
              token={token}
              onSetDestination={handleSetDestination}
            />
          ))}
        {!isLoadingTokens &&
          !searchResults.length &&
          tokenList?.map((token) => (
            <TokenListCard
              key={token.address}
              token={token}
              onSetDestination={handleSetDestination}
            />
          ))}
      </div>
    </div>
  );
};
