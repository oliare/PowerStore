import {
  ArrowRight,
  Check,
  Wrench,
  Zap,
  Settings,
  Nut,
  AlertCircle,
} from "lucide-react";
import type { CategoryDto } from "../../types/category";
import type { SerializedError } from "@reduxjs/toolkit/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGE_URL } from "../../api/api";

const CategorySkeleton = () => (
  <div className="bg-white p-4 py-6 rounded-2xl border border-gray-100 animate-pulse">
    <div className="aspect-square w-full bg-gray-200 rounded-xl mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
  </div>
);

interface CategoriesSectionProps {
  categories: CategoryDto[];
  isLoading?: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
}

export const CategoriesSection = ({
  categories,
  isLoading,
  error,
}: CategoriesSectionProps) => {
  return (
    <section className="bg-brand-bg relative overflow-hidden font-montserrat">
      <div className="absolute top-36 left-10 text-[#c5d4f0] blur-[0.7px] -rotate-12 pointer-events-none">
        <Wrench size={120} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-72 right-10 text-[#c5d4f0] blur-[0.7px] rotate-12 pointer-events-none">
        <Zap size={80} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-10 left-20 text-[#c5d4f0] blur-[0.7px] -rotate-45 pointer-events-none">
        <Nut size={90} strokeWidth={0.5} />
      </div>
      <div className="absolute -top-4 -right-14 text-[#c5d4f0] blur-[0.7px] -rotate-12 pointer-events-none">
        <Settings size={145} strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold z-10">Популярні категорії</h2>
          {!isLoading && !error && (
            <Link
              to="/shop"
              className="flex items-center gap-2 text-brand-primary font-semibold hover:underline group z-10"
            >
              Переглянути всі
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-2xl border border-red-100 z-10 relative">
            <AlertCircle className="text-red-500 mb-2" size={40} />
            <p className="text-red-800 font-medium text-center">
              Не вдалося завантажити категорії
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-red-600 underline hover:text-red-800"
            >
              Спробувати ще раз
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <CategorySkeleton key={i} />
                ))
              : categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?categoryId=${cat.id}`}
                    className="group cursor-pointer flex z-10"
                  >
                    <div
                      className="bg-white p-4 py-6 rounded-2xl shadow-sm border border-gray-100 transition-all 
                                    hover:shadow-[0_0_20px_0_rgba(76,175,80,0.3)] hover:shadow-brand-dark/20 
                                    hover:border-brand-primary/70 text-center flex flex-col w-full h-full"
                    >
                      <div className="aspect-square w-full flex items-center justify-center text-white mx-auto mb-4 overflow-hidden bg-gray-50 rounded-xl">
                        <img
                          src={cat.image || PLACEHOLDER_IMAGE_URL}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <p className="font-semibold mt-2 text-gray-800 leading-tight flex-grow flex items-center justify-center group-hover:text-brand-primary transition-colors">
                        {cat.name.length > 14
                          ? cat.name.slice(0, 14) + "..."
                          : cat.name}
                      </p>
                      <p className="font-normal text-xs text-gray-500 tracking-wide mt-2 line-clamp-2 h-[2rem] overflow-hidden">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_3fr] gap-4 mt-24 py-12">
          <img
            src="electrical-goods_1.png"
            alt="Electrical Goods 1"
            className="hidden md:block rounded h-[70%] object-cover"
          />
          <img
            src="electrical-goods_2.png"
            alt="Electrical Goods 2"
            className="rounded h-full mx-auto"
          />
          <div className="flex flex-col justify-between gap-4 z-10 pl-6">
            <p className="text-3xl md:text-4xl font-semibold text-gray-950 mb-4 leading-tight md:leading-[1.3]">
              Нам довіряють: 100% Перевірений магазин
            </p>
            <div className="flex gap-3">
              <Check
                color="white"
                className="bg-brand-primary rounded-full w-7 min-w-[1.5rem] p-1"
              />
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">Надійна енергія для дому</span>
                <span className="text-gray-600 text-sm leading-6">
                  Тільки сертифіковане обладнання, яке пройшло всі перевірки
                  безпеки. Гарантія на кожен прилад.
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Check
                color="white"
                className="bg-brand-primary rounded-full w-7 min-w-[1.5rem] p-1"
              />
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">Підтримка експертів 24/7</span>
                <span className="text-gray-600 text-sm leading-6">
                  Наші фахівці допоможуть обрати правильну автоматику та
                  проконсультують щодо підключення у будь-який час.
                </span>
              </p>
            </div>
            <button className="flex items-center justify-start gap-3 px-8 py-2 mt-4 w-min min-w-max rounded-full bg-brand-primary hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 group">
              <span className="text-white font-semibold ">До покупок</span>
              <ArrowRight
                color="white"
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
