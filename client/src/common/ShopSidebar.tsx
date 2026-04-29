import { Filter, Star, X } from "lucide-react";
import { useState } from "react";

interface ShopSidebarProps {
  priceRange: number;
  setPriceRange: (value: number) => void;
  className?: string;
}

export const ShopSidebar = ({
  priceRange,
  setPriceRange,
  className,
}: ShopSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const categoriesList = [
    { name: "Освітлення", count: 120 },
    { name: "Кабельна продукція", count: 85 },
    { name: "Розетки та вимикачі", count: 210 },
    { name: "Інструменти", count: 45 },
    { name: "Системи захисту", count: 30 },
  ];

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

        <div className="mb-8 lg:mb-0">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2 font-montserrat text-black">
            Категорії
          </h3>
          <ul className="space-y-3">
            {categoriesList.map((cat) => (
              <li
                key={cat.name}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                  />
                  <span className="text-sm group-hover:text-brand-primary transition-colors font-montserrat">
                    {cat.name}
                  </span>
                </div>
                <span className="text-xs text-gray-400">({cat.count})</span>
              </li>
            ))}
          </ul>
        </div>

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

        <div>
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
                  className="w-4 h-4 accent-brand-primary rounded border-gray-300 cursor-pointer"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < rating ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1 font-montserrat italic">
                    {rating === 5 ? "5.0" : `${rating}.0+`}
                  </span>
                </div>
              </label>
            ))}
          </div>
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
