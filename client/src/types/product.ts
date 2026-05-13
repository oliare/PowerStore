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
  categoryName?: string;
  categoryId: string;
  isFavorite: boolean;
  images?: ProductImageDto[];
  brand?: string;
  tags?: string[];
  reviews?: ReviewDto[];
  discountPercentage?: number;
  isOnSale: boolean;
  discountPrice: number | null;
}

export interface ProductDetailsDto {
  product: ProductDto;
  relatedProducts: ProductDto[];
  reviews?: ReviewDto[];
}

export interface ProductStockDto {
  productId: string;
  stockQuantity: number;
  isAvailable: boolean;
}

export function getActualPrice(
  product: Pick<ProductDto, "price" | "isOnSale" | "discountPrice">,
): number {
  return product.isOnSale &&
    product.discountPrice != null &&
    product.discountPrice > 0
    ? product.discountPrice
    : product.price;
}

export function hasActiveDiscount(
  product: Pick<ProductDto, "price" | "isOnSale" | "discountPrice">,
): boolean {
  return (
    product.isOnSale &&
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
  );
}
