import type { RootState } from "../store/store";
import { Star } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddReviewMutation } from "../services/reviewsApi";
import { showNotify } from "../utils/showNotify";
import { openAuthModal } from "../store/uiSlice";

interface ReviewFormProps {
  productId: string;
  hasAlreadyReviewed?: boolean;
}

export const ReviewForm = ({
  productId,
  hasAlreadyReviewed,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const [addReview, { isLoading }] = useAddReviewMutation();
  const { auth } = useSelector((state: RootState) => state.account);

  const requireAuth = () => {
    if (!auth.isAuth) {
      dispatch(openAuthModal("Потрібна авторизація"));
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAlreadyReviewed) return;
    if (!requireAuth()) return;
    if (rating === 0) return showNotify.error("Будь ласка, поставте оцінку");

    try {
      await addReview({ productId, rating, comment }).unwrap();
      showNotify.success("Дякуємо! Ваш відгук успішно додано!");
      setRating(0);
      setComment("");
    } catch {
      showNotify.error("Не вдалося додати відгук...");
    }
  };

  return (
    <div id="review-form" className="relative group">
      <form
        onSubmit={handleSubmit}
        className={`space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm font-montserrat transition-all ${
          hasAlreadyReviewed
            ? "opacity-40 grayscale pointer-events-none select-none"
            : ""
        }`}
      >
        <h3 className="text-xl font-semibold">Залишити відгук</h3>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              className={`transition-colors ${
                star <= (hover || rating)
                  ? "fill-[#fbd53c] text-[#fbd53c]"
                  : "text-gray-200"
              } cursor-pointer`}
              onMouseEnter={() => !hasAlreadyReviewed && setHover(star)}
              onMouseLeave={() => !hasAlreadyReviewed && setHover(0)}
              onClick={() => !hasAlreadyReviewed && setRating(star)}
            />
          ))}
        </div>

        <textarea
          className="w-full text-sm p-4 border border-gray-200 rounded-xl outline-none focus:border-brand-primary min-h-[9.3rem] transition-all"
          placeholder="Напишіть, що ви думаєте про цей товар..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={hasAlreadyReviewed || isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || hasAlreadyReviewed}
          className="w-full py-2 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-all active:scale-95 disabled:bg-gray-300"
        >
          {isLoading ? "Надсилається..." : "Опублікувати"}
        </button>
      </form>

      {hasAlreadyReviewed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="bg-white/80 backdrop-blur-sm border border-brand-primary/20 p-4 rounded-xl shadow-lg">
            <p className="text-brand-primary font-bold text-sm">
              Ви вже залишили відгук для цього товару
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
