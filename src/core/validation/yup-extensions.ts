import * as Yup from "yup";
import parsePhoneNumberFromString from "libphonenumber-js";

Yup.addMethod(Yup.string, "phoneNumber", function (msg: string) {
  return this.test(
    "phone",
    msg || "Please provide a valid phone number",
    (value) => {
      if (!value) {
        return false;
      }
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() || false;
    },
  );
});

declare module "yup" {
  interface StringSchema {
    phoneNumber(message?: string): StringSchema;
  }
}
