import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { TokenChartStoreState, TokenChartStoreAction } from "./types";

const initialState: TokenChartStoreState = {
  isExpertMode: false,
  symbols: null,
};

export const useTokenChartStore = create<
  TokenChartStoreState & TokenChartStoreAction
>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setIsExpertMode: (value) =>
          set({ isExpertMode: value }, false, "tokenChart/setIsExpertMode"),
        setSymbols: (value) =>
          set({ symbols: value }, false, "tokenChart/setSymbols"),
        dropChart: () => set(initialState),
      }),
      { name: "user" }
    )
  )
);
