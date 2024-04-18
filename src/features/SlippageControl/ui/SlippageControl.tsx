import { useEffect, type ChangeEvent, type FC } from "react";

import {
  RadioButton,
  type RadioButtonSize,
} from "@/shared/ui/Radio/RadioButton";
import { NumberInput } from "@mantine/core";
import { clsxMerge } from "@/shared/lib/clsxMerge";

type SlippageControlProps = {
  name: string;
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  size: RadioButtonSize;
  disabled?: boolean;
  isDivided?: boolean;
};

const groupWrapperClassName = "flex flex-col justify-start items-start";

const groupRowClassName = "flex flex-row items-stretch";

const groupLabelClassName = "text-sm text-left font-semibold text-black mb-1";

const inputClassName =
  "text-white bg-transparent w-full text-sm py-1 px-[1.125rem] min-h-[2.25rem] rounded-lg border-gray-600";

export const SlippageControl: FC<SlippageControlProps> = (props) => {
  const { name, items, value, onChange, label, size, disabled } = props;

  const isActiveCustomSlippage =
    value !== "0.1" && value !== "0.5" && value !== "1.0";

  const mergedClassNames = clsxMerge(
    inputClassName,
    isActiveCustomSlippage && "border-primary"
  );

  useEffect(() => {
    if (!Number.isNaN(value) && Number(value) > 100) {
      onChange('100');
    }
  }, [onChange, value])

  const handleCustomSlipapage = (value: string | number) => {
    if (Number(value) > 100) return onChange('100')
    onChange(value.toString());
  };

  const handleRadioSlipapage = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <div className={groupWrapperClassName}>
      {label && <div className={groupLabelClassName}>{label}</div>}
      <div className={groupRowClassName}>
        {items.map((item) => (
          <RadioButton
            name={name}
            key={item.value}
            value={item.value}
            label={item.label}
            onChange={handleRadioSlipapage}
            size={size}
            checked={value === item.value}
            disabled={disabled}
            isDivided
          />
        ))}
        <NumberInput
          name={name}
          placeholder="1.5%"
          hideControls
          min={0}
          max={100}
          clampBehavior="strict"
          decimalSeparator="."
          allowNegative={false}
          value={value}
          valueIsNumericString
          onChange={handleCustomSlipapage}
          classNames={{
            input: mergedClassNames,
          }}
        />
      </div>
    </div>
  );
};
