import { NumberFormatOptions } from "../types/formater";

const decimalFormatter = (decimals = 2): Intl.NumberFormat => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: decimals,
  });
};

const accountingFormater = (
  decimals = 0,
  currency = "USD",
): Intl.NumberFormat => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: decimals,
  });
};

const formatters = {
  number: decimalFormatter,
  accounting: accountingFormater,
};

export default function numberFormater(
  amount: number,
  { type = "number", decimals, currency }: NumberFormatOptions,
) {
  let formatter = formatters[type](decimals, currency);
  if (isNaN(amount)) {
    return formatter.format(0);
  }
  return formatter.format(amount);
}

export function capitalizeFirstLetter(inputString: string): string {
  if (typeof inputString !== "string" || inputString.length === 0) {
    return inputString;
  }
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}
