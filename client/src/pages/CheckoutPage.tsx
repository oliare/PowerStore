import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Radio, Divider, ConfigProvider } from "antd";
import {
  CreditCard,
  Banknote,
  Truck,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { DeliveryType, PaymentType } from "../enums/enum";
import { useCreateOrderMutation } from "../services/orderApi";
import type { OrderCreateDto } from "../types/order";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useClearCartMutation } from "../services/cartApi";
import { useGetMeQuery } from "../services/userApi";
import {
  clearCart as clearCartLocal,
  removeFromCart,
  updateQuantity,
} from "../store/cartSlice";
import { PLACEHOLDER_IMAGE_URL } from "../api/api";
import { MailingSection } from "./HomePage/MailingSection";
import { showNotify } from "../utils/showNotify";

export const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user } = useGetMeQuery();
  const isAuth = !!user;
  const [clearCartApi] = useClearCartMutation();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const deliveryMethod = Form.useWatch("deliveryMethod", form);
  const isPostalDelivery =
    deliveryMethod === DeliveryType.NovaPoshta ||
    deliveryMethod === DeliveryType.UkrPoshta;
  const isCourier = deliveryMethod === DeliveryType.Courier;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber?.replace("+380", "").replace(/\s/g, "") || "",
      });
    }
  }, [user, form]);

  useEffect(() => {
    form
      .validateFields(["city", "street", "house", "warehouseNumber"])
      .catch(() => {});
  }, [deliveryMethod, form]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  console.log("Cart total ", cartTotal);

  const totalBeforeDiscount = cartItems.reduce((sum, item) => {
    const originalPrice =
      item.isOnSale && item.discountPrice ? item.discountPrice : item.price;

    return sum + originalPrice * item.quantity;
  }, 0);

  const hasAnyDiscount = totalBeforeDiscount > cartTotal;

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const item = cartItems.find((i) => i.productId === productId);

    if (!item) return;

    if (newQuantity > (item.stockQuantity ?? 0)) {
      showNotify.error(
        `Вибачте, на складі залишилося лише ${item.stockQuantity} шт.`,
      );
      return;
    }

    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const onFinish = async (values: OrderCreateDto) => {
    const newOrder: OrderCreateDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      city: values.city,
      deliveryMethod: values.deliveryMethod,
      paymentType: values.paymentType,
      totalPrice: cartTotal,
      customerNote: values.customerNote,
      street: isCourier ? values.street : undefined,
      house: isCourier ? values.house : undefined,
      apartment: isCourier ? values.apartment : undefined,
      warehouseNumber: isPostalDelivery ? values.warehouseNumber : undefined,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await createOrder(newOrder).unwrap();
      showNotify.success("Замовлення успішно оформлено!");
      if (isAuth) await clearCartApi().unwrap();
      dispatch(clearCartLocal());
      navigate("/order-success", { state: { orderId: response.id } });
    } catch (err) {
      console.error("Помилка замовлення:", err);
      showNotify.error(
        "Сталася помилка при оформленні замовлення. Спробуйте ще раз пізніше.",
      );
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "Montserrat, sans-serif",
    width: "100%",
    padding: "10px 24px",
    borderRadius: "9999px",
    border: "1px solid #E5E7EB",
  };

  return (
    <div className="min-h-screen">
      <div className="py-12 px-4 max-w-7xl mx-auto mb-10">
        <ConfigProvider
          theme={{
            token: {
              colorError: "#e63946",
              colorErrorBorder: "#e63946",
              colorErrorOutline: "rgba(230,57,70,0.06)",
              fontSize: 14,
              fontFamily: "Montserrat, sans-serif",
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            validateTrigger={["onBlur", "onChange"]}
            requiredMark={false}
            scrollToFirstError={{ behavior: "smooth", block: "center" }}
            className="checkout-form"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
              <div className="space-y-12">
                <section>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                    Контактні дані
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <Form.Item
                      name="firstName"
                      label="Ім'я"
                      rules={[{ required: true, message: "Введіть ім'я" }]}
                    >
                      <Input
                        placeholder="Ваше ім'я"
                        style={inputStyle}
                        className="h-11"
                      />
                    </Form.Item>

                    <Form.Item
                      name="lastName"
                      label="Прізвище"
                      rules={[{ required: true, message: "Введіть прізвище" }]}
                    >
                      <Input
                        placeholder="Ваше прізвище"
                        style={inputStyle}
                        className="h-11"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Електронна пошта"
                      rules={[
                        { required: true, message: "Введіть пошту" },
                        { type: "email", message: "Невірний формат пошти" },
                      ]}
                    >
                      <Input
                        placeholder="email@example.com"
                        style={inputStyle}
                        className="h-11"
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Телефон"
                      rules={[
                        { required: true, message: "Введіть номер" },
                        {
                          pattern: /^[0-9]{9,10}$/,
                          message: "Введіть коректну кількість цифр",
                        },
                      ]}
                    >
                      <Input
                        placeholder="67 000 00 00"
                        prefix={<span className="mr-1 text-gray-400">+38</span>}
                        style={inputStyle}
                        className="h-11"
                        maxLength={10}
                      />
                    </Form.Item>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Доставка та оплата
                  </h2>

                  <Form.Item
                    name="deliveryMethod"
                    rules={[
                      { required: true, message: "Оберіть спосіб доставки" },
                    ]}
                  >
                    <Radio.Group className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Radio
                        value={DeliveryType.NovaPoshta}
                        className="custom-radio-pill"
                      >
                        <div className="flex items-center gap-3">
                          <Truck size={20} className="text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Нова Пошта
                          </span>
                        </div>
                      </Radio>
                      <Radio
                        value={DeliveryType.UkrPoshta}
                        className="custom-radio-pill"
                      >
                        <div className="flex items-center gap-3">
                          <Truck size={20} className="text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Укрпошта
                          </span>
                        </div>
                      </Radio>
                      <Radio
                        value={DeliveryType.Courier}
                        className="custom-radio-pill"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag size={20} className="text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Кур'єром
                          </span>
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  {isPostalDelivery && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
                      <Form.Item
                        name="city"
                        label="Місто"
                        rules={[{ required: true, message: "Введіть місто" }]}
                      >
                        <Input
                          placeholder="Наприклад: Київ"
                          style={inputStyle}
                          className="h-11"
                        />
                      </Form.Item>
                      <Form.Item
                        name="warehouseNumber"
                        label="Номер відділення"
                        rules={[
                          {
                            required: true,
                            message: "Введіть номер відділення",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Наприклад: 12"
                          style={inputStyle}
                          className="h-11"
                        />
                      </Form.Item>
                    </div>
                  )}

                  {isCourier && (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_0.5fr_0.5fr] gap-x-4 gap-y-2 mt-4">
                      <Form.Item
                        name="city"
                        label="Місто"
                        rules={[{ required: true, message: "Введіть місто" }]}
                      >
                        <Input
                          placeholder="Місто"
                          style={inputStyle}
                          className="h-11"
                        />
                      </Form.Item>
                      <Form.Item
                        name="street"
                        label="Вулиця"
                        rules={[{ required: true, message: "Введіть вулицю" }]}
                      >
                        <Input
                          placeholder="Вулиця"
                          style={inputStyle}
                          className="h-11"
                        />
                      </Form.Item>
                      <Form.Item
                        name="house"
                        label="Будинок"
                        rules={[{ required: true, message: "Введіть будинок" }]}
                      >
                        <Input
                          placeholder="№"
                          style={inputStyle}
                          className="h-11"
                        />
                      </Form.Item>
                      <Form.Item name="apartment" label="Кв.">
                        <Input
                          placeholder="Кв."
                          style={inputStyle}
                          className="h-11"
                        />
                      </Form.Item>
                    </div>
                  )}

                  <Divider className="my-6" />

                  <Form.Item
                    name="paymentType"
                    label="Спосіб оплати"
                    rules={[
                      { required: true, message: "Оберіть спосіб оплати" },
                    ]}
                  >
                    <Radio.Group className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Radio
                        value={PaymentType.CashOnDelivery}
                        className="custom-radio-pill"
                      >
                        <div className="flex items-center gap-3">
                          <Banknote size={20} className="text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Готівка{" "}
                            <span className="text-[12px] text-gray-400">
                              (при отриманні)
                            </span>
                          </span>
                        </div>
                      </Radio>
                      <Radio
                        value={PaymentType.Card}
                        className="custom-radio-pill"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard size={20} className="text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Картка{" "}
                            <span className="text-[12px] text-gray-400">
                              (при отриманні)
                            </span>
                          </span>
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="customerNote"
                    label="Коментар до замовлення"
                    className="mt-4"
                  >
                    <Input.TextArea
                      placeholder="Додаткові побажання..."
                      style={{
                        ...inputStyle,
                        borderRadius: "24px",
                        padding: "12px 24px",
                      }}
                      rows={3}
                    />
                  </Form.Item>
                </section>
              </div>

              <div className="border border-gray-100 rounded-3xl p-6 lg:sticky lg:top-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  Ваше замовлення
                  <span className="text-brand-primary text-sm font-bold bg-brand-primary/10 px-3 py-1 rounded-full">
                    {cartItems.length}
                  </span>
                </h2>

                <div className="space-y-6 min-h-[270px] max-h-[300px] overflow-y-auto mb-4 pr-2 custom-scrollbar">
                  {cartItems.map((item) => {
                    const hasDiscount = item.isOnSale && item.discountPrice;

                    return (
                      <div
                        key={item.productId}
                        className="group flex gap-4 pb-5 border-b border-gray-50 last:border-none"
                      >
                        <div className="relative w-20 h-20 shrink-0">
                          <img
                            src={item.productImage || PLACEHOLDER_IMAGE_URL}
                            alt={item.productName}
                            className={`w-full h-full object-cover rounded-2xl border border-gray-100 relative z-0 ${
                              item.stockQuantity === 0
                                ? "grayscale opacity-50"
                                : ""
                            }`}
                          />
                          {hasDiscount && (
                            <span className="absolute -bottom-1 left-0.5 bg-brand-primary text-white text-[9px] px-1.5 py-0.5 rounded-md font-semibold z-10 shadow-sm">
                              -{item.discountPercentage}%
                            </span>
                          )}
                          <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white z-10">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                              {item.productName}
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(removeFromCart(item.productId))
                              }
                              className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center bg-gray-50 rounded-full p-0.5 border border-gray-100">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center hover:text-brand-primary"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="px-2 text-xs font-bold font-manrope">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center hover:text-brand-primary"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <div className="flex flex-col items-end">
                              {hasDiscount ? (
                                <>
                                  <span className="text-[13px] text-gray-400 line-through font-manrope leading-none mb-1">
                                    ₴
                                    {(
                                      item.discountPrice! * item.quantity
                                    ).toFixed(2)}
                                  </span>

                                  <span className="text-base font-black font-manrope leading-none text-red-500">
                                    ₴{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-base font-black font-manrope leading-none text-gray-900">
                                  ₴{(item.price * item.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 pt-6 border-t border-dashed border-gray-200">
                  {hasAnyDiscount && (
                    <div className="flex justify-between text-gray-400 text-sm px-1">
                      <span>Без знижки:</span>
                      <span className="line-through font-manrope text-[15px]">
                        ₴{totalBeforeDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 font-medium text-sm px-1">
                    <span>Товари на суму:</span>
                    <span className="text-gray-900 font-semibold text-base font-manrope">
                      ₴{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-base font-semibold text-gray-900">
                      До сплати:
                    </span>
                    <span className="text-2xl font-black text-brand-primary font-manrope">
                      ₴{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingOrder || cartItems.length === 0}
                  className="w-full h-11 mt-8 bg-brand-primary hover:bg-brand-dark disabled:bg-gray-200 text-white rounded-full font-semibold shadow-2xl shadow-brand-primary/30 transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-sm"
                >
                  {isCreatingOrder ? "Обробка..." : "Підтвердити замовлення"}
                </button>
              </div>
            </div>
          </Form>
        </ConfigProvider>
      </div>

      <style>{`
        .ant-form-item-has-error input, 
          .ant-form-item-has-error .ant-input-password {
            border-color: #ff4d4f !important;
            background-color: #fff6f5 !important;
          }
          .ant-form-item-has-error .ant-input-affix-wrapper {
            border-color: #ff4d4f !important;
            background-color: #fff6f5 !important;
          }
          .ant-form-item-has-error .custom-radio-pill {
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
        .checkout-form .ant-form-item-label label {
          font-weight: 700 !important;
          font-size: 11px !important;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #6B7280 !important;
        }
        .custom-radio-pill {
          display: flex !important;
          align-items: center;
          padding: 10px 24px !important;
          border: 1px solid #E5E7EB !important;
          border-radius: 9999px !important;
          width: 100%;
          background: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ant-radio-wrapper-checked.custom-radio-pill {
          border-color: var(--brand-primary) !important;
          transform: translateY(-2px);
        }
        .ant-radio { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bdbdbd; border-radius: 10px; }
      `}</style>

      <MailingSection />
    </div>
  );
};
