import { FC } from "react";
import { SwapDestinationState } from "../model/types";
import {
  newtworkOnCaption,
  renderNewtworkLogoByChainId,
} from "@/entities/Network";
import {
  Collapse as MantineCollapse,
  ActionIcon as MantineActionButton,
  Loader,
} from "@mantine/core";
import {
  IconArrowsRightLeft,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { clsxMerge } from "@/shared/lib/clsxMerge";
import { InputAmount } from "@/shared/ui/Input/InputAmount";
import { InputAmountPay } from "@/shared/ui/Input/InputAmountPay";
import { Button } from "@/shared/ui";
import { useDisclosure } from "@mantine/hooks";
import { calculateTokenPrice } from "@/shared/lib/utils";
import { useAccount } from "wagmi";
import { SlippageControl } from "@/features/SlippageControl";
import { slippageOptions } from "../lib/consts";
import { useConnectButton } from "@/features/ConnectButton";

type SwapFormHomeProps = {
  destinationFrom: SwapDestinationState;
  destinationTo: SwapDestinationState;
  onOpenDestinationFrom: () => void;
  onOpenDestinationTo: () => void;
  switchDestinations: () => void;
  setSlippage: (value: string) => void;
  onApprove: () => void;
  isApproveAvailable: boolean;
  priceFrom?: Record<string, string> | null;
  priceTo?: Record<string, string> | null;
  slippage: string;
  getAmount: string;
  payAmount: string;
  isPending: boolean;
  onSwap: () => void;
  isLoadingGetAmount: boolean;
  setPayAmount: (value: string) => void;
};

export const SwapFormHome: FC<SwapFormHomeProps> = (props) => {
  const {
    destinationFrom,
    destinationTo,
    priceFrom,
    priceTo,
    payAmount,
    getAmount,
    slippage,
    isLoadingGetAmount,
    isApproveAvailable,
    isPending,
    onApprove,
    onSwap,
    onOpenDestinationFrom,
    onOpenDestinationTo,
    switchDestinations,
    setPayAmount,
    setSlippage,
  } = props;

  const { handleOpenModal } = useConnectButton();

  const { address } = useAccount();

  const [opened, { toggle }] = useDisclosure(false);

  const mergedClassNames = clsxMerge(
    "flex w-full gap-4 items-center justify-center",
    destinationFrom.address && destinationTo.address ? "flex-row" : "flex-col"
  );

  const mergedLogoClassNames = clsxMerge(
    "flex flex-col relative shrink-0",
    destinationFrom.address && destinationTo.address
      ? "w-[2rem] h-[2rem]"
      : "w-[2.5rem] h-[2.5rem]"
  );

  const isDisplayedInputs = destinationFrom.address && destinationTo.address;

  const isButtonDisabled = Number(payAmount) === 0 || !isApproveAvailable || isPending

  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className={mergedClassNames}>
        <div
          className="flex flex-col w-full px-4 py-3 rounded-xl bg-gray-500 cursor-pointer card-border"
          onClick={onOpenDestinationFrom}
        >
          <div className="text-sm text-left font-bold text-white mb-2">
            From
          </div>
          <div className="flex flex-row w-full items-center">
            {!destinationFrom.address && (
              <>
                <div className="flex flex-col w-[2.5rem] h-[2.5rem] relative">
                  <div className="rounded-full w-full h-full bg-gray-600" />
                  <div className="rounded-full w-[1rem] h-[1rem] bg-gray-500 px-[0.125rem] py-[0.125rem] absolute right-[-2px] bottom-[-2px]">
                    <div className="bg-gray-600 w-full h-full rounded-full"></div>
                  </div>
                </div>
                <div className="text-md text-left ml-4 font-medium text-white/80">
                  Select chain and token
                </div>
              </>
            )}
            {destinationFrom.address && (
              <>
                <div className={mergedLogoClassNames}>
                  <img
                    src={destinationFrom.logoURI || ""}
                    alt={destinationFrom.name || ""}
                    className="rounded-full w-full h-full shrink-0"
                  />
                  <div className="flex justify-center items-center rounded-full w-[1.125rem] h-[1.125rem] bg-gray-500 px-[0.125rem] py-[0.125rem] absolute right-[-2px] bottom-[-2px]">
                    <div className="flex justify-center items-center bg-gray-600 w-full h-full rounded-full">
                      {destinationFrom.chainId &&
                        renderNewtworkLogoByChainId(destinationFrom.chainId)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full pl-4">
                  <div className="text-md text-left font-medium text-white">
                    {destinationFrom?.symbol}
                  </div>
                  <div className="text-xs text-left text-white/60">
                    {destinationFrom.chainId &&
                      newtworkOnCaption[
                        destinationFrom.chainId as keyof typeof newtworkOnCaption
                      ]}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <MantineActionButton
          className="absolute w-[2.125rem] h-[2.125rem] rounded-full z-10 bg-gray-500 hover:bg-gray-500/90 card-border"
          onClick={switchDestinations}
        >
          <IconArrowsRightLeft size={16} />
        </MantineActionButton>
        <div
          className="flex flex-col w-full px-4 py-3 rounded-xl bg-gray-500 cursor-pointer card-border"
          onClick={onOpenDestinationTo}
        >
          <div className="text-sm text-left font-bold text-white mb-2">To</div>
          <div className="flex flex-row w-full items-center">
            {!destinationTo.address && (
              <>
                <div className="flex flex-col w-[2.5rem] h-[2.5rem] relative">
                  <div className="rounded-full w-full h-full bg-gray-600" />
                  <div className="rounded-full w-[1rem] h-[1rem] bg-gray-500 px-[0.125rem] py-[0.125rem] absolute right-[-2px] bottom-[-2px]">
                    <div className="bg-gray-600 w-full h-full rounded-full"></div>
                  </div>
                </div>
                <div className="text-md text-left ml-4 font-medium text-white/80">
                  Select chain and token
                </div>
              </>
            )}
            {destinationTo.address && (
              <>
                <div className={mergedLogoClassNames}>
                  <img
                    src={destinationTo.logoURI || ""}
                    alt={destinationTo.name || ""}
                    className="rounded-full w-full h-full shrink-0"
                  />
                  <div className="flex justify-center items-center rounded-full w-[1.125rem] h-[1.125rem] bg-gray-500 px-[0.125rem] py-[0.125rem] absolute right-[-2px] bottom-[-2px]">
                    <div className="flex justify-center items-center bg-gray-600 w-full h-full rounded-full">
                      {destinationTo.chainId &&
                        renderNewtworkLogoByChainId(destinationTo.chainId)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full pl-4">
                  <div className="text-md text-left font-medium text-white">
                    {destinationTo?.symbol}
                  </div>
                  <div className="text-xs text-left text-white/60">
                    {destinationTo.chainId &&
                      newtworkOnCaption[
                        destinationTo.chainId as keyof typeof newtworkOnCaption
                      ]}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isDisplayedInputs && (
        <>
          <InputAmountPay
            token={destinationFrom}
            caption="You pay"
            placeholder="0.0"
            sizeInput="small"
            value={payAmount}
            onChange={(value) => setPayAmount(value.toString())}
            tokenPriceUSD={
              priceFrom &&
              Number(
                priceFrom[destinationFrom.address as keyof typeof priceFrom]
              )
            }
          />
          <InputAmount
            token={destinationTo}
            caption="You get"
            placeholder="0.0"
            sizeInput="large"
            readOnly
            isLoading={isLoadingGetAmount}
            value={getAmount}
            // tokenPriceFromUSD={
            //   priceFrom &&
            //   Number(
            //     priceFrom[destinationFrom.address as keyof typeof priceFrom]
            //   )
            // }
            tokenPriceToUSD={
              priceTo &&
              Number(priceTo[destinationTo.address as keyof typeof priceTo])
            }
          />
          <div className="flex flex-col w-full rounded-lg bg-[#1E1E1E]">
            <button
              type="button"
              onClick={toggle}
              className="flex relative flex-row w-full justify-start bg-[#1E1E1E] text-left border-none cursor-pointer py-[0.56rem] lg:py-4 px-2 lg:px-[0.75rem]"
            >
              <div className="flex flex-col w-full">
                <div className="text-xs text-white">
                  1 {destinationTo.symbol} ={" "}
                  {priceFrom &&
                    priceTo &&
                    calculateTokenPrice(
                      priceFrom &&
                        Number(
                          priceFrom[
                            destinationFrom.address as keyof typeof priceFrom
                          ]
                        ),
                      priceTo &&
                        Number(
                          priceTo[destinationTo.address as keyof typeof priceTo]
                        )
                    )}{" "}
                  {destinationFrom.symbol}
                </div>
                <div className="flex flex-row gap-x-1 items-center text-xs text-white">
                  Slippage Tolerance: <div className="text-primary">{slippage}%</div>
                </div>
              </div>

              <div className="flex absolute w-[1.5rem] h-[1.5rem] items-center justify-center right-2">
                {opened ? (
                  <IconChevronUp size={14} />
                ) : (
                  <IconChevronDown size={14} />
                )}
              </div>
            </button>
            <MantineCollapse in={opened}>
              <div className="flex flex-col w-full pb-4 px-2 lg:px-[0.75rem]">
                <SlippageControl
                  name="slippage"
                  items={slippageOptions}
                  value={slippage}
                  size="md"
                  onChange={setSlippage}
                />
              </div>
            </MantineCollapse>
          </div>
        </>
      )}

      <div className="flex flex-col w-full">
        {!address && (
          <Button size="lg" color="base" fullWidth onClick={handleOpenModal}>
            Connect wallet
          </Button>
        )}
        {address && isApproveAvailable && (
          <Button size="lg" color="base" fullWidth disabled={isButtonDisabled} onClick={onSwap}>
            {isPending ? <Loader size='xs' color="white" /> : 'Swap'}
          </Button>
        )}
        {address && !isApproveAvailable && (
          <Button size="lg" color="base" fullWidth onClick={onApprove}>
            {isPending ? <Loader size='xs' color="white" /> : 'Approve'}
          </Button>
        )}
      </div>
    </div>
  );
};
