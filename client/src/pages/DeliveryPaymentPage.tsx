import {
  Truck,
  CreditCard,
  RotateCcw,
  Award,
  FileText,
  Info,
} from "lucide-react";
import { MailingSection } from "./HomePage/MailingSection";

export const DeliveryPaymentPage = () => {
  return (
    <div className="bg-white min-h-screen font-montserrat">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-3xl md:text-3xl font-semibold text-gray-900 mb-20 mt-6 text-center">
          Інформація для покупців
        </p>

        <div className="grid lg:grid-cols-2 gap-16 mb-16 font-montserrat">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-5">
              <div className="bg-brand-primary/10 p-2.5 rounded-xl text-brand-primary">
                <Truck size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Доставка
              </h2>
            </div>

            <div className="space-y-10 pl-10">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-brand-primary rounded-full" />

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                    Нова Пошта
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                    Доставка у відділення або поштомат по всій Україні протягом
                    <span className="text-brand-primary font-medium mx-1 whitespace-nowrap">
                      1-3 днів
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-brand-primary/30 rounded-full" />

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                    Кур'єрська доставка
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                    Адресна доставка до ваших дверей за тарифами перевізника у
                    зручний для вас час.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-5">
              <div className="bg-brand-primary/10 p-2.5 rounded-xl text-brand-primary">
                <CreditCard size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Оплата
              </h2>
            </div>

            <div className="space-y-10 pl-10">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-brand-primary rounded-full" />

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                    Онлайн-оплата
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                    Швидка оплата Visa/Mastercard через LiqPay або Monobank без
                    додаткових комісій.
                  </p>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-brand-primary/30 rounded-full" />

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                    Післяплата
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                    Розрахунок готівкою або картою безпосередньо при отриманні
                    товару.
                    <span className="block mt-1 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                      * за тарифами пошти
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden group">
            <Award className="absolute -right-4 -top-4 w-24 h-24 text-orange-500/5 rotate-12 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-4 mb-6 text-orange-500">
              <Award size={32} />
              <h2 className="text-2xl font-bold text-gray-900">
                Гарантія якості
              </h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Ми реалізуємо тільки сертифіковані електротовари. На всю продукцію
              надається офіційна гарантія:
            </p>
            <ul className="space-y-3">
              {[
                "12-36 місяців на техніку",
                "Перевірка товару перед відправкою",
                "Наявність гарантійного талона в кожному замовленні",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-medium text-gray-700"
                >
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden group">
            <RotateCcw className="absolute -right-4 -top-4 w-24 h-24 text-red-500/5 -rotate-12 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-4 mb-6 text-red-500">
              <RotateCcw size={32} />
              <h2 className="text-2xl font-bold text-gray-900">
                Повернення та обмін
              </h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Ви можете повернути або обміняти товар протягом <b>14 днів</b> з
              моменту покупки згідно із Законом України:
            </p>
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100">
              <FileText className="text-gray-400 shrink-0" size={20} />
              <p className="text-[11px] text-gray-500 leading-tight italic">
                Товар має бути без слідів експлуатації, з усіма пломбами,
                ярликами та в оригінальній упаковці.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
            <Info size={16} className="text-brand-primary" />
            <p className="text-gray-700 text-sm font-medium">
              Залишилися питання?
              <span className="text-brand-primary ml-1 font-bold">
                +380 123 456 789
              </span>
            </p>
          </div>
        </div>
      </div>
      <MailingSection />
    </div>
  );
};
