import { useReactiveVar } from "@apollo/client";
import { pendingTransactionsVar } from "./transactions.reactive";
import {
  addPendingTransaction,
  removePendingTransactions,
} from "./transactions.utils";
import { Hash, SendTransactionResult } from "@wagmi/core";
import { useSnackbar } from "notistack";

export function usePendingTransactions() {
  const pendingTransactions = useReactiveVar(pendingTransactionsVar);

  const { enqueueSnackbar } = useSnackbar();

  const _addPendingTransaction = (tx: SendTransactionResult) => {
    addPendingTransaction(tx);
    enqueueSnackbar(`Tx ${tx.hash} sent.`, {
      variant: "info",
      preventDuplicate: true,
    });
  };

  const _removePendingTransaction = (txHash: Hash) => {
    removePendingTransactions(txHash);
    enqueueSnackbar(`Tx ${txHash} success.`, {
      variant: "success",
      preventDuplicate: true,
    });
  };

  return {
    addPendingTransaction: _addPendingTransaction,
    removePendingTransactions: _removePendingTransaction,
    pendingTransactions,
  };
}
