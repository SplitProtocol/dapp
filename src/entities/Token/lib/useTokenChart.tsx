import { useEffect, useRef } from "react";
import { useFetchTokenChartData } from "../api/tokenApi";
import { useTokenChartStore } from "..";
import { newtworkName } from "@/entities/Network";

export const useTokenChart = (chaindId: number) => {
  const { symbols } = useTokenChartStore();
  const { data: pairAddress, isLoading } = useFetchTokenChartData(
    symbols,
    chaindId
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !containerRef.current?.querySelector("iframe") &&
      pairAddress?.pairAddress
    ) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://dexscreener.com/${
        newtworkName[chaindId as keyof typeof newtworkName]
      }/${pairAddress.pairAddress}?embed=1&theme=dark&trades=0&info=0`;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      containerRef.current?.appendChild(iframe);
    }
  }, [pairAddress]);

  return {
    containerRef,
    isLoading,
    pairAddress,
  };
};
