import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  ImportedTokensStoreAction,
  ImportedTokensStoreState,
} from "./types";
import { importedTokensStateDefault } from "../lib/consts";

const initialState: ImportedTokensStoreState = {
  ...importedTokensStateDefault,
};

export const useImportedTokensStore = create<
  ImportedTokensStoreState & ImportedTokensStoreAction
>()(
  persist(
    (set) => ({
      ...initialState,
      addImportedToken: (token) =>
        set((state) => ({
          importedTokens: [...state.importedTokens, token],
        })),
      clearImportedTokens: () => set({ ...initialState }, false),
    }),
    { name: "importedTokens" }
  )
);
