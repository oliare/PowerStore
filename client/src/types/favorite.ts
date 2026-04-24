export interface FavoriteItemDTO {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  addedAt: string;
}

export interface ToggleFavoriteRequestDTO {
  productId: string;
}
