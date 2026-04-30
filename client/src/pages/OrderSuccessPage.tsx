import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BaggageClaim } from "lucide-react";
import { MailingSection } from "./HomePage/MailingSection";

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center px-4 py-16">
        <div className="w-full max-w-7xl mb-12 px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            <span>Продовжити покупки</span>
          </Link>
        </div>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            width: "100%",
            maxWidth: "560px",
          }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-white p-8 rounded-full mb-8 shadow-sm border border-gray-50">
              <BaggageClaim
                strokeWidth={1}
                size={80}
                className="text-gray-400"
              />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Замовлення оформлено!
            </h1>
            <p className="text-gray-400 text-sm font-medium max-w-sm mt-3">
              Дякуємо за покупку! Ваше замовлення обробляється, а деталі покупки
              надіслано на вашу електронну пошту.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 h-12 rounded-full px-10 border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
            >
              На головну
            </button>
          </div>
        </div>
      </div>
      <MailingSection />
    </>
  );
};
