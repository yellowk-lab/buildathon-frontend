import { makeVar } from "@apollo/client";
import { CartItem } from "../types/product";
import { CheckoutFormData } from "../types/checkout-form-data";

export const cartVar = makeVar<CartItem[]>([]);

export const defaultCheckoutState = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  email: "",
  lootNftId: "",
  lootName: "",
};
export const checkoutFormDataVar =
  makeVar<CheckoutFormData>(defaultCheckoutState);
