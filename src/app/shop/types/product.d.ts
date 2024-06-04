export interface Product {
  id: string;
  title: string;
  priceInTokens: number;
  stock: number;
  initial_stock: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}
