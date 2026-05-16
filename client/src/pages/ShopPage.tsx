import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { MailingSection } from "./HomePage/MailingSection";
import { ShopSidebar } from "../common/ShopSidebar";
import { ShopProductGrid } from "../common/ShopProductGrid";
import { useGetProductsQuery } from "../services/productApi";
import { Pagination } from "../common/Pagination";
import { useSearchParams } from "react-router-dom";

export const ShopPage = () => {
  const [priceRange, setPriceRange] = useState(5000);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [activeSort, setActiveSort] = useState("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const productsPerPage = 28;
  const categoryId = searchParams.get("categoryId") || undefined;
  const brandsParam = searchParams.get("brand");
  const brands = brandsParam
    ? brandsParam.split(",").filter(Boolean)
    : undefined;

  const { data: products, isLoading } = useGetProductsQuery({
    page: currentPage,
    pageSize: productsPerPage,
    categoryId,
    brands,
  });

  const sortOptions = [
    { id: "latest", label: "Найновіші" },
    { id: "price_asc", label: "Від дешевих до дорогих" },
    { id: "price_desc", label: "Від дорогих до дешевих" },
    { id: "popular", label: "Популярні" },
  ];

  const processedProducts = useMemo(() => {
    if (!products) return [];

    return products.items
      .filter((p) => {
        const matchesPrice = p.price <= priceRange;
        const matchesRating =
          ratingFilter === 0 || (p.rate || 0) >= ratingFilter;
        return matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (activeSort === "price_asc") return a.price - b.price;
        if (activeSort === "price_desc") return b.price - a.price;
        return 0;
      });
  }, [products, priceRange, activeSort, ratingFilter]);

  // Пагінація — повністю серверна
  const totalPages = products?.totalPages ?? 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel = sortOptions.find((o) => o.id === activeSort)?.label;

  return (
    <div className="bg-gray-50 min-h-screen font-montserrat">
      <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ShopSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
          />
          <main className="w-full lg:w-3/4">
            <div className="flex flex-col min-h-[700px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center flex-grow py-40">
                  <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-4" />
                  <p className="text-gray-500 font-medium animate-pulse">
                    Завантаження товарів...
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl mb-6 border border-gray-100 shadow-sm gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm whitespace-nowrap">
                        Сортувати:
                      </span>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setIsSortOpen(!isSortOpen)}
                          className="flex items-center gap-3 px-5 py-2.5 rounded-full text-[13px] font-semibold bg-brand-bg border border-brand-accent text-brand-primary transition-all active:scale-95"
                        >
                          {currentSortLabel}
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {isSortOpen && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="py-2">
                              {sortOptions.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    setActiveSort(option.id);
                                    setIsSortOpen(false);
                                  }}
                                  className={`w-full text-left px-5 py-3 text-[13px] font-medium transition-colors hover:bg-gray-50 ${
                                    activeSort === option.id
                                      ? "text-brand-primary bg-brand-primary/5"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 mr-2">
                        Знайдено:{" "}
                        <span className="text-gray-900 font-bold pl-2">
                          {processedProducts.length}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <ShopProductGrid
                      products={processedProducts}
                      isLoading={isLoading}
                    />

                    {processedProducts.length === 0 && (
                      <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                        <p className="text-lg">Товарів не знайдено.</p>
                        <p className="text-sm">
                          Спробуйте змінити параметри фільтрації.
                        </p>
                      </div>
                    )}
                  </div>

                  {!isLoading && totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
      <MailingSection />
    </div>
  );
};
