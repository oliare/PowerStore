import { MapPin, PhoneCall, Mail } from "lucide-react";

export const ContactSection = () => {
  return (
    <div className="">
      <section className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex flex-col items-center justify-center gap-5 p-6 text-center">
            <div className="relative w-[60px] overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src="light-blue-bg.png"
                alt="Background"
                className="w-full h-auto block opacity-80"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary">
                <MapPin size={22} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase text-gray-400 tracking-widest">
                Наша адреса
              </h4>
              <p className="text-gray-900 font-semibold mt-1">
                вул. Енергетиків, 12, Рівне
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-5 p-6 text-center">
            <div className="relative w-[60px] overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src="light-blue-bg.png"
                alt="Background"
                className="w-full h-auto block opacity-80"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary">
                <PhoneCall size={22} strokeWidth={1.5} />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium uppercase text-gray-400 tracking-widest">
                Гаряча лінія 24/7
              </h4>
              <p className="text-lg font-black text-brand-primary mt-0.5">
                +380 (97) 123 45 67
              </p>
            </div>
          </div>

           <div className="flex flex-col items-center justify-center gap-5 p-6 text-center">
            <div className="relative w-[60px] overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src="light-blue-bg.png"
                alt="Background"
                className="w-full h-auto block opacity-80"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary">
                <Mail size={22} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase text-gray-400 tracking-widest">
                Email підтримка
              </h4>
              <p className="text-gray-900 font-semibold mt-1">
                info@powerstore.com.ua
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F2F2] py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Підпишіться на розсилку
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Отримуйте актуальні новини та акції.
            </p>
          </div>

          <form
            className="relative w-full max-w-xl flex items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Ваша електронна адреса"
                className="w-full pl-6 pr-40 py-4 rounded-full bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-gray-800"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-8 py-3 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all active:scale-95 shadow-md">
                Підписатися
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
