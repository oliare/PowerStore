import { useParams, useNavigate } from "react-router-dom";
import { useGetProductReviewsQuery } from "../services/reviewsApi";
import { Star, ChevronLeft, MessageSquare, Filter } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { useAuthMeQuery } from "../hooks/useAuthMe";

export const ProductReviewsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: reviews, isLoading } = useGetProductReviewsQuery(
    productId ?? "",
  );
  const { data: user } = useAuthMeQuery();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen animate-pulse text-gray-400">
        Завантаження...
      </div>
    );

  const averageRating = reviews?.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : 0;

  const hasAlreadyReviewed =
    reviews?.some((review) => review.userId === user?.id) ?? false;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-gray-500 hover:text-black transition-colors mb-6 text-sm font-medium"
          >
            <ChevronLeft
              size={20}
              className="mr-1 group-hover:-translate-x-1 transition-transform"
            />
            Назад до товару
          </button>

          <div className="flex flex-col md:flex-row md:items-top justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 font-montserrat">
                Відгуки покупців
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Що кажуть люди, які вже придбали цей товар
              </p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <span className="text-gray-400 block uppercase tracking-wider font-semibold text-[10px]">
                  Середній бал
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-gray-900 font-manrope">
                    {averageRating}
                  </span>
                  <Star size={20} className="fill-[#fbd53c] text-[#fbd53c]" />
                </div>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-right">
                <span className="text-gray-400 block uppercase tracking-wider font-semibold text-[10px]">
                  Відгуків
                </span>
                <span className="text-xl font-black text-gray-900 font-manrope">
                  {reviews?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-6 sticky top-8">
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={18} /> Фільтрація
              </h3>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-gray-100 text-gray-600 hover:text-black"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{star} зірок</span>
                      <div className="flex gap-0.5">
                        {[...Array(star)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="fill-current text-[#fbd53c]"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-brand-primary font-manrope">
                      {reviews?.filter((r) => r.rating === star).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {hasAlreadyReviewed ? (
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-8 flex flex-col items-center text-center font-montserrat">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
                  <Star size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Дякуємо за ваш відгук!
                </h3>
                <p className="text-gray-500 text-xs">
                  Ви вже поділилися своїми враженнями про цей товар. Ваша думка
                  допомагає іншим покупцям зробити правильний вибір.
                </p>
              </div>
            ) : (
              <ReviewForm
                productId={productId ?? ""}
                hasAlreadyReviewed={hasAlreadyReviewed}
              />
            )}{" "}
          </div>

          <div className="lg:col-span-8">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="group relative">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg uppercase">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg leading-tight">
                            {review.userName}
                          </h4>
                          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase font-manrope">
                            {new Date(review.createdAt).toLocaleDateString(
                              "uk-UA",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mt-3 sm:mt-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={18}
                            className={
                              s <= review.rating
                                ? "fill-[#fbd53c] text-[#fbd53c]"
                                : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment ? (
                      <div className="ml-0 sm:ml-16 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-brand-primary/20 transition-all duration-300">
                        <p className="text-gray-700 leading-relaxed font-montserrat italic">
                          "{review.comment}"
                        </p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-28 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <MessageSquare
                  className="mx-auto text-gray-300 mb-10"
                  size={48}
                />
                <p className="text-gray-500 font-montserrat text-sm italic">
                  Відгуків поки немає. Будьте першим, хто залишить свій
                  коментар!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
