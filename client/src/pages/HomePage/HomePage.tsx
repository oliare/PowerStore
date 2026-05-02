import { StatsSection } from "./StatsSection";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturesSection } from "./FeaturesSection";
import { ContactSection } from "./ContactSection";
import { BlogSection } from "./BlogSection";
import { HeroSection } from "./HeroSection";
import { ProductsSection } from "./ProductsSection";
import { useGetProductsQuery } from "../../services/productApi";
import { useGetTopCategoriesQuery } from "../../services/categoryApi";

const HomePage = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery({
    page: 1,
    pageSize: 5,
  });

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetTopCategoriesQuery(6);

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-900 font-montserrat">
      <HeroSection />
      <FeaturesSection />
      <ProductsSection
        products={products?.items || []}
        isLoading={isLoading}
        error={error}
      />
      <CategoriesSection
        categories={categoriesData || []}
        isLoading={isCategoriesLoading}
        error={categoriesError}
      />
      <StatsSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
