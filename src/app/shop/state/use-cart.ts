import { useReactiveVar } from "@apollo/client";
import { cartVar } from "./shop.reactive";
import { CartItem, Product } from "../types/product";

export function useCart() {
  const cart = useReactiveVar(cartVar);

  const calculateCartTotal = () =>
    cart.reduce((acc, item) => acc + item.quantity * item.priceInTokens, 0);

  const updateCart = (product: Product, quantity: number) => {
    const existingCartItem = cart.find(
      (cartItem: CartItem) => cartItem.id === product.id
    );

    if (existingCartItem) {
      if (quantity > 0) {
        cartVar(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity } : item
          )
        );
      } else {
        cartVar(cart.filter((item) => item.id !== product.id));
      }
    } else {
      if (quantity > 0) {
        cartVar([...cart, { ...product, quantity }]);
      }
    }
  };

  const resetCart = () => {
    cartVar([]);
  };

  return { cart, updateCart, resetCart, calculateCartTotal };
}
