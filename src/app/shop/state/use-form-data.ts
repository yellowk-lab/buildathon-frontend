import { useReactiveVar } from "@apollo/client";
import { checkoutFormDataVar, defaultCheckoutState } from "./shop.reactive";
import { CheckoutFormData } from "../types/checkout-form-data";

export const useFormData = () => {
  const formData = useReactiveVar(checkoutFormDataVar);

  const updateFormData = (newData: Partial<CheckoutFormData>) => {
    checkoutFormDataVar({ ...formData, ...newData });
  };

  const resetFormData = () => updateFormData(defaultCheckoutState);

  return { formData, updateFormData, resetFormData };
};
