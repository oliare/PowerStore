import { Truck, MessageCircleHeart, ShoppingBag, Package } from "lucide-react";

export const FeaturesSection = () => {
  const featureList = [
    {
      icon: <Truck size={34} strokeWidth={1.5} />,
      title: "Безкоштовна доставка",
      desc: "Для замовлень від 2000₴",
    },
    {
      icon: <MessageCircleHeart size={34} strokeWidth={1.5} />,
      title: "Підтримка 24/7",
      desc: "Ми завжди на зв'язку",
    },
    {
      icon: <ShoppingBag size={34} strokeWidth={1.5} />,
      title: "Безпечна оплата",
      desc: "100% захищений платіж",
    },
    {
      icon: <Package size={34} strokeWidth={1.5} />,
      title: "Повернення товару",
      desc: "30 днів на роздуми",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-b border-gray-300 my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featureList.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center lg:justify-start gap-5 group"
          >
            <div className="relative flex-shrink-0 w-[75px] overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src="light-blue-bg.png"
                alt="Background"
                className="w-full h-auto block opacity-80"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary">
                {item.icon}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-bold text-gray-900">{item.title}</p>
              <p className="text-sm mt-1 text-gray-500 whitespace-nowrap">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
