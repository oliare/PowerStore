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
}

export interface ProductDetailsDto {
  product: ProductDto;
  relatedProducts: ProductDto[];
}
