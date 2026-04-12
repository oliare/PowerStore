import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Drill,
  Cable,
  PlugZap,
} from "lucide-react";
import { PhotoCarousel } from "../../common/Carousel";
import { useState } from "react";

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1400",
    "https://images.unsplash.com/photo-1558402529-d26c8a7023e9?q=80&w=1400",
  ];

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );

  return (
    <section className="bg-brand-bg py-7 relative overflow-hidden">
      <div className="absolute top-10 left-[1%] text-[#c5d4f0] blur-[0.7px] rotate-12 pointer-events-none">
        <Drill size={110} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-10 right-[5%] text-[#c5d4f0] blur-[0.7px] rotate-12 pointer-events-none">
        <Cable size={150} strokeWidth={0.5} />
      </div>
      <div className="absolute -bottom-2 left-[8%] text-[#c5d4f0] blur-[0.7px] rotate-24 pointer-events-none">
        <PlugZap size={90} strokeWidth={0.5} />
      </div>
      <div className="relative max-w-[1400px] mx-auto py-12 px-10">
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white w-4 h-4 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary hover:text-white transition-all group"
        >
          <ChevronLeft size={24} strokeWidth={1} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-white w-4 h-4 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary hover:text-white transition-all group"
        >
          <ChevronRight size={24} strokeWidth={1} />
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-center px-10">
          <PhotoCarousel
            images={heroImages}
            currentIndex={currentSlide}
            height={"h-[300px] md:h-[400px]"}
          />

          <div className="flex flex-col items-start gap-6 pl-4">
            <span className="text-brand-primary uppercase font-bold text-sm tracking-widest">
              Welcome to PowerStore
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Все для енергії <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-brand-primary to-gray-900">
                у вашому домі
              </span>
            </h1>
            <p className="text-3xl font-semibold text-gray-800">
              Знижки на автоматику до
              <span className="text-orange-500 font-extrabold">30% OFF</span>
            </p>
            <p className="text-gray-500 text-lg max-w-md">
              Надійне електрообладнання для вашої безпеки. Безкоштовна доставка
              на всі замовлення.
            </p>
            <button className="flex items-center gap-3 px-10 py-4 rounded-full bg-brand-primary hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 group">
              <span className="text-white font-bold text-lg">До покупок</span>
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
