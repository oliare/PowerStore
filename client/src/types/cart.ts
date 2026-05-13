export interface CartItemDto {
  productId: string;
  productName: string;
  productImage: string;
  price: number;         
  isOnSale?: boolean;
  discountPrice?: number | null; 
  discountPercentage?: number;
  quantity: number;
  stockQuantity: number;
}

export interface SyncCartDto {
  items: CartItemDto[];
}