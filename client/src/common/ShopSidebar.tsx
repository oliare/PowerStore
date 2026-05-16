import { Filter, Star, X, Check } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../services/categoryApi";
import { useGetBrandsQuery } from "../services/productApi";

interface ShopSidebarProps {
  priceRange: number;
  setPriceRange: (value: number) => void;
  ratingFilter: number;
  setRatingFilter: (value: number) => void;
  className?: string;
}

export const ShopSidebar = ({
  priceRange,
  setPriceRange,
  ratingFilter,
  setRatingFilter,
  className,
}: ShopSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();

  const activeCategoryId = searchParams.get("categoryId");

  const activeBrandsParam = searchParams.get("brand");
  const activeBrands = activeBrandsParam
    ? activeBrandsParam.split(",").filter(Boolean)
    : [];

  const rootCategories = categories?.filter((cat) => !cat.parentId) || [];

  const handleCategoryChange = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (activeCategoryId === id) {
      newParams.delete("categoryId");
    } else {
      newParams.set("categoryId", id);
    }
    setSearchParams(newParams);
  };

  const handleBrandChange = (brand: string) => {
    const newParams = new URLSearchParams(searchParams);

    const updatedBrands = activeBrands.includes(brand)
      ? activeBrands.filter((b) => b !== brand)
      : [...activeBrands, brand];

    if (updatedBrands.length > 0) {
      newParams.set("brand", updatedBrands.join(","));
    } else {
      newParams.delete("brand");
    }

    setSearchParams(newParams);
  };

  const clearBrandFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("brand");
    setSearchParams(newParams);
  };

  const handleRatingChange = (rating: number) => {
    if (ratingFilter === rating) {
      setRatingFilter(0);
    } else {
      setRatingFilter(rating);
    }
  };

  return (
    <aside className={`w-full lg:w-1/4 ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-brand-primary text-white rounded-lg mb-4 mt-4 active:scale-95 transition-transform"
      >
        <Filter size={20} /> Фільтри
      </button>

      <div
        className={`
        ${isOpen ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto block" : "hidden"}
        lg:block lg:relative lg:inset-auto lg:z-0 lg:bg-white lg:p-6 lg:rounded-xl lg:border lg:border-gray-100 lg:shadow-sm
      `}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold">Фільтри</h2>
          <button onClick={() => setIsOpen(false)} className="p-2">
            <X size={24} />
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-montserrat text-black">
            Категорії
          </h3>
          <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {rootCategories.map((cat) => {
              const isParentOfActive = cat.childrens?.some(
                (child) => child.id == activeCategoryId,
              );
              const isActive = activeCategoryId == cat.id || isParentOfActive;

              return (
                <li key={cat.id} className="flex flex-col">
                  <div
                    className="flex items-center justify-between group cursor-pointer py-1"
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-brand-primary border-brand-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isActive && <Check size={12} className="text-white" />}
                      </div>
                      <span
                        className={`text-sm transition-colors font-montserrat ${
                          isActive
                            ? "text-brand-primary font-bold"
                            : "group-hover:text-brand-primary text-gray-700"
                        }`}
                      >
                        {cat.name}
                      </span>
                    </div>
                  </div>

                  {isActive && cat.childrens && cat.childrens.length > 0 && (
                    <ul className="ml-8 mt-2 space-y-2 border-l-2 border-gray-100 pl-4 animate-in slide-in-from-top-2 duration-300">
                      {cat.childrens.map((sub) => (
                        <li
                          key={sub.id}
                          className={`text-sm cursor-pointer transition-colors ${
                            activeCategoryId === sub.id
                              ? "text-brand-primary font-semibold"
                              : "text-gray-500 hover:text-brand-primary"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set("categoryId", sub.id);
                            setSearchParams(newParams);
                          }}
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {brands.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold font-montserrat text-black">
                Бренди
              </h3>
              {activeBrands.length > 0 && (
                <button
                  onClick={clearBrandFilter}
                  className="text-xs text-brand-primary hover:underline font-montserrat flex items-center gap-1"
                >
                  <X size={12} />
                  Скинути ({activeBrands.length})
                </button>
              )}
            </div>
            <ul className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand) => {
                const isActive = activeBrands.includes(brand);
                return (
                  <li key={brand}>
                    <label
                      className="flex items-center gap-3 group cursor-pointer py-0.5"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBrandChange(brand);
                      }}
                    >
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                          isActive
                            ? "bg-brand-primary border-brand-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isActive && <Check size={12} className="text-white" />}
                      </div>
                      <span
                        className={`text-sm font-montserrat transition-colors ${
                          isActive
                            ? "text-brand-primary font-bold"
                            : "text-gray-700 group-hover:text-brand-primary"
                        }`}
                      >
                        {brand}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="my-8">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-montserrat text-black">
            Ціна
          </h3>
          <input
            type="range"
            min="0"
            max="5000"
            step="10"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
          <div className="flex justify-between mt-2 text-sm font-medium font-montserrat">
            <span>0 ₴</span>
            <span className="text-brand-primary">{priceRange} ₴+</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-montserrat text-black">
            Рейтинг
          </h3>
          <div className="flex flex-col gap-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={ratingFilter === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 accent-brand-primary rounded border-gray-300 cursor-pointer"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < rating
                          ? "fill-[#fbd53c] text-[#fbd53c]"
                          : "text-gray-200 fill-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1 font-montserrat italic">
                    {rating === 5 ? "5.0" : `${rating}.0+`}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {ratingFilter > 0 && (
            <button
              onClick={() => setRatingFilter(0)}
              className="text-xs text-brand-primary mt-3 hover:underline font-montserrat"
            >
              Очистити фільтр рейтингу
            </button>
          )}
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden w-full py-2.5 bg-brand-primary text-white rounded-full mt-8 font-semibold shadow-lg shadow-brand-primary/20"
        >
          Застосувати
        </button>
      </div>
    </aside>
  );
};
