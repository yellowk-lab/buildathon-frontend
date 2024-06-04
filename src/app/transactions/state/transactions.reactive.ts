import { makeVar } from "@apollo/client";
import { SendTransactionResult } from "@wagmi/core";

export const pendingTransactionsVar = makeVar<SendTransactionResult[]>([]);
