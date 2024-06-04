import { useEffect } from "react";
import { waitForTransaction } from "@wagmi/core";
import { usePendingTransactions } from "../state";
import { useProvider } from "wagmi";
import { useMutation } from "@apollo/client";
import { Button, CircularProgress } from "@mui/material";

export default function PendingTransactionsWatcher() {
  const provider = useProvider();
  const { pendingTransactions, removePendingTransactions } =
    usePendingTransactions();

  useMutation;

  useEffect(() => {
    async function checkTransactionConfirmation(tx) {
      const receipt = await waitForTransaction({ hash: tx.hash });
      if (receipt.status) {
        removePendingTransactions(tx.hash);
      }
    }

    if (pendingTransactions?.length > 0) {
      const currentTransaction = pendingTransactions[0];
      checkTransactionConfirmation(currentTransaction);
    }
  }, [provider, pendingTransactions]);

  return pendingTransactions?.length > 0 ? (
    <Button variant="contained" small sx={{ py: 1, px: 3 }}>
      <CircularProgress size={20} color="inherit" sx={{ mr: 2 }} />
      {`${pendingTransactions.length} Pending`}
    </Button>
  ) : null;
}
