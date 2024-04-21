import { renderNewtworkLogoByChainId } from "@/entities/Network";
import { SwapDestinationState } from "@/features/SwapForm/model/types";
import { clsxMerge } from "@/shared/lib/clsxMerge";
import { calculateTokenCost, calculateTokenGetAmount } from "@/shared/lib/utils";
import {
  type InputBaseProps,
  NumberInput as MantineNumberInput,
  type NumberInputProps as MantineNumberInputProps,
} from "@mantine/core";
import {
  useMemo,
  type FC,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

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
    tokenPriceFromUSD?: number | null;
    tokenPriceToUSD?: number | null;
  };

const inputWrapperClassName =
  "flex flex-col w-full px-4 py-3 rounded-xl bg-gray-500 cursor-pointer card-border";

const inputClassName =
  "border-none bg-transparent text-white focus:border-blue disabled:bg-transparent disabled:opacity-50 autofill:!bg-transparent autofill:!text-white";

const inputSizeClassName: Record<NumberInputSize, string> = {
  small: "min-h-[1.875rem] rounded-md",
  medium: "min-h-[2.25rem] rounded-md",
  large: "min-h-[2.75rem] rounded-md text-lg font-semibold",
};

export const InputAmount: FC<NumberInputProps> = (props) => {
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
    tokenPriceFromUSD,
    tokenPriceToUSD,
    ...restProps
  } = props;

  const mergedInputGeneratorClassName = clsxMerge(
    inputClassName,
    inputSizeClassName[sizeInput]
  );

  // const memoizedValue = useMemo(
  //   () =>
  //     calculateTokenGetAmount(
  //       Number(value),
  //       Number(tokenPriceFromUSD),
  //       Number(tokenPriceToUSD)
  //     ),
  //   [value, tokenPriceFromUSD, tokenPriceToUSD]
  // );

  console.log(`value: ${value}`)

  return (
    <div className={inputWrapperClassName}>
      <div className="text-sm text-left font-bold text-white mb-2">
        {caption}
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
            ~${calculateTokenCost(value, Number(tokenPriceToUSD))}
          </div>
        </div>
      </div>
    </div>
  );
};
