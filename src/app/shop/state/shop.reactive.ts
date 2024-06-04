import { makeVar } from "@apollo/client";
import { CartItem } from "../types/product";
import { CheckoutFormData } from "../types/checkout-form-data";

export const cartVar = makeVar<CartItem[]>([]);

export const checkoutFormDataVar = makeVar<CheckoutFormData>({
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
});
