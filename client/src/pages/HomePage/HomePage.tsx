import { StatsSection } from "./StatsSection";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturesSection } from "./FeaturesSection";
import { ContactSection } from "./ContactSection";
import { BlogSection } from "./BlogSection";
import { HeroSection } from "./HeroSection";
import { ProductsSection } from "./ProductsSection";
import { useGetProductsQuery } from "../../services/productApi";

const HomePage = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery({ limit: 5 });

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

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-900 font-manrope">
      <HeroSection />
      <FeaturesSection />
      <ProductsSection
        products={products || []}
        isLoading={isLoading}
        error={error}
      />
      <CategoriesSection categories={categories} />
      <StatsSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
