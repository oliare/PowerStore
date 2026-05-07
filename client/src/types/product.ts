import type { ReviewDto } from "./review";

export interface ProductImageDto {
  id: string;
  image: string;
  displayOrder: number;
}

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  description?: string;
  specifications?: string;
  image?: string;
  rate?: number;
  stockQuantity: number;
  discount?: number;
  categoryName?: string;
  categoryId: string;
  isFavorite: boolean;
  images?: ProductImageDto[];
  brand?: string;
  tags?: string[];
  reviews?: ReviewDto[];
}

export interface ProductDetailsDto {
  product: ProductDto;
  relatedProducts: ProductDto[];
  reviews?: ReviewDto[];
}
