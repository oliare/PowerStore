import { Star } from "lucide-react";
import type { ReviewDto } from "../types/review";
import type { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../store/uiSlice";

interface ProductReviewStatsProps {
  rate: ReviewDto[];
  onWriteReviewClick: () => void;
  hasAlreadyReviewed: boolean;
}

export const ProductReviewStats = ({
  rate: reviews,
  onWriteReviewClick,
  hasAlreadyReviewed,
}: ProductReviewStatsProps) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.account);

  const requireAuth = () => {
    if (!auth.isAuth) {
      dispatch(openAuthModal("Потрібна авторизація"));
      return false;
    }
    return true;
  };

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
          2,
        )
      : "0.00";

  const counts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="flex flex-col w-full max-w-[400px] font-montserrat">
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-900">
          Оцінка користувачів{" "}
          <span className="font-bold font-manrope">{averageRating}/5</span>
          <Star
            className="inline-block ml-1 fill-[#fbd53c] text-[#fbd53c] mb-1"
            size={20}
          />
        </h3>
        <p className="text-gray-500 text-sm">
          на основі {totalReviews} відгуків
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-6 font-manrope">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star as keyof typeof counts];
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-6">
                <span className="text-sm text-gray-700">{star}</span>
                <Star className="fill-[#fbd53c] text-[#fbd53c]" size={14} />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#fbd53c] rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-6 text-right">
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (!requireAuth()) return;
          onWriteReviewClick();
        }}
        className={`w-full py-2 border-2 mt-4 font-semibold rounded-full transition-all duration-300 ${
          hasAlreadyReviewed
            ? "border-gray-200 text-gray-400 cursor-default bg-gray-50"
            : "border-brand-primary text-brand-primary hover:bg-brand-primary/10 hover:text-brand-dark"
        }`}
      >
        {hasAlreadyReviewed ? "Відгук вже надіслано" : "Залишити відгук"}
      </button>
    </div>
  );
};
