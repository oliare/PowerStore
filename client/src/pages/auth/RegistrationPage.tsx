import { Input, Form, ConfigProvider } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import { MailingSection } from "../HomePage/mailingSection";
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
      `}</style>

      <Header />

      <main className="flex-grow flex items-center justify-center py-10">
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
              <Form.Item
                name="userName"
                rules={[
                  { required: true, message: "Будь ласка, введіть ім'я" },
                ]}
              >
                <Input
                  placeholder="Ваше ім'я"
                  variant="borderless"
                  style={commonInputStyle}
                  className="focus:!bg-white focus:!border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </Form.Item>

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
                  className="focus:!bg-white focus:!border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Будь ласка, введіть пароль" },
                  { min: 6, message: "Мінімум 6 символів" },
                  { pattern: /[A-Z]/, message: "Хоча б одна велика літера" },
                  { pattern: /[a-z]/, message: "Хоча б одна мала літера" },
                  { pattern: /[0-9]/, message: "Хоча б одна цифра" },
                ]}
              >
                <Input.Password
                  placeholder="Пароль"
                  variant="borderless"
                  style={commonInputStyle}
                  iconRender={(visible) =>
                    visible ? (
                      <Eye color="gray" size={20} />
                    ) : (
                      <EyeOffIcon color="gray" size={20} />
                    )
                  }
                  className="text-[14px] focus-within:!bg-white focus-within:!border-gray-400 focus-within:ring-2 focus-within:ring-gray-200"
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
                      <Eye color="gray" size={20} />
                    ) : (
                      <EyeOffIcon color="gray" size={20} />
                    )
                  }
                  className="text-[14px] focus-within:!bg-white focus-within:!border-gray-400 focus-within:ring-2 focus-within:ring-gray-200"
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
                        : Promise.reject(
                            new Error("Ви повинні погодитися з умовами"),
                          ),
                  },
                ]}
              >
                <div className="flex items-start gap-2 px-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-600 cursor-pointer leading-tight font-montserrat"
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
                className="w-full py-3.5 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-dark shadow-lg shadow-brand-primary/25 transition-all active:scale-[0.98] mt-2"
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
                className="text-brand-primary font-bold hover:underline ml-2"
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
