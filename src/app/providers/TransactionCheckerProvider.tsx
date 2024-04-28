import { PendingTransaction, usePendingTransactionStore } from "@/entities/Transaction";
import { useWeb3 } from "@/shared/lib/useWeb3";
import { FC, PropsWithChildren, useEffect } from "react";

export const TransactionCheckerProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { checkTransactionByHash } = useWeb3();
  const { transactions, updateTransaction } = usePendingTransactionStore();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (transactions.length) {
      timer = setTimeout(() => {
        transactions.forEach(async(item: PendingTransaction) => {
          if (!item.isCompleted) {
            await checkTransactionByHash(item.txHash, updateTransaction)
          }
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [checkTransactionByHash, transactions, updateTransaction])
  return <>{children}</>
}