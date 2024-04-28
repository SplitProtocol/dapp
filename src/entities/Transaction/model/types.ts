export type PendingTransaction = {
  txHash: string;
  isCompleted: boolean;
  chainId: number;
}

export type PendingTransactionStoreState = {
  transactions: PendingTransaction[];
}

export type PendingTransactionStoreAction = {
  setTransaction: (transaction: PendingTransaction) => void;
  updateTransaction: (txHash: string, isCompleted: boolean) => void;
  clearTransactions: () => void;
}