"use client";

import { IOrder, IOrderItem } from "@/interfaces/order.interface";
import { useGetProductById } from "@/lib/hooks/products.lib";
import { orderStatusMaptoString } from "@/utils/order.utils";

const OrderRow = ({
  order,
  item,
  index,
  onClick,
}: {
  order: IOrder;
  item: IOrderItem;
  index: number;
  onClick: () => void;
}) => {
  const { data: product } = useGetProductById(item.ProductId);

  return (
    <tr onClick={onClick} style={{ cursor: "pointer" }}>
      <td>{index + 1}</td>
      <td>{order.Id}</td>
      <td>{product ? product.Name : "Loading..."}</td>
      <td>{order.Address}</td>
      <td>{order.Payment}</td>
      <td>{orderStatusMaptoString[item.Status] || "Unknown Status"}</td>
    </tr>
  );
};

export default OrderRow;
