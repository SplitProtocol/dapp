import { clsxMerge } from "@/shared/lib/clsxMerge";
import { FC, PropsWithChildren } from "react";

type ContainerProps = {
  isRow?: boolean;
  className?: string;
};

const containerClassName = "flex w-full max-w-[83.25rem] px-4";

export const Container: FC<PropsWithChildren<unknown> & ContainerProps> = (props) => {
  const { isRow = false, className, children } = props
  const mergedClassNames = clsxMerge(
    containerClassName,
    isRow ? "flex-row" : "flex-col",
    className
  );
  return <div className={mergedClassNames}>{children}</div>;
};
