import {
  GENERAL_CODES_ERRORS,
  EMAIL_CODES_ERRORS,
  PASSWORD_CODES_ERRORS,
} from "./fields-codes";
import { BaseError } from "./base-error";

export class FieldError extends BaseError {
  static GENERAL_CODES = GENERAL_CODES_ERRORS;
  static EMAIL_CODES = EMAIL_CODES_ERRORS;
  static PASSWORD_CODES = PASSWORD_CODES_ERRORS;

  hasField(fieldName: string) {
    for (let i = 0; i < this.context.graphQLErrors.length; i++) {
      const graphQLError = this.context.graphQLErrors[i];
      const fields = graphQLError.extensions.fields as Record<string, string>;
      for (const key in fields) {
        const errorKey = key.toString();
        if (errorKey.includes(fieldName)) {
          return true;
        }
      }
    }
    return false;
  }
}
