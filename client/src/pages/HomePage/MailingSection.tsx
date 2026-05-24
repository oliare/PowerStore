/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSubscribeToNewsletterMutation } from "../../services/newsletterApi.ts";
import { showNotify } from "../../utils/showNotify.ts";

export const MailingSection = () => {
  const [email, setEmail] = useState("");

  const [subscribe, { isLoading }] = useSubscribeToNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      showNotify.warn("Будь ласка, введіть вашу електронну адресу!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showNotify.error("Введіть коректний формат електронної пошти!");
      return;
    }

    try {
      await subscribe({ email: trimmedEmail }).unwrap();

      showNotify.success(
        "Дякуємо за підписку! Ви успішно підписалися на новини.",
      );

      setEmail("");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Щось пішло не так. Спробуйте пізніше.";

      showNotify.error(errorMessage);
    }
  };

  return (
    <section className="bg-[#F2F2F2] py-10 px-4 font-montserrat">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left">
          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Підпишіться на розсилку
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Отримуйте актуальні новини та акції.
          </p>
        </div>

        <form
          className="relative w-full max-w-xl flex items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="Ваша електронна адреса"
              className="text-sm w-full pl-6 pr-40 py-4 rounded-full bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-gray-800 font-montserrat disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-8 py-2 rounded-full bg-brand-primary text-white font-semibold text-sm hover:bg-brand-dark transition-all active:scale-95 font-montserrat disabled:bg-gray-400 disabled:scale-100"
            >
              {isLoading ? "Обробка..." : "Підписатися"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
