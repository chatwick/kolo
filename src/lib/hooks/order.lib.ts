import api from "@/config/axios.config";
import { OrderStatusEnum } from "@/constants/order.constants";
import { QUERY_MUTATION_KEYS } from "@/constants/payments.constants";
import { IOrder } from "@/interfaces/order.interface";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Function to fetch all orders
const fetchOrders = async () => {
  const response = await api.get("/orders");
  return response.data as IOrder[];
};

const getOrdersByVendorId = async (vendorId: string) => {
  const response = await api.get(`/orders/vendor/${vendorId}`);
  return response.data as IOrder[];
};

// Function to update the order status
const updateOrderStatus = async (data: {
  orderId: string;
  status: OrderStatusEnum;
  order: IOrder;
}) => {
  const response = await api.put(
    `/orders/${data.orderId}/status/${data.status}`,
  );
  return response.data;
};
// Function to update the order product status
const updateOrderProductStatus = async (data: {
  orderId: string;
  status: OrderStatusEnum;
  itemId: string;
}) => {
  const response = await api.put(
    `/orders/${data.orderId}/orderItems/${data.itemId}/status/${data.status}`,
  );
  return response.data;
};

export const useGetOrders = () => {
  return useQuery({
    queryKey: [QUERY_MUTATION_KEYS.ORDERS, "all"],
    queryFn: fetchOrders,
  });
};

export const useUpdateOrderStatus = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updateOrderStatus,
    mutationKey: [QUERY_MUTATION_KEYS.ORDERS, "updateStatus"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.ORDERS],
      });
      toast.success("Order status updated successfully");
    },
  });
};
export const useUpdateOrderProductStatus = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updateOrderProductStatus,
    mutationKey: [QUERY_MUTATION_KEYS.ORDERS, "update-product-status"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.ORDERS],
      });
      toast.success("Order product status updated successfully");
    },
  });
};

// Function to fetch orders by vendor ID
export const useGetOrdersByVendorId = (vendorId: string) => {
  return useQuery({
    queryKey: [QUERY_MUTATION_KEYS.ORDERS, vendorId],
    queryFn: () => getOrdersByVendorId(vendorId),
    enabled: !!vendorId,
  });
};
