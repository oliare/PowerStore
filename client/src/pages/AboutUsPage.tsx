import { useRef } from "react";
import {
  Check,
  ShieldCheck,
  Truck,
  Headset,
  Leaf,
  CreditCard,
  Users,
  Star,
  ArrowLeft,
  ArrowRight,
  Quote,
  GitCommitVertical,
} from "lucide-react";
import { MailingSection } from "./HomePage/MailingSection";
import { Link } from "react-router-dom";

export const AboutUsPage = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const testimonials = [
    {
      name: "Андрій Шевченко",
      role: "Електрик-монтажник",
      text: "Якість обладнання на найвищому рівні. Купував автоматику Schneider для виробництва — все працює як годинник. Окреме дякую за швидку відправку.",
      avatar: "https://i.pravatar.cc/150?u=9",
    },
    {
      name: "Марина Олійник",
      role: "Дизайнер інтер'єру",
      text: "Замовляла дизайнерські вимикачі Livolo. Дуже задоволена сервісом: менеджер допоміг підібрати колір під проект, а доставка прийшла наступного дня.",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      name: "Віктор Павлов",
      role: "Приватний забудовник",
      text: "Збирав щитову для дому. Тут знайшов все в одному місці — від ПЗВ до маркування. Ціни дуже конкурентні, а консультанти реально розуміються на техніці.",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      name: "Сергій Кравчук",
      role: "Виконроб",
      text: "Працюємо з PowerStore на постійній основі. Для нас головне — наявність на складі та оригінальність товару. Жодного разу не підвели з термінами.",
      avatar: "https://i.pravatar.cc/150?u=52",
    },
  ];

  return (
    <div className="bg-white font-montserrat">
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-semibold text-gray-900 mb-6 leading-tight">
            100% Надійна electroтехніка для вашого дому
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6 yexy">
            Ми почали свій шлях з невеликого магазину автоматики, а сьогодні ми
            — лідери ринку, що постачають сертифіковане обладнання тисячам
            клієнтів. Наша мета — забезпечити безпеку та стабільність вашої
            електромережі.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1558444479-c8f027d6a5ad?q=80&w=1000&auto=format&fit=crop"
            alt="Наш магазин"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop"
              alt="Наші фахівці"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-semibold mb-8">
              Ми гарантуємо якість кожного приладу
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <ShieldCheck />,
                  title: "Сертифікація",
                  desc: "100% перевірений товар",
                },
                {
                  icon: <Headset />,
                  title: "Підтримка 24/7",
                  desc: "Консультації експертів",
                },
                {
                  icon: <Users />,
                  title: "Відгуки",
                  desc: "Тисячі задоволених майстрів",
                },
                {
                  icon: <CreditCard />,
                  title: "Безпечна оплата",
                  desc: "Гарантія повернення коштів",
                },
                {
                  icon: <Truck />,
                  title: "Швидка доставка",
                  desc: "Відправка в день замовлення",
                },
                {
                  icon: <Leaf />,
                  title: "Еко-рішення",
                  desc: "Енергоефективні прилади",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="bg-brand-primary/10 text-brand-primary p-3 rounded-full h-fit">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-4xl font-semibold mb-6">
            Ви відпочиваєте — ми доставляємо
          </h2>
          <p className="text-gray-600 mb-8">
            Ми налагодили логістику так, щоб ви отримували потрібні запчастини
            швидше, ніж встигнете розпочати ремонт. Наша команда пакувальників
            дбає про цілісність кожного метра кабелю.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-gray-700">
              <Check size={20} className="text-brand-primary" /> Відправка по
              всій Україні
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <Check size={20} className="text-brand-primary" /> Безкоштовне
              пакування
            </li>
          </ul>
          <Link
            to={"/shop"}
            className="bg-brand-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-all"
          >
            Почати покупки <span className="pl-2">→</span>
          </Link>
        </div>
        <div className="flex-1 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop"
            alt="Доставка"
            className="max-h-[500px] mx-auto rounded-3xl"
          />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4">
              Наша професійна команда
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Фахівці з багаторічним досвідом у сфері електротехніки та
              автоматизації, які допоможуть вам знайти оптимальне рішення для
              будь-якого завдання.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: "Олександр Коваль",
                role: "Головний інженер",
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=500&auto=format&fit=crop",
              },
              {
                name: "Анна Петренко",
                role: "Менеджер з продажів",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=500&auto=format&fit=crop",
              },
              {
                name: "Іван Мазур",
                role: "Логіст",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&auto=format&fit=crop",
              },
              {
                name: "Сергій Бондар",
                role: "Консультант",
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFuysYoz3j2ewq_V5kz_W49gOyQuqNiwRsAMdSWJcPdw&s",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="group cursor-pointer flex flex-col items-center"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow bg-gray-50 flex items-center justify-center h-64"
                />
                <h4 className="font-semibold text-xl">{member.name}</h4>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div className="flex items-center gap-2">
              <GitCommitVertical className="text-brand-primary" size={30} />
              <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                Відгуки наших клієнтів
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="bg-white p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition-all active:scale-95"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="bg-brand-primary p-3 rounded-full text-white hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-2xl shadow-sm relative border border-gray-100 min-w-full md:min-w-[calc(50%-16px)] lg:min-w-[calc(33.333%-22px)] snap-start flex flex-col justify-between"
              >
                <Quote
                  className="absolute top-8 left-8 text-brand-primary/10"
                  size={48}
                />
                <p className="text-gray-600 mb-8 relative z-10 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between border-t pt-6 mt-auto">
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 bg-gray-200 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-gray-900">{t.name}</h5>
                      <p className="text-xs text-gray-400 mb-1">{t.role}</p>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, star) => (
                          <Star key={star} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MailingSection />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
