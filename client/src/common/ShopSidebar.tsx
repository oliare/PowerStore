import { Filter, Star, X, Check, ChevronDown } from "lucide-react";
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
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();

  const activeCategoryId = searchParams.get("categoryId");

  const activeBrandsParam = searchParams.get("brand");
  const activeBrands = activeBrandsParam
    ? activeBrandsParam.split(",").filter(Boolean)
    : [];

  const rootCategories = categories?.filter((cat) => !cat.parentId) || [];

  const handleCategoryClick = (cat: {
    id: string;
    childrens?: { id: string }[];
  }) => {
    const hasChildren = cat.childrens && cat.childrens.length > 0;

    if (hasChildren) {
      setExpandedCategoryId(expandedCategoryId === cat.id ? null : cat.id);
    } else {
      const newParams = new URLSearchParams(searchParams);
      if (activeCategoryId === cat.id) {
        newParams.delete("categoryId");
      } else {
        newParams.set("categoryId", cat.id);
      }
      setSearchParams(newParams);
    }
  };

  const handleSubCategoryClick = (e: React.MouseEvent, subId: string) => {
    e.stopPropagation();
    const newParams = new URLSearchParams(searchParams);
    if (activeCategoryId === subId) {
      newParams.delete("categoryId");
    } else {
      newParams.set("categoryId", subId);
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

      {isOpen && (
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 top-[64px] bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          lg:block lg:relative lg:inset-auto lg:z-0 lg:bg-white lg:p-6 lg:rounded-xl lg:border lg:border-gray-100 lg:shadow-sm
          ${
            isOpen
              ? "fixed inset-x-0 bottom-0 top-[64px] z-50 bg-white overflow-y-auto block"
              : "hidden"
          }
        `}
      >
        <div className="flex justify-between items-center p-6 pb-4 lg:hidden border-b border-gray-100">
          <h2 className="text-xl font-bold">Фільтри</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 lg:p-0">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-montserrat text-black">
              Категорії
            </h3>
            <ul className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {rootCategories.map((cat) => {
                const hasChildren = cat.childrens && cat.childrens.length > 0;
                const isExpanded = expandedCategoryId === cat.id;
                const isParentOfActive = cat.childrens?.some(
                  (child) => child.id === activeCategoryId,
                );
                const isCatActive = activeCategoryId === cat.id;
                const isAnyChildActive = !!isParentOfActive;

                return (
                  <li key={cat.id} className="flex flex-col">
                    <div
                      className="flex items-center justify-between group cursor-pointer py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <div className="flex items-center gap-3">
                        {!hasChildren && (
                          <div
                            className={`w-4 h-4 border rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                              isCatActive
                                ? "bg-brand-primary border-brand-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {isCatActive && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                        )}
                        <span
                          className={`text-sm font-montserrat transition-colors ${
                            isCatActive || isAnyChildActive
                              ? "text-brand-primary font-bold"
                              : "group-hover:text-brand-primary text-gray-700"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>

                      {hasChildren && (
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {hasChildren && isExpanded && (
                      <ul className="ml-4 mt-1 mb-1 space-y-1 border-l-2 border-gray-100 pl-3 animate-in slide-in-from-top-2 duration-200">
                        {cat.childrens!.map((sub) => (
                          <li
                            key={sub.id}
                            className={`flex items-center gap-2 text-sm cursor-pointer py-1.5 px-2 rounded-lg transition-colors ${
                              activeCategoryId === sub.id
                                ? "text-brand-primary font-semibold bg-brand-primary/5"
                                : "text-gray-500 hover:text-brand-primary hover:bg-gray-50"
                            }`}
                            onClick={(e) => handleSubCategoryClick(e, sub.id)}
                          >
                            <div
                              className={`w-3 h-3 border rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                activeCategoryId === sub.id
                                  ? "bg-brand-primary border-brand-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {activeCategoryId === sub.id && (
                                <Check size={8} className="text-white" />
                              )}
                            </div>
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
                          {isActive && (
                            <Check size={12} className="text-white" />
                          )}
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
            className="lg:hidden w-full py-2.5 bg-brand-primary text-white rounded-full mt-4 font-semibold shadow-lg shadow-brand-primary/20"
          >
            Застосувати
          </button>
        </div>
      </div>
    </aside>
  );
};
