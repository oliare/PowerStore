import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { MailingSection } from "./HomePage/MailingSection";

const faqData = [
  {
    question: "Чи надаєте ви офіційну гарантію на товари?",
    answer:
      "Так, на всі електротовари в нашому магазині надається офіційна гарантія від виробника терміном від 12 до 36 місяців. Гарантійний талон додається до кожного замовлення.",
  },
  {
    question: "Як швидко ви відправляєте замовлення?",
    answer:
      "Замовлення, оформлені до 16:00, відправляються в той же день. Доставка Новою Поштою зазвичай займає 1-2 робочих дні.",
  },
  {
    question: "Які способи оплати доступні на сайті?",
    answer:
      "Ви можете оплатити замовлення онлайн картою (Visa/Mastercard), через Apple Pay/Google Pay, або обрати післяплату при отриманні у відділенні.",
  },
  {
    question: "Що робити, якщо товар пошкодився при доставці?",
    answer:
      "Обов'язково перевіряйте цілісність товару при отриманні. У разі пошкодження складіть акт разом із представником пошти та зв'яжіться з нами — ми замінимо товар.",
  },
  {
    question: "Чи можна замовити товар, якого немає в наявності?",
    answer:
      "Так, ми працюємо з багатьма постачальниками напряму. Зверніться до нашої підтримки, і ми зорієнтуємо вас щодо термінів поставки потрібної позиції.",
  },
];

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white min-h-screen font-montserrat">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full mb-16">
        <div className="flex flex-col lg:flex-row items-start gap-20">
          <div className="lg:w-2/3 pt-4">
            <div className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
              <p>Вітаємо, давайте поговоримо</p>
              <p className="text-brand-primary pt-1">про PowerStore</p>
            </div>

            <div className="space-y-3">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`border border-gray-300 rounded-xl transition-all duration-300 ${
                    openIndex === index
                      ? "border-brand-primary shadow-md"
                      : "border-gray-100 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-4 text-left transition-colors"
                  >
                    <span
                      className={`font-semibold text-sm md:text-[15px] ${
                        openIndex === index
                          ? "text-brand-primary"
                          : "text-gray-700"
                      }`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`p-1 rounded-full ${
                        openIndex === index
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {openIndex === index ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index
                        ? "max-h-[200px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 pt-4 text-sm text-gray-600 border-t border-brand-primary">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="rounded-3xl overflow-hidden">
              <img
                src="faq.png"
                alt="Support Team"
                className="w-full h-[450px] lg:h-[550px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <MailingSection />
    </div>
  );
};
