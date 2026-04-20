import { Input, Form, ConfigProvider } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import { MailingSection } from "../HomePage/MailingSection";
import { Eye, EyeOffIcon } from "lucide-react";

export const RegistrationPage = () => {
  const commonInputStyle: React.CSSProperties = {
    fontFamily: "Montserrat, sans-serif",
    width: "100%",
    padding: "10px 24px",
    borderRadius: "9999px",
    backgroundColor: "#f9fafb",
    border: "1px solid #E5E7EB",
    transition: "all 0.2s ease-in-out",
    outline: "none",
  };

  const [form] = Form.useForm();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <style>{`
        .ant-form-item-has-error input, 
        .ant-form-item-has-error .ant-input-password {
          border-color: #ff4d4f !important;
          background-color: #fff6f5 !important;
        }
        .ant-form-item-explain-error {
          padding-left: 15px;
          margin-top: 4px;
          margin-bottom: 10px;
          font-size: 12px;
        }
        .custom-input:focus, .custom-input:hover,
        .custom-input-password:focus-within, .custom-input-password:hover {
          background-color: #ffffff !important;
          border-color: #D1D5DB !important;
          box-shadow: 0 0 0 2px rgba(229, 231, 235, 0.5);
        }
      `}</style>

      <Header />

      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 font-montserrat">
              Реєстрація
            </h1>
          </div>

          <ConfigProvider
            theme={{
              token: {
                colorError: "#ff4d4f",
                fontFamily: "Montserrat, sans-serif",
              },
              components: {
                Form: {
                  itemMarginBottom: 20,
                },
              },
            }}
          >
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={(values) => console.log("Success:", values)}
            >
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: "Введіть ім'я" }]}
                >
                  <Input
                    placeholder="Ім'я"
                    variant="borderless"
                    style={commonInputStyle}
                    className="custom-input"
                  />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: "Введіть прізвище" }]}
                >
                  <Input
                    placeholder="Прізвище"
                    variant="borderless"
                    style={commonInputStyle}
                    className="custom-input"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Будь ласка, введіть Email" },
                  { type: "email", message: "Некоректний формат Email" },
                ]}
              >
                <Input
                  placeholder="Email"
                  variant="borderless"
                  style={commonInputStyle}
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Введіть номер телефону" },
                  {
                    pattern: /^(\+380|380|0)[0-9]{9}$/,
                    message: "Формат: +380XXXXXXXXX або 0XXXXXXXXX",
                  },
                ]}
              >
                <Input
                  placeholder="Телефон"
                  variant="borderless"
                  maxLength={13}
                  style={commonInputStyle}
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Будь ласка, введіть пароль" },
                  { min: 6, message: "Мінімум 6 символів" },
                  { pattern: /[A-Z]/, message: "Додайте велику літеру" },
                  { pattern: /[0-9]/, message: "Додайте цифру" },
                ]}
              >
                <Input.Password
                  placeholder="Пароль"
                  variant="borderless"
                  style={commonInputStyle}
                  iconRender={(visible) =>
                    visible ? (
                      <Eye size={20} color="#9CA3AF" />
                    ) : (
                      <EyeOffIcon size={20} color="#9CA3AF" />
                    )
                  }
                  className="custom-input-password text-[14px]"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Підтвердіть пароль" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Паролі не співпадають"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Підтвердіть пароль"
                  variant="borderless"
                  style={commonInputStyle}
                  iconRender={(visible) =>
                    visible ? (
                      <Eye size={20} color="#9CA3AF" />
                    ) : (
                      <EyeOffIcon size={20} color="#9CA3AF" />
                    )
                  }
                  className="custom-input-password text-[14px]"
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Потрібна ваша згода")),
                  },
                ]}
              >
                <div className="flex items-start gap-2 px-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 cursor-pointer w-4 h-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-500 cursor-pointer leading-tight font-montserrat"
                  >
                    Я згоден з{" "}
                    <a
                      href="#"
                      className="text-brand-primary font-semibold hover:underline"
                    >
                      Умовами використання
                    </a>{" "}
                    та Політикою конфіденційності
                  </label>
                </div>
              </Form.Item>

              <button
                type="submit"
                className="w-full tracking-wider py-3.5 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-dark shadow-lg shadow-brand-primary/25 transition-all active:scale-[0.98]"
              >
                Зареєструватися
              </button>
            </Form>
          </ConfigProvider>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600 font-montserrat">
              Вже маєте аккаунт?
              <a
                href="/login"
                className="text-brand-primary font-semibold hover:underline ml-2"
              >
                Увійти
              </a>
            </p>
          </div>
        </div>
      </main>

      <MailingSection />
      <Footer />
    </div>
  );
};
