import { FC } from "react";
import { useTokenChart } from "../lib/useTokenChart";

type TokenChartProps = {
  chain: number;
};

export const TokenChart: FC<TokenChartProps> = (props) => {
  const { chain } = props;
  const { containerRef, pairAddress } = useTokenChart(chain);

  if (!pairAddress) {
    return <div className="flex flex-col w-full flex-1 items-center justify-center text-white">No data :(</div>
  }

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};
