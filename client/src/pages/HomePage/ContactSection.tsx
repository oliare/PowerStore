import { MapPin, PhoneCall, Mail } from "lucide-react";
import { MailingSection } from "./mailingSection";

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

      <MailingSection />
    </div>
  );
};
