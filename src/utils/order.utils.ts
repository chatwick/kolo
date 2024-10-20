/* eslint-disable no-unused-vars */
import { COMMON_ENTITY_STATUS } from "@/constants/common.constants";
import { OrderStatusEnum } from "@/constants/order.constants";

export const orderStatusMaptoString: { [key in OrderStatusEnum]: string } = {
  [OrderStatusEnum.Processing]: "Processing",
  [OrderStatusEnum.Dispatched]: "Dispatched",
  [OrderStatusEnum.Partial]: "Partially delivered",
  [OrderStatusEnum.Delivered]: "Delivered",
  [OrderStatusEnum.Cancelled]: "Cancelled",
};
export const commonStatusMaptoString: {
  [key in COMMON_ENTITY_STATUS]: string;
} = {
  [COMMON_ENTITY_STATUS.DISABLED]: "Disabled",
  [COMMON_ENTITY_STATUS.ENABLED]: "Enabled",
};
