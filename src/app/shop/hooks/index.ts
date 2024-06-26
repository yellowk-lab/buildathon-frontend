import { useEffect } from "react";
import { waitForReceipt } from "thirdweb";

interface UseWaitForTransactionReceiptProps {
  client: any;
  chain: any;
  transactionHash: any;
  onReceipt: () => void;
  pollInterval: number;
  maxAttempts: number;
}

const useWaitForTransactionReceipt = ({
  client,
  chain,
  transactionHash,
  onReceipt,
  pollInterval = 1000,
  maxAttempts = 5,
}: UseWaitForTransactionReceiptProps) => {
  useEffect(() => {
    if (transactionHash) {
      let attempts = 0;

      const checkReceipt = async () => {
        try {
          await waitForReceipt({
            client,
            chain,
            transactionHash,
          });
          onReceipt();
        } catch (error) {
          attempts += 1;
          if (attempts < maxAttempts) {
            setTimeout(checkReceipt, pollInterval);
          } else {
            console.error("Error waiting for transaction receipt:", error);
          }
        }
      };

      checkReceipt();
    }
  }, [transactionHash, client, chain, onReceipt]);
};

export default useWaitForTransactionReceipt;
