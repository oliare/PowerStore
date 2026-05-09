  import { Link } from "react-router-dom";
  import { useGetProductReviewsQuery } from "../services/reviewsApi";
  import { ChevronRight, Star } from "lucide-react";

  export const ReviewsSection = ({ productId }: { productId: string }) => {
    const { data: reviews, isLoading } = useGetProductReviewsQuery(productId);

    if (isLoading) return <div>Завантаження...</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold font-montserrat">
            Відгуки покупців
          </h2>
          <Link
            to={`/product/${productId}/reviews`}
            className="text-brand-primary font-semibold text-sm"
          >
            Всі відгуки <ChevronRight className="inline-block ml-1" size={16} />
          </Link>
        </div>

        {reviews && reviews.length > 0 ? (
          <div className="grid gap-6 max-h-[300px] overflow-y-auto">
            {reviews.map(
              (review) => (
                console.log("email:", review.userEmail),
                (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900 font-montserrat">
                          {review.userName}
                        </p>
                        <p className="font-medium italic text-gray-400 font-montserrat text-xs mt-1">
                          {review.userEmail}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                        </span>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={
                                s <= review.rating
                                  ? "fill-[#fbde3c] text-[#fbde3c]"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mt-1">
                      {review.comment}
                    </p>
                  </div>
                )
              ),
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-8">
            Для цього товару ще немає відгуків. Будьте першим!
          </p>
        )}
      </div>
    );
  };
