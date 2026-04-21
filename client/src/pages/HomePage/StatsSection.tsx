export const StatsSection = () => {
  const stats = [
    { value: "10+", label: "Років на ринку" },
    { value: "50к+", label: "Задоволених клієнтів" },
    { value: "25", label: "Сертифікатів якості" },
    { value: "100к+", label: "Замовлень щомісяця" },
  ];

  return (
    <section className="relative w-full py-16 bg-[url('/electrical-bg.svg')] object-cover">
      <div className=" bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center p-8 py-10 rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-brand-primary/30"
            >
              <span className="text-4xl md:text-5xl text-brand-accent mb-2 transition-transform duration-300 group-hover:scale-110">
                {stat.value}
              </span>
              <span className="mt-3 text-gray-300 text-sm md:text-[15px] font-medium text-center tracking-wider font-montserrat">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
