import { ArrowRight, Eye, ShoppingCart, User } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}
export const ProductsSection = ({ products }: { products: Product[] }) => {
  return (
    <section className="relative">
      {/* <div className="absolute top-0 left-0">
        <img
          src="vertical.svg"
          alt="icon"
          className="w-52 opacity-10 brightness-[0.6]"
        />
      </div> */}
      <div className="absolute top-0 -right-0">
        <img
          src="horizontal.svg"
          alt="icon"
          className="w-52 opacity-10 brightness-[0.5]"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12 mb-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold mb-8 z-10">Рекомендовані товари</h2>
          <button className="flex gap-2 text-brand-primary font-semibold hover:underline">
            Переглянути всі
            <ArrowRight />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white p-4 border z-10 border-gray-100 rounded-lg shadow-sm transition-all hover:shadow-[0_0_20px_0_rgba(76,175,80,0.3)] hover:shadow-brand-dark/20 hover:border-brand-primary/70 cursor-pointer"
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-10 bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <button className="bg-white shadow-lg p-2.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                    <User size={18} />
                  </button>
                  <button className="bg-white shadow-lg p-2.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex flex-col justify-between gap-1">
                  <p className="text-sm text-gray-700 font-medium transition-colors duration-300 group-hover:text-blue-800/85">
                    {product.name.length > 17
                      ? `${product.name.slice(0, 17)}...`
                      : product.name}
                  </p>
                  <p className="text-[18px] font-medium font-manrope text-black">
                    {product.price}
                  </p>
                  <p className="text-xs text-brand-accent">В наявності</p>
                </div>
                <div className="flex items-center">
                  <button className="p-3 rounded-full bg-gray-100 hover:text-white hover:bg-brand-primary transition-colors">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
