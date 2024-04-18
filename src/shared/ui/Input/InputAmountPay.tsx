import { renderNewtworkLogoByChainId } from "@/entities/Network";
import { SwapDestinationState } from "@/features/SwapForm/model/types";
import { clsxMerge } from "@/shared/lib/clsxMerge";
import { calculateTokenCost, formatEtherValue } from "@/shared/lib/utils";
import {
  type InputBaseProps,
  NumberInput as MantineNumberInput,
  type NumberInputProps as MantineNumberInputProps,
  Skeleton,
} from "@mantine/core";
import {
  useMemo,
  type FC,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useAccount, useBalance } from "wagmi";

type NumberInputSize = "small" | "medium" | "large";

type NumberInputProps = InputBaseProps &
  MantineNumberInputProps &
  InputHTMLAttributes<HTMLInputElement> & {
    label?: ReactNode;
    isOptional?: boolean;
    placeholder?: string;
    className?: string;
    caption?: string;
    isRequired?: boolean;
    sizeInput?: NumberInputSize;
    token: SwapDestinationState;
    tokenPriceUSD?: number | null;
  };

const inputWrapperClassName =
  "flex flex-col w-full px-4 py-3 rounded-xl bg-gray-500 cursor-pointer card-border";

const inputClassName =
  "border-none bg-transparent text-white focus:border-blue disabled:bg-transparent disabled:opacity-50 autofill:!bg-transparent autofill:!text-white";

const inputSizeClassName: Record<NumberInputSize, string> = {
  small: "min-h-[1.875rem] rounded-md text-lg font-semibold",
  medium: "min-h-[2.25rem] rounded-md text-lg font-semibold",
  large: "min-h-[2.75rem] rounded-md text-lg font-semibold",
};

export const InputAmountPay: FC<NumberInputProps> = (props) => {
  const {
    placeholder,
    value,
    caption,
    onChange,
    error,
    rightSection,
    sizeInput = "medium",
    type,
    token,
    isRequired,
    tokenPriceUSD,
    ...restProps
  } = props;

  const { address } = useAccount();

  const { data: balance, isLoading } = useBalance({
    address,
    token: (token.address as `0x${string}`) || "",
    chainId: token.chainId || 1,
  });

  const mergedInputGeneratorClassName = clsxMerge(
    inputClassName,
    inputSizeClassName[sizeInput]
  );

  const memoizedBalance = useMemo(() => {
    return formatEtherValue(balance?.value, balance?.decimals);
  }, [balance?.value, balance?.decimals]);

  return (
    <div className={inputWrapperClassName}>
      <div className="flex flex-row w-full items-center justify-between mb-2">
        <div className="text-sm text-left font-bold text-white">{caption}</div>
        <div className="flex flex-row items-center text-sm text-right text-white/60">
          Balance:{" "}
          {isLoading ? (
            <Skeleton
              height="16px"
              width="80px"
              classNames={{ root: "opacity-10" }}
            />
          ) : (
            `${memoizedBalance} ${token.symbol}`
          )}
        </div>
      </div>
      <div className="flex flex-row w-full items-center gap-x-1">
        <div className="flex flex-col relative shrink-0 w-[2rem] h-[2rem]">
          <img
            src={token.logoURI || ""}
            alt={token.name || ""}
            className="rounded-full w-full h-full shrink-0"
          />
          <div className="flex justify-center items-center rounded-full w-[1.125rem] h-[1.125rem] bg-gray-500 px-[0.125rem] py-[0.125rem] absolute right-[-2px] bottom-[-2px]">
            <div className="flex justify-center items-center bg-gray-600 w-full h-full rounded-full">
              {token.chainId && renderNewtworkLogoByChainId(token.chainId)}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <MantineNumberInput
            {...restProps}
            type={type}
            withAsterisk={isRequired}
            placeholder={placeholder}
            rightSection={rightSection}
            value={value}
            min={0}
            onChange={onChange}
            hideControls
            inputWrapperOrder={["label", "input", "description", "error"]}
            classNames={{
              root: "leading-none",
              input: mergedInputGeneratorClassName,
              label:
                "text-xs text-left font-semibold whitespace-nowrap font-body mb-1",
              error: "mt-1",
              description: "text-black/50",
            }}
            error={error}
          />
          <div className="text-xs text-left text-white/50 pl-3">
            ~${calculateTokenCost(value, Number(tokenPriceUSD))}
          </div>
        </div>
      </div>
    </div>
  );
};
