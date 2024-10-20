import api from "@/config/axios.config";
import { COMMON_ENTITY_STATUS } from "@/constants/common.constants";
import { QUERY_MUTATION_KEYS } from "@/constants/payments.constants";
import {
  ICreateProductRequestDTO,
  IProduct,
} from "@/interfaces/product.interface";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const getProducts = async () => {
  const response = await api.get("/products");
  return response.data as IProduct[];
};

// API function to create product
const createProduct = async (data: ICreateProductRequestDTO) => {
  const response = await api.post("/products", data);
  return response.data;
};

const updateProductById = async (data: {
  id: string;
  data: Partial<IProduct>;
}) => {
  const response = await api.put(`/products/${data.id}`, data.data);
  return response.data;
};

const updateProductStatus = async (data: {
  prodId: string;
  product: IProduct;
  status: COMMON_ENTITY_STATUS;
}) => {
  const response = await api.put(
    `/products/${data.prodId}/status/${data.status}`,
  );
  return response.data;
};

export const useGetProducts = () => {
  return useQuery({
    queryKey: [QUERY_MUTATION_KEYS.PRODUCTS, "all"],
    queryFn: getProducts,
    refetchOnMount: false,
  });
};

const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Function to fetch a product by ID
const fetchProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data as IProduct;
};

// Hook to use the createProduct function
export const useCreateProduct = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: createProduct,
    mutationKey: [QUERY_MUTATION_KEYS.PRODUCTS, "create"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.PRODUCTS],
      });
      toast.success("Product created successfully");
    },
  });
};

// Hook to use the deleteProduct function
export const useUpdateProductStatus = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updateProductStatus,
    mutationKey: [QUERY_MUTATION_KEYS.PRODUCTS, "updateStatus"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.PRODUCTS],
      });
      toast.success("Product status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product status");
    },
  });
};

export const useDeleteProduct = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: deleteProduct,
    mutationKey: [QUERY_MUTATION_KEYS.PRODUCTS, "delete"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.PRODUCTS],
      });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting product");
    },
  });
};

// Function to fetch product by ID
export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_MUTATION_KEYS.PRODUCTS, id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

export const useUpdateProductById = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updateProductById,
    mutationKey: [QUERY_MUTATION_KEYS.PRODUCTS, "update"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.PRODUCTS],
      });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update product");
      console.error("Error updating product:", error);
    },
  });
};
