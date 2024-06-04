import { useReactiveVar } from "@apollo/client";
import { checkoutFormDataVar } from "./shop.reactive";
import { CheckoutFormData } from "../types/checkout-form-data";

export const useFormData = () => {
  const formData = useReactiveVar(checkoutFormDataVar);

  const updateFormData = (newData: Partial<CheckoutFormData>) => {
    checkoutFormDataVar({ ...formData, ...newData });
  };

  return { formData, updateFormData };
};
