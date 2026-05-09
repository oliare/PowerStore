export interface FavoriteItemDTO {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  addedAt: string;
  stockQuantity: number;
}

export interface ToggleFavoriteRequestDTO {
  productId: string;
}
