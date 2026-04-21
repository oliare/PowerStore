export interface FavoriteItemDTO {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  stockStatus: "in_stock" | "out_of_stock";
  createdAt: string;
}

export interface ToggleFavoriteRequestDTO {
  productId: string;
}