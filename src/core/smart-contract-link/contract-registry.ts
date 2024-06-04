import { Address } from "wagmi";

interface Contract {
  address: Address;
  abi: any[];
}

export class ContractRegistry {
  private static instance: ContractRegistry;
  private registry: Record<string, Contract>;

  private constructor() {
    this.registry = {};
  }

  public static getInstance(): ContractRegistry {
    if (!ContractRegistry.instance) {
      ContractRegistry.instance = new ContractRegistry();
    }
    return ContractRegistry.instance;
  }

  public register(
    name: string,
    address: Address | undefined,
    abi: any[],
  ): void {
    if (typeof address !== "string") {
      throw new Error(`Contract ${name} has an invalid address`);
    }
    this.registry[name] = { address, abi };
  }

  public get(name: string): Contract {
    const contract = this.registry[name];
    if (!contract) {
      throw new Error(`Contract '${name}' not found in registry`);
    }
    return contract;
  }
}

export default ContractRegistry.getInstance();
