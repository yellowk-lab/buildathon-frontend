import {
  DefinitionNode,
  OperationDefinitionNode,
  OperationTypeNode,
} from "graphql";

export const hasContractDirective = (operation) => {
  const contractDirective = parseContractDirective(operation);
  if (!contractDirective) return false;
  return contractDirective.contract !== "";
};

export const parseContractDirective = (operation) => {
  const definitions = operation.query.definitions;

  const def = definitions.find((definition) =>
    definition.directives.find((directive) => directive.kind === "Directive"),
  );

  if (!def) return undefined;
  const dir = def.directives.find(
    (directive) => directive.kind === "Directive",
  );
  const directiveName = dir.name.value;
  const directiveArgs = dir.arguments;
  const contractName = directiveArgs.find((arg) => arg.name.value === "name")
    ?.value.value;
  if (contractName === "" || contractName === undefined) return undefined;
  // throw new Error(`The @contract directive requires a "name" argument.`);
  if (directiveName === "contract") return { contract: contractName };
};
