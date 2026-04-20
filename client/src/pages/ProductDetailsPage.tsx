import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../services/productApi";
import { ShoppingCart, Star, Heart, Plus, Minus } from "lucide-react";
import { MailingSection } from "./HomePage/MailingSection";
import type { ProductDto } from "../types/user/product";
import { addToCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import type { CartItemDto } from "../types/user/cart";

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetProductDetailsQuery(id!);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  if (isLoading)
    return (
      <div className="p-20 text-center font-black text-brand-primary animate-pulse">
        Завантаження...
      </div>
    );
  if (error || !data)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        Помилка завантаження товару
      </div>
    );

  const { product, relatedProducts } = data;

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
  };

  return (
    <div className="bg-white font-manrope">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 order-2 md:order-1">
              <button
                onClick={() => setActiveImage(product.image || null)}
                className={`w-20 h-20 border-2 rounded-xl p-1 transition-all ${activeImage === product.image ? "border-brand-primary" : "border-gray-100"}`}
              >
                <img
                  src={product.image}
                  alt="main"
                  className="w-full h-full object-contain"
                />
              </button>
              {product.images?.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image)}
                  className={`w-20 h-20 border-2 rounded-xl p-1 transition-all ${activeImage === img.image ? "border-brand-primary" : "border-gray-100"}`}
                >
                  <img
                    src={img.image}
                    alt="thumb"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-center order-1 md:order-2">
              <img
                src={activeImage || ""}
                alt={product.name}
                className="max-h-[450px] w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs font-medium">
                В наявності
              </span>
            </div>

            <div className="flex items-center gap-3 mb-8 text-sm">
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-gray-500">4 Відгуки</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-medium">
                SKU: {product.id.slice(0, 6)}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
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
                PowerStore
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {product.description || "Опис відсутній"}
            </p>

            <div className="flex items-center gap-3 py-6 border-t border-b border-gray-100 mb-8">
              <div className="flex items-center border border-gray-200 rounded-full h-12 bg-white">
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

              <button
                onClick={() => handleAddToCart(product, quantity)}
                className="flex-1 h-12 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-full font-semibold text-md flex items-center justify-center gap-3 transition-colors"
              >
                Покласти в кошик <ShoppingCart size={18} />
              </button>

              <button className="w-12 h-12 flex items-center justify-center rounded-full text-gray-400 border border-gray-300 hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all group">
                <Heart
                  size={20}
                  className="transition-colors group-hover:fill-white"
                />
              </button>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <span className="font-medium text-gray-900">Категорія:</span>{" "}
                <span className="text-gray-500">
                  {product.categoryName || "Vegetables"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-900">Теги:</span>{" "}
                <span className="text-gray-500">
                  Healthy, {product.categoryName}, PowerStore
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-100 pt-10">
          <div className="flex justify-center gap-20 mb-10 border-b border-gray-100">
            {["description", "additional", "feedback"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold tracking-widest transition-all relative ${activeTab === tab ? "text-gray-900 border-b-2 border-brand-primary" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab === "description"
                  ? "Опис"
                  : tab === "additional"
                    ? "Додаткова інформація"
                    : "Відгуки"}
              </button>
            ))}
          </div>
          <div className="text-gray-500 text-sm leading-loose max-w-4xl mx-auto text-center">
            {activeTab === "description" &&
              (product.description || "Опис відсутній.")}
            {activeTab === "additional" &&
              "Вага: 1кг, Якість: Преміум, Гарантія: 12 місяців"}
            {activeTab === "feedback" &&
              "Відгуків ще немає. Будьте першим, хто залишить відгук!"}
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
                to="/products"
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
