export interface ReviewDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment?: string;
}
