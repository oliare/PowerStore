import { Input, Form, ConfigProvider } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import { MailingSection } from "../HomePage/mailingSection";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { useLoginMutation } from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import type { LoginRequest } from "../../types/user/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [form] = Form.useForm();

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

  const onFinish = async (values: LoginRequest) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials({ accessToken: result.accessToken }));
      console.log("Login successful, token stored in Redux:", result.accessToken);
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

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
        .form-loading-overlay {
          pointer-events: none;
          opacity: 0.6;
          filter: grayscale(20%);
          transition: all 0.3s ease;
        }
      `}</style>

      <Header />

      <main className="flex-grow flex items-center justify-center py-10">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 rounded-3xl backdrop-blur-[1px]">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-2" />
              <p className="text-brand-primary font-semibold font-montserrat">
                Вхід у систему...
              </p>
            </div>
          )}

          <div className={`${isLoading ? "form-loading-overlay" : ""}`}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 font-montserrat">
                Вхід
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
                onFinish={onFinish}
              >
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

                <div className="flex items-center justify-between px-2 mb-6">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <div className="flex items-center gap-2 font-manrope">
                      <input
                        type="checkbox"
                        id="remember"
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Запам'ятати
                      </label>
                    </div>
                  </Form.Item>
                  <a
                    href="#"
                    className="text-sm text-brand-primary font-semibold hover:underline font-manrope"
                  >
                    Забули пароль?
                  </a>
                </div>
                {error && (
                  <div className="mb-4 text-center text-red-500 text-sm font-montserrat">
                    Невірний логін або пароль
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-brand-primary text-white font-semibold tracking-wide hover:bg-brand-dark shadow-lg shadow-brand-primary/25 transition-all active:scale-[0.98]"
                >
                  {isLoading ? "Зачекайте..." : "Увійти"}{" "}
                </button>
              </Form>
            </ConfigProvider>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600 font-montserrat">
                Немає аккаунту?
                <a
                  href="/register"
                  className="text-brand-primary font-semibold hover:underline ml-2"
                >
                  Зареєструватися
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <MailingSection />
      <Footer />
    </div>
  );
};
