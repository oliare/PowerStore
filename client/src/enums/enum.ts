export const DeliveryType = {
  NovaPoshta: 0,
  UkrPoshta: 1,
  Courier: 2,
} as const;
export type DeliveryType = (typeof DeliveryType)[keyof typeof DeliveryType];

export const PaymentType = {
  CashOnDelivery: 1,
  Card: 2,
} as const;
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const OrderStatus = {
  Pending: 0,
  Paid: 1,
  Shipped: 2,
  Completed: 3,
  Cancelled: 4,
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
