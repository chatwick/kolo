import { IBaseEntity } from "@/constants/common.constants";
import { OrderStatusEnum } from "@/constants/order.constants";
import { ORDER_PAYMENT_STATUS } from "@/constants/payments.constants";

export interface IOrderItem extends IBaseEntity {
  ProductId: string;
  Quantity: number;
  Status: OrderStatusEnum;
  Detail: string;
}

export interface IOrder extends IBaseEntity {
  CustomerId: string;
  Status: OrderStatusEnum;
  Address: string;
  OrderItems: IOrderItem[];
  Payment: string;
  PaymentStatus: ORDER_PAYMENT_STATUS;
  CancellationNote: string;
  Detail: string;
  Vendors: string[];
}
