import api from "@/config/axios.config";
import { QUERY_MUTATION_KEYS } from "@/constants/payments.constants";
import { IUser, UpdateUserRequestDTO } from "@/interfaces/user.interface";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const updateUserProfile = async (data: {
  id: string;
  data: UpdateUserRequestDTO;
}): Promise<boolean> => {
  const response = await api.put(`user/${data.id}`, data.data);
  return response.data;
};

const getUserData = async (id: string): Promise<IUser> => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const response = await api.get("/user");
  return response.data;
};

// Function to update user status
const updateUserStatus = async (data: {
  userId: string;
  status: number;
}): Promise<boolean> => {
  const response = await api.put(`user/${data.userId}/status/${data.status}`);
  return response.data;
};

// const fetchUserNotifications = async (userId: string) => {
//   const response = await api.get(`inventory/notify/${userId}`);
//   return response.data;
// };

export const useUpdateUserProfile = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updateUserProfile,
    mutationKey: [QUERY_MUTATION_KEYS.USERS, "update"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.USERS],
      });
      toast.success("Profile updated successfully");
    },
  });
};

// Hook to query the current user data
export const useGetUserData = (id: string) => {
  return useQuery({
    queryKey: [QUERY_MUTATION_KEYS.USERS, id],
    queryFn: () => getUserData(id),
  });
};

// Hook to query all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: [QUERY_MUTATION_KEYS.USERS, "all"],
    queryFn: getAllUsers,
  });
};

export const useUpdateUserStatus = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: updateUserStatus,
    mutationKey: [QUERY_MUTATION_KEYS.USERS, "status"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("User status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });
};
