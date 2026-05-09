import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../services/productApi";
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  RefreshCcw,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { MailingSection } from "./HomePage/MailingSection";
import type { ProductDto } from "../types/product";
import { addToCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import type { CartItemDto } from "../types/cart";
import { FavoriteButton } from "../common/FavoriteButton";
import { showNotify } from "../utils/showNotify";
import { StockStatus } from "../common/StockStatus";
import { ProductSpecifications } from "../common/ProductSpecifications";
import { ReviewForm } from "./ReviewForm";
import { ReviewsSection } from "./ReviewsSection";
import { ProductReviewStats } from "../common/ProductReviewStats";
import { useGetMeQuery } from "../services/userApi";
import { useGetProductReviewsQuery } from "../services/reviewsApi";

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetProductDetailsQuery(id!);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { data: user } = useGetMeQuery();
  const { data: reviews } = useGetProductReviewsQuery(id!);

  if (isLoading)
    return (
      <div className="p-20 text-center font-black text-brand-primary animate-pulse">
        Завантаження...
      </div>
    );

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto py-12 min-h-screen">
        <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4">
          <button
            onClick={() => navigate("/shop")}
            className="absolute top-0 md:left-4 flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Назад до магазину
          </button>

          <div className="flex flex-col items-center text-center max-w-sm">
            <div className="text-red-400 mb-4">
              <AlertCircle size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Товар не знайдено
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Не вдалося завантажити дані. Перевірте з'єднання або спробуйте
              пізніше.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              <RefreshCcw size={16} />
              Оновити сторінку
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { product, relatedProducts } = data;

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = (product: ProductDto, selectedQuantity: number) => {
    const image =
      product.images && product.images.length > 0
        ? product.images[0].image
        : "";

    const finalImage = product.image || image;

    const item: CartItemDto = {
      productId: product.id,
      productName: product.name,
      productImage: finalImage,
      price: product.price,
      quantity: selectedQuantity,
    };

    dispatch(addToCart(item));
    showNotify.success(`"${product.name}" додано до кошика!`);
  };

  const scrollToDescription = () => {
    setActiveTab("description");
    if (detailsSectionRef.current) {
      const offset = 100;
      const top =
        detailsSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const parseSpecs = (specsString: string | null | undefined) => {
    if (!specsString || specsString === "[]") return [];
    try {
      const parsed = JSON.parse(specsString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Помилка парсингу характеристик", e);
      return [];
    }
  };

  const productSpecs = parseSpecs(product.specifications);
  const isLongDescription = (product.description?.length || 0) > 241;
  const displayDescription = isLongDescription
    ? `${product.description?.substring(0, 241)}...`
    : product.description;

  const hasAlreadyReviewed =
    reviews?.some((review) => review.userId === user?.id) ?? false;

  const averageRating = reviews?.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white font-manrope">
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen mb-10">
        <Link
          to="/shop"
          className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors font-medium mb-10"
        >
          <ArrowLeft size={20} />
          Назад до магазину
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 order-2 md:order-1">
              {product.images?.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image)}
                  className={`w-20 h-20 border-2 rounded-xl p-1 transition-all ${
                    activeImage === img.image
                      ? "border-brand-primary"
                      : "border-gray-100"
                  }`}
                >
                  <img
                    src={img.image}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 p-8 flex items-center justify-center order-1 md:order-2">
              <img
                src={activeImage || product.images?.[0]?.image || ""}
                alt={product.name}
                className="max-h-[450px] w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6 mt-3 text-sm">
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={
                      i < Math.round(averageRating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-500">
                {reviews?.length
                  ? `${averageRating.toFixed(1)} (${reviews.length} відгуків)`
                  : "Немає відгуків"}
              </span>
              <StockStatus quantity={product.stockQuantity} />
            </div>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              {/* <span className="text-gray-400 line-through text-lg font-light">
                ₴{oldPrice}
              </span> */}
              <span className="text-3xl font-semibold text-brand-primary">
                ₴ {product.price}
              </span>
              {/* <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-medium">
                64% Знижка
              </span> */}
            </div>

            <div className="text-sm flex items-center gap-4 mb-6">
              <span className="text-gray-900 font-semibold">Бренд:</span>
              <span className="font-medium text-gray-900 italic">
                {product.brand || "Невідомий бренд"}
              </span>
            </div>

            <div className="mb-6 flex ">
              <p className="text-gray-400 text-sm leading-relaxed inline">
                {displayDescription || "Опис відсутній"}
                {isLongDescription && (
                  <button
                    onClick={scrollToDescription}
                    className="ml-2 text-brand-primary font-bold text-sm hover:underline"
                  >
                    Читати далі
                    <ArrowRight size={16} className="ml-1 inline" />
                  </button>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 py-6 border-t border-b border-gray-200 mb-8">
              <div className="flex items-center border border-gray-200 rounded-full h-11 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 flex justify-center text-gray-400 hover:text-black"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 flex justify-center text-gray-400 hover:text-black"
                >
                  <Plus size={16} />
                </button>
              </div>
              {isOutOfStock ? (
                <button
                  className="flex-1 h-11 bg-gray-400 text-white rounded-full font-semibold text-md flex items-center justify-center gap-3 transition-colors cursor-not-allowed"
                  disabled
                >
                  Немає в наявності <ShoppingCart size={18} />
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(product, quantity)}
                  className="flex-1 h-11 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-full font-semibold text-md flex items-center justify-center gap-3 transition-colors"
                >
                  Покласти в кошик <ShoppingCart size={18} />
                </button>
              )}{" "}
              <FavoriteButton product={product} />
            </div>

            <div className="text-sm space-y-2">
              <p>
                <span className="font-medium text-gray-900">Категорія:</span>{" "}
                <span className="text-gray-500">
                  {product.categoryName || "Категорія відсутня"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-900">Теги:</span>{" "}
                <span className="text-gray-500">
                  {product.tags?.join(", ") || "Немає тегів"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          ref={detailsSectionRef}
          className="mt-20 border-t border-gray-100 pt-10"
        >
          <div className="flex justify-center gap-10 md:gap-20 mb-10 border-b border-gray-100 overflow-x-auto">
            {[
              { id: "description", label: "Опис" },
              { id: "specs", label: "Характеристики" },
              { id: "feedback", label: "Відгуки" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold tracking-widest transition-all whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-brand-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto min-h-[200px]">
            {activeTab === "description" && (
              <div className="text-gray-500 text-sm leading-loose">
                <p className="whitespace-pre-line">
                  {product.description || "Опис відсутній."}
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="flex justify-center">
                <ProductSpecifications spec={productSpecs} />
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="flex justify-center">
                <ProductReviewStats
                  rate={reviews || []}
                  hasAlreadyReviewed={hasAlreadyReviewed}
                  onWriteReviewClick={() => {
                    const formElement = document.getElementById("review-form");
                    if (formElement) {
                      const offset = 100;
                      const top =
                        formElement.getBoundingClientRect().top +
                        window.scrollY -
                        offset;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-16 border-t pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              {hasAlreadyReviewed ? (
                <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-8 flex flex-col items-center text-center font-montserrat">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
                    <Star size={32} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Дякуємо за ваш відгук!
                  </h3>
                  <p className="text-gray-500 text-sm ">
                    Ви вже поділилися своїми враженнями про цей товар. Ваша
                    думка допомагає іншим покупцям зробити правильний вибір.
                  </p>
                </div>
              ) : (
                <ReviewForm
                  productId={id!}
                  hasAlreadyReviewed={hasAlreadyReviewed}
                />
              )}
            </div>
            <div>
              <ReviewsSection productId={id!} />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-semibold text-gray-950 uppercase tracking-widest">
                Схожі товари
              </h2>
              <div className="h-0.5 flex-1 bg-gray-100 mx-8 hidden md:block"></div>
              <Link
                to="/shop"
                className="text-brand-primary font-bold hover:underline"
              >
                Всі товари
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {relatedProducts.map((item) => (
                <Link
                  to={`/product/${item.id}`}
                  key={item.id}
                  className="group flex flex-col h-full"
                >
                  <div className="bg-white border border-gray-100 rounded-xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 hover:border-brand-primary/20 flex flex-col h-full">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-6 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col flex-1 px-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors text-sm mb-2 line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-black text-lg text-gray-950">
                          ₴ {item.price}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <ShoppingCart size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <MailingSection />
    </div>
  );
};

export default ProductDetailsPage;
