import {
  ApolloLink,
  FetchResult,
  NextLink,
  Operation,
  Observable,
} from "@apollo/client";
import {
  prepareWriteContract,
  writeContract,
  readContract,
  waitForTransaction,
  InjectedConnector,
  connect,
  createClient,
  configureChains,
  Chain,
} from "@wagmi/core";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { publicProvider } from "@wagmi/core/providers/public";
import * as allChains from "new-wagmi-core/chains";
import { ChainName, network, services } from "@core/config";
import contractRegistry, {
  ContractRegistry,
} from "@core/smart-contract-link/contract-registry";
import { parseContractDirective } from "./helpers";
import {
  DefinitionNode,
  FieldNode,
  OperationDefinitionNode,
  OperationTypeNode,
  SelectionNode,
} from "graphql";

// TODO: Should be injected.
//       Client and provider creation should be the same than for the "client" side.
const { provider, webSocketProvider } = configureChains(
  network.supportedChains.map(
    (chainName: ChainName) => allChains[chainName] as unknown as Chain
  ),
  [
    alchemyProvider({ apiKey: services.alchemy.API_KEY || "" }),
    publicProvider(),
  ]
);

createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

// TODO: Should be injected
const injected: InjectedConnector = new InjectedConnector();

type ContractArgs = Record<string, any>;

interface NamedKey {
  name: string;
  index: number;
}

interface ContractDirective {
  contract?: string;
  method?: string;
  args?: ContractArgs;
}

export class SmartContractLink extends ApolloLink {
  // TODO: This should be injected
  // contractRegistry = ContractRegistry.getInstance();

  constructor(configCallback: (registry: ContractRegistry) => void) {
    super();
    configCallback(contractRegistry);
  }

  public request(
    operation: Operation,
    forward?: NextLink
  ): Observable<FetchResult> | null {
    const definitionNode = operation.query.definitions[0];
    if (!isOperationDefinitionNode(definitionNode)) {
      throw new Error("Wrong operation type.");
    }
    const operationType = definitionNode.operation;

    const directive: ContractDirective | undefined =
      parseContractDirective(operation);
    const { value } = operation.variables;

    const contractName = directive?.contract;

    if (!contractName)
      throw new Error("No contractName found on @contract directive.");

    const selectionNode = definitionNode.selectionSet.selections[0];
    if (!isFieldNode(selectionNode)) throw new Error("Not a filed node.");

    const method = directive?.method ?? selectionNode?.name.value;

    const contract = contractRegistry.get(contractName);
    const args = Object.values(operation.variables);

    if (operationType === "query") {
      return new Observable((observer) => {
        (async function () {
          try {
            const data = await readContract({
              address: contract.address,
              abi: contract.abi,
              functionName: method,
              args: args,
            });

            const uniqueIdentifier = `${contractName}:${method}`;
            let response = {
              [uniqueIdentifier]: {
                rawOutputs: data,
              },
            };

            if (Array.isArray(data)) {
              const objectKeys = Object.keys(data);
              const hasNamedKeys = objectKeys.length > data.length;
              if (hasNamedKeys) {
                const namedKeys: NamedKey[] = [];
                objectKeys.forEach((key, index) => {
                  if (isNaN(Number(key))) namedKeys.push({ name: key, index });
                });

                let dataAsObject: Record<string, unknown> = {};
                namedKeys.forEach((key) => {
                  dataAsObject = {
                    ...dataAsObject,
                    [key.name]: data[key.name],
                  };
                });
                response = {
                  [uniqueIdentifier]: {
                    rawOutputs: data,
                    ...dataAsObject,
                  },
                };
              }
            }

            observer.next({
              data: { [uniqueIdentifier]: response[uniqueIdentifier] },
            });
            observer.complete();
          } catch (error) {
            console.error(error);
            observer.error(error);
          }
        })();
      });
    }

    if (operationType === "mutation") {
      return new Observable((observer) => {
        (async function () {
          if (await injected.isAuthorized()) {
            console.log("InjectedConnector is already connected.");
          } else {
            console.log("Connecting InjectedConnector");
            await connect({ connector: injected });
          }

          try {
            const config = await prepareWriteContract({
              address: contract.address,
              abi: contract.abi,
              functionName: method,
              args: [...args],
              overrides: {
                value,
                gasLimit: 1000000, // TODO Make this attribute settable as well as the gasPrice.
              },
            });
            // TODO: Add an option to ask for the transaction with confirmation instead of just returning the hash.
            // const { hash } = await writeContract(config);
            // const transaction = await waitForTransaction({
            //   hash,
            // });
            const transaction = await writeContract(config);
            const response = {
              [method]: {
                hash: transaction.hash,
                transaction: transaction,
              },
            };
            observer.next({ data: response });
            observer.complete();
          } catch (error) {
            console.error(error);
            observer.error(error);
          }
        })();
      });
    }

    if (!forward) throw new Error("Forward function is not defined");

    return forward(operation);
  }
}

// Type guard to check if the definitionNode is an OperationDefinitionNode
export function isOperationDefinitionNode(
  node: DefinitionNode
): node is OperationDefinitionNode {
  return node.kind === "OperationDefinition";
}

// Type guard to check if the selectionNode is a FieldNode
function isFieldNode(node: SelectionNode): node is FieldNode {
  return node.kind === "Field";
}

export default SmartContractLink;
