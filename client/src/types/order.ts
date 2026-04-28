import { DeliveryType, OrderStatus, PaymentType } from "../enums/enum";

export interface OrderItemCreateDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  street?: string;
  house?: string;
  apartment?: string;
  warehouseNumber?: string;
  totalPrice: number;
  deliveryMethod: DeliveryType;
  paymentType: PaymentType;
  customerNote?: string;
  items: OrderItemCreateDto[];
}

export interface OrderItemDto {
  productId: string;
  productName: string;
  image?: string;
  quantity: number;
  price: number;
}

export interface OrderDto {
  id: string;
  city: string;
  deliveryAddress?: string;
  totalPrice: number;
  deliveryType: DeliveryType;
  paymentType: PaymentType;
  status: OrderStatus;
  trackingNumber?: string;
  customerNote?: string;
  createdAt: string;
  items: OrderItemDto[];
}