import { pendingTransactionsVar } from "./transactions.reactive";
import { Hash, SendTransactionResult } from "@wagmi/core";

export function addPendingTransaction(tx: SendTransactionResult) {
  const currentPendingTransactions = pendingTransactionsVar();
  pendingTransactionsVar([...currentPendingTransactions, tx]);
}

export function removePendingTransactions(txHash: Hash) {
  const currentPendingTransactions = pendingTransactionsVar();
  const updatedPendingTransactions = currentPendingTransactions.filter(
    (tx) => tx.hash !== txHash,
  );
  pendingTransactionsVar(updatedPendingTransactions);
}
