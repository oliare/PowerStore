import type { RootState } from "../store/store";
import { Star, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddReviewMutation } from "../services/reviewsApi";
import { showNotify } from "../utils/showNotify";
import { openAuthModal } from "../store/uiSlice";

interface ReviewFormProps {
  productId: string;
  hasAlreadyReviewed?: boolean;
}

interface FormErrors {
  rating?: string;
  comment?: string;
}

export const ReviewForm = ({
  productId,
  hasAlreadyReviewed,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState({ rating: false, comment: false });

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

  // Функція валідації
  const validateForm = (
    currentRating: number,
    currentComment: string,
  ): boolean => {
    const tempErrors: FormErrors = {};

    if (currentRating === 0) {
      tempErrors.rating = "Будь ласка, оберіть кількість зірок";
    }

    const trimmedComment = currentComment.trim();
    if (!trimmedComment) {
      tempErrors.comment = "Напишіть текст вашого відгуку";
    } else if (trimmedComment.length < 5) {
      tempErrors.comment = `Відгук занадто короткий (мінімум 5 символів, зараз: ${trimmedComment.length})`;
    } else if (trimmedComment.length > 500) {
      tempErrors.comment = "Відгук не може перевищувати 500 символів";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRatingClick = (star: number) => {
    if (hasAlreadyReviewed) return;
    setRating(star);
    setIsTouched((prev) => ({ ...prev, rating: true }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComment(value);

    if (isTouched.comment) {
      validateForm(rating, value);
    }
  };

  const handleCommentBlur = () => {
    setIsTouched((prev) => ({ ...prev, comment: true }));
    validateForm(rating, comment);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAlreadyReviewed) return;
    if (!requireAuth()) return;

    setIsTouched({ rating: true, comment: true });

    const isValid = validateForm(rating, comment);
    if (!isValid) return;

    try {
      await addReview({ productId, rating, comment: comment.trim() }).unwrap();
      showNotify.success("Дякуємо! Ваш відгук успішно додано!");
      setRating(0);
      setComment("");
      setErrors({});
      setIsTouched({ rating: false, comment: false });
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
        <h3 className="text-xl font-semibold text-gray-900">Залишити відгук</h3>

        <div className="space-y-1">
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`transition-all duration-150 ${
                  star <= (hover || rating)
                    ? "fill-[#fbd53c] text-[#fbd53c] scale-105"
                    : "text-gray-200"
                } cursor-pointer active:scale-95`}
                onMouseEnter={() => !hasAlreadyReviewed && setHover(star)}
                onMouseLeave={() => !hasAlreadyReviewed && setHover(0)}
                onClick={() => handleRatingClick(star)}
              />
            ))}
          </div>
          {errors.rating && (
            <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1 animate-fadeIn">
              <AlertCircle size={14} />
              <span>{errors.rating}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <textarea
            className={`w-full text-sm p-4 border rounded-xl outline-none min-h-[9.3rem] transition-all ${
              errors.comment
                ? "border-red-400 focus:border-red-500 bg-red-50/10 shadow-sm shadow-red-100"
                : "border-gray-200 focus:border-brand-primary focus:shadow-sm"
            }`}
            placeholder="Напишіть, що ви думаєте про цей товар..."
            value={comment}
            onChange={handleCommentChange}
            onBlur={handleCommentBlur}
            disabled={hasAlreadyReviewed || isLoading}
          />
          <div className="flex justify-between items-center px-1">
            {errors.comment ? (
              <div className="flex items-center gap-1.5 text-red-500 text-xs animate-fadeIn">
                <AlertCircle size={14} />
                <span>{errors.comment}</span>
              </div>
            ) : (
              <div />
            )}
            <span
              className={`text-[11px] font-manrope ${comment.length > 500 ? "text-red-500 font-bold" : "text-gray-400"}`}
            >
              {comment.length}/500
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || hasAlreadyReviewed}
          className="w-full py-2.5 bg-brand-primary text-white font-semibold rounded-full hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:pointer-events-none flex justify-center items-center gap-2 shadow-sm"
        >
          {isLoading ? "Надсилається..." : "Опублікувати"}
        </button>
      </form>

      {hasAlreadyReviewed && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
          <div className="bg-white/90 backdrop-blur-sm border border-brand-primary/20 p-5 rounded-2xl shadow-xl max-w-xs transform -translate-y-2">
            <p className="text-brand-primary font-semibold text-sm leading-relaxed">
              Ви вже залишили відгук для цього товару
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
