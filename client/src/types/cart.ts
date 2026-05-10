export interface CartItemDto {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  stockQuantity: number;
}

export interface SyncCartDto {
  items: CartItemDto[];
}
