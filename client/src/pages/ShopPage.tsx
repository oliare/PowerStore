import { ChevronDown, LayoutGrid, List, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MailingSection } from "./HomePage/MailingSection";
import { ShopSidebar } from "../common/ShopSidebar";
import { ShopProductGrid } from "../common/ShopProductGrid";

export const ShopPage = () => {
  const [priceRange, setPriceRange] = useState(5000);
  const [isLoading] = useState(false);

  const [activeSort, setActiveSort] = useState("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { id: "latest", label: "Найновіші" },
    { id: "price_asc", label: "Від дешевих до дорогих" },
    { id: "price_desc", label: "Від дорогих до дешевих" },
    { id: "popular", label: "Популярні" },
  ];

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

  const mockProducts = [
    {
      id: "1",
      name: "Світильник LED",
      price: 1200,
      image: "/images/product1.jpg",
      isFavorite: false,
      stockQuantity: 10,
      categoryId: "1",
    },
    {
      id: "2",
      name: "Кабель NYM",
      price: 800,
      image: "/images/product2.jpg",
      isFavorite: false,
      stockQuantity: 15,
      categoryId: "2",
    },
    {
      id: "3",
      name: "Розетка Schneider",
      price: 450,
      image: "/images/product3.jpg",
      isFavorite: false,
      stockQuantity: 20,
      categoryId: "3",
    },
    {
      id: "4",
      name: "Інструмент для монтажу",
      price: 1500,
      image: "/images/product4.jpg",
      isFavorite: false,
      stockQuantity: 5,
      categoryId: "4",
    },
    {
      id: "5",
      name: "Система захисту від перенапруги",
      price: 2200,
      image: "/images/product5.jpg",
      isFavorite: false,
      stockQuantity: 8,
      categoryId: "5",
    },
    {
      id: "6",
      name: "Світильник вуличний",
      price: 1800,
      image: "/images/product6.jpg",
      isFavorite: false,
      stockQuantity: 12,
      categoryId: "1",
    },
    {
      id: "7",
      name: "Кабель силовий",
      price: 950,
      image: "/images/product7.jpg",
      isFavorite: false,
      stockQuantity: 7,
      categoryId: "2",
    },
    {
      id: "8",
      name: "Вимикач з підсвіткою",
      price: 600,
      image: "/images/product8.jpg",
      isFavorite: false,
      stockQuantity: 14,
      categoryId: "3",
    },
    {
      id: "9",
      name: "Набір інструментів",
      price: 2500,
      image: "/images/product9.jpg",
      isFavorite: false,
      stockQuantity: 6,
      categoryId: "4",
    },
    {
      id: "10",
      name: "Захист від короткого замикання",
      price: 3000,
      image: "/images/product10.jpg",
      isFavorite: false,
      stockQuantity: 9,
      categoryId: "5",
    },
  ];

  const filteredProducts = mockProducts.filter((p) => p.price <= priceRange);
  return (
    <div className="bg-gray-50 min-h-screen font-montserrat">
      <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ShopSidebar priceRange={priceRange} setPriceRange={setPriceRange} />

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
                          className="flex items-center gap-3 px-5 py-2.5 rounded-full text-[13px] font-semibold bg-brand-bg border border-brand-accent text-brand-primary transition-all hover:bg-opacity-90 active:scale-95"
                        >
                          {activeSort === "latest"
                            ? `Всі (${10})`
                            : currentSortLabel}

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
                          {filteredProducts.length}
                        </span>
                      </span>
                      <div className="flex border rounded-md overflow-hidden bg-white">
                        <button className="p-2 bg-gray-50 text-brand-primary border-r">
                          <LayoutGrid size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors">
                          <List size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <ShopProductGrid
                      products={filteredProducts}
                      isLoading={isLoading}
                    />

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-20 text-gray-400">
                        Товарів не знайдено. Спробуйте змінити фільтри.
                      </div>
                    )}
                  </div>

                  {filteredProducts.length > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                      <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:border-brand-primary transition-colors">
                        1
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-primary text-white">
                        2
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:border-brand-primary transition-colors">
                        3
                      </button>
                      <span className="mx-2 text-gray-400">...</span>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:border-brand-primary transition-colors">
                        21
                      </button>
                    </div>
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
