import api from "@/config/axios.config";
import { QUERY_MUTATION_KEYS } from "@/constants/payments.constants";
import {
  ICreateInventoryRequestDTO,
  IInventory,
} from "@/interfaces/inventory.interface";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const getUserInventory = async (userId: string): Promise<IInventory> => {
  const response = await api.get(`/inventory/${userId}`);
  return response.data;
};

const createVendorInventory = async (
  data: ICreateInventoryRequestDTO,
): Promise<IInventory> => {
  const response = await api.post("/inventory", data);
  return response.data;
};

const updateInventory = async (data: IInventory) => {
  const response = await api.put(`/inventory/${data.Id}`, data);
  return response.data;
};
export const useGetUserInventory = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_MUTATION_KEYS.INVENTORY, userId],
    queryFn: () => getUserInventory(userId),
    enabled: !!userId,
  });
};

export const useCreateInventory = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: createVendorInventory,
    mutationKey: [QUERY_MUTATION_KEYS.INVENTORY, "create"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.PRODUCTS],
      });
      toast.success("Your inventory has been created successfully");
    },
  });
};

export const useUpdateInventoryMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updateInventory,
    mutationKey: [QUERY_MUTATION_KEYS.INVENTORY, "update"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.PRODUCTS],
      });
      toast.success("Your inventory has been updated successfully");
    },
  });
};
