import { StatsSection } from "./StatsSection";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturesSection } from "./FeaturesSection";
import { ContactSection } from "./ContactSection";
import { BlogSection } from "./BlogSection";
import { HeroSection } from "./HeroSection";
import { ProductsSection } from "./ProductsSection";

const HomePage = () => {
  const categories = [
    {
      name: "Освітлення",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Інструменти",
      img: "https://images.unsplash.com/photo-1530124560676-41bc1275d82e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Компоненти",
      img: "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Силові системи",
      img: "https://images.unsplash.com/photo-1558402529-d26c8a7023e9?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Автоматика",
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Автоматика",
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Smart LED Лампа 15W",
      price: "₴ 299",
      image:
        "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Мультиметр Digital Pro",
      price: "₴ 1 250",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Набір викруток (24 шт)",
      price: "₴ 850",
      image:
        "https://images.unsplash.com/photo-1530124560676-41bc1275d82e?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Контролер Arduino Uno",
      price: "₴ 450",
      image:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Реле напруги ZUBR",
      price: "₴ 1 100",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-900 font-manrope">
      <HeroSection />
      <FeaturesSection />
      <ProductsSection products={products} />
      <CategoriesSection categories={categories} />
      <StatsSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
