import type { ProductDto } from "./product";
export interface FavoriteItemDTO {
  id: string;
  addedAt: string;
  product: ProductDto;
}

export interface ToggleFavoriteRequestDTO {
  productId: string;
}
