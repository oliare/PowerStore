import { MapPin, Mail, Phone, Send, Loader2 } from "lucide-react";
import { MailingSection } from "./HomePage/MailingSection";
import { useSendMessageMutation } from "../services/userApi";
import { useState } from "react";
import { showNotify } from "../utils/showNotify";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sendMessage, { isLoading, isSuccess, isError }] =
    useSendMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage(formData).unwrap();

      setFormData({ name: "", email: "", subject: "", message: "" });
      showNotify.success("Ваше повідомлення було доставлено!");
    } catch (err) {
      console.error("Помилка відправки:", err);
      showNotify.error(
        "Не вдалося надіслати повідомлення. Перевірте з'єднання.",
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white min-h-screen font-montserrat">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="lg:w-1/3 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 flex flex-col justify-between">
            <div className="p-8 flex flex-col items-center text-center text-sm">
              <MapPin
                strokeWidth={1}
                className="text-brand-primary mb-4"
                size={35}
              />
              <p className="text-gray-600 leading-relaxed">
                вул. Енергетиків, 12, <br />
                Київ, Україна 01001
              </p>
            </div>
            <div className="border border-gray-200/70 w-[80%] mx-auto" />
            <div className="p-8 flex flex-col items-center text-center text-sm">
              <Mail
                strokeWidth={1}
                className="text-brand-primary mb-4"
                size={35}
              />
              <p className="text-gray-600 italic">
                support@electro-shop.ua <br />
                info@electro-shop.ua
              </p>
            </div>
            <div className="border border-gray-200/70 w-[80%] mx-auto" />
            <div className="p-8 flex flex-col items-center text-center text-sm">
              <Phone
                strokeWidth={1}
                className="text-brand-primary mb-4"
                size={35}
              />
              <p className="text-gray-600">
                (044) 555-01-14 <br />
                (067) 333-04-87
              </p>
            </div>
          </div>

          <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-8 md:p-10">
            <h2 className="text-3xl font-semibold text-gray-900 mb-5">
              Просто скажіть "Привіт!"
            </h2>
            <p className="text-gray-500 mb-8 text-sm">
              Маєте питання щодо вибору автоматики чи потрібна допомога з
              проєктом? Напишіть нам, і ми відповімо протягом години.
            </p>
            {isSuccess && (
              <p className="text-sm text-green-600 mb-4 bg-green-50 p-3 rounded-lg border border-green-100">
                Ваше повідомлення було доставлено!
              </p>
            )}
            {isError && (
              <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                Хм... Не вдалося надіслати повідомлення.
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-sm w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Email адреса"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-sm w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                />
              </div>

              <input
                type="text"
                placeholder="Тема повідомлення"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="text-sm w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              />

              <textarea
                placeholder="Ваше повідомлення..."
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="text-sm w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all resize-none"
              />

              <button
                type="submit"
                className="bg-brand-primary text-white px-10 py-2.5 rounded-full font-semibold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Надсилання...
                  </>
                ) : (
                  <>
                    Надіслати повідомлення
                    <Send
                      size={18}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full h-[450px] bg-gray-100 transition-all duration-700">
        <iframe
          title="office location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d162758.44346142728!2d30.367843864070797!3d50.40169904791763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf4ee15a4505%3A0x7649317428c69610!2z0JrQuNGX0LIsIDAyMDAw!5e0!3m2!1suk!2sua!4v1714670000000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      <MailingSection />
    </div>
  );
};

export default ContactPage;
