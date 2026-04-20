import { ArrowRight, Check, Wrench, Zap, Settings, Nut } from "lucide-react";

interface Category {
  name: string;
  img: string;
}

export const CategoriesSection = ({
  categories,
}: {
  categories: Category[];
}) => {
  return (
    <section className="bg-brand-bg relative overflow-hidden">
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
          <h2 className="text-3xl font-bold">Популярні категорії</h2>
          <button className="flex gap-2 text-brand-primary font-semibold hover:underline z-10">
            Переглянути всі
            <ArrowRight />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <div key={index} className="group cursor-pointer flex">
              <div
                className="bg-white p-4 py-6 rounded-lg shadow-sm border border-gray-100 transition-all 
                      hover:shadow-[0_0_20px_0_rgba(76,175,80,0.3)] hover:shadow-brand-dark/20 
                      hover:border-brand-primary/70 text-center flex flex-col w-full h-full z-10"
              >
                <div className="aspect-square w-full flex items-center justify-center text-white mx-auto mb-4 overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="font-bold text-gray-800 leading-tight flex-grow flex items-center justify-center">
                  {cat.name}
                </p>
                <p className="font-medium text-xs text-gray-500 tracking-wide mt-auto pt-2">
                  10 Товарів
                </p>
              </div>
            </div>
          ))}
        </div>

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
            <p className="text-3xl md:text-4xl font-bold text-gray-950 mb-4 leading-tight md:leading-[1.3]">
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
