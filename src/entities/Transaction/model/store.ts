import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  PendingTransactionStoreState,
  PendingTransactionStoreAction,
  PendingTransaction,
} from "./types";
import { pendingTransactionsStateDefault } from "../lib/consts";

const initialState: PendingTransactionStoreState = {
  ...pendingTransactionsStateDefault,
};

export const usePendingTransactionStore = create<
  PendingTransactionStoreState & PendingTransactionStoreAction
>()(
  persist(
    (set) => ({
      ...initialState,
      setTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      updateTransaction: (txHash, isCompleted) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.txHash === txHash
              ? { ...transaction, isCompleted }
              : transaction
          ),
        })),
      clearTransactions: () => set({ ...initialState }, false),
    }),
    { name: "pendingTransactions" }
  )
);

export const addTransaction = (transaction: PendingTransaction) =>
  usePendingTransactionStore.getState().setTransaction(transaction);
