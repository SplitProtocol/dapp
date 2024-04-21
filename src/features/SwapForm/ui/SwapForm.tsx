import { useCallback } from "react";
import { useSwapForm } from "../lib/useSwapForm";
import { SwapHeaderCaptions } from "../model/types";
import { SwapFormHeader } from "./SwapFormHeader";
import { SwapFormHome } from "./SwapFormHome";
import { SwapDestination } from "./SwapDestination";

export const SwapForm = () => {
  const {
    activeScreen,
    destinationFrom,
    destinationTo,
    chainId,
    pricesTokenFrom,
    pricesTokenTo,
    payAmount,
    memoizedGetOut,
    slippage,
    isLoadingGetAmount,
    setPayAmount,
    setSlippage,
    switchDestinations,
    handleBackAction,
    setDestinationFrom,
    setDestinationTo,
    handleOpenDestination,
  } = useSwapForm();

  const renderActiveScreen = useCallback(
    (active: SwapHeaderCaptions) => {
      switch (active) {
        case SwapHeaderCaptions.HOME:
          return (
            <SwapFormHome
              destinationFrom={destinationFrom}
              destinationTo={destinationTo}
              slippage={slippage}
              setSlippage={setSlippage}
              isLoadingGetAmount={isLoadingGetAmount}
              switchDestinations={switchDestinations}
              getAmount={memoizedGetOut}
              onOpenDestinationFrom={() =>
                handleOpenDestination(SwapHeaderCaptions.FROM)
              }
              onOpenDestinationTo={() =>
                handleOpenDestination(SwapHeaderCaptions.TO)
              }
              priceFrom={pricesTokenFrom}
              priceTo={pricesTokenTo}
              payAmount={payAmount}
              setPayAmount={setPayAmount}
            />
          );
        case SwapHeaderCaptions.FROM:
          return (
            <SwapDestination
              chainId={chainId}
              desinationOpposite={destinationTo}
              destinationPoint={destinationFrom}
              destination="from"
              setDestination={setDestinationFrom}
              onBack={handleBackAction}
            />
          );
        case SwapHeaderCaptions.TO:
          return (
            <SwapDestination
              chainId={destinationTo.chainId || chainId}
              desinationOpposite={destinationFrom}
              destinationPoint={destinationTo}
              destination="to"
              setDestination={setDestinationTo}
              onBack={handleBackAction}
            />
          );
        default:
          return (
            <SwapFormHome
              destinationFrom={destinationFrom}
              destinationTo={destinationTo}
              slippage={slippage}
              getAmount={memoizedGetOut}
              isLoadingGetAmount={isLoadingGetAmount}
              setSlippage={setSlippage}
              switchDestinations={switchDestinations}
              onOpenDestinationFrom={() =>
                handleOpenDestination(SwapHeaderCaptions.FROM)
              }
              onOpenDestinationTo={() =>
                handleOpenDestination(SwapHeaderCaptions.TO)
              }
              priceFrom={pricesTokenFrom}
              priceTo={pricesTokenTo}
              payAmount={payAmount}
              setPayAmount={setPayAmount}
            />
          );
      }
    },
    [
      destinationFrom,
      destinationTo,
      slippage,
      setSlippage,
      isLoadingGetAmount,
      switchDestinations,
      memoizedGetOut,
      pricesTokenFrom,
      pricesTokenTo,
      payAmount,
      setPayAmount,
      chainId,
      setDestinationFrom,
      handleBackAction,
      setDestinationTo,
      handleOpenDestination,
    ]
  );

  return (
    <div className="flex flex-col w-full bg-[rgb(18,18,18)] px-4 py-4 mt-4 rounded-md">
      <SwapFormHeader activeScreen={activeScreen} onBack={handleBackAction} />
      {renderActiveScreen(activeScreen)}
    </div>
  );
};
