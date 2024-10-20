import api from "@/config/axios.config";
import { QUERY_MUTATION_KEYS } from "@/constants/payments.constants";
import {
  ICreateUserDTO,
  ILoginUserRequestDTO,
  ILoginUserResponseDTO,
  IUser,
} from "@/interfaces/user.interface";
import { QueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// function for creating user accounts. Payload as ICreateUserDTO
const createUser = async (data: ICreateUserDTO) => {
  const response = await api.post("/auth/register", data);
  return response.data as { message: string; user: IUser };
};

const loginUser = async (data: ILoginUserRequestDTO) => {
  const response = await api.post("/auth/login", data);
  return response.data as ILoginUserResponseDTO;
};

// hook for creating user accounts. Payload as ICreateUserDTO. Cals createUser function
export const useCreateUser = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: createUser,
    mutationKey: [QUERY_MUTATION_KEYS.USERS, "register"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.USERS, "register"],
      });
      toast.success("Account created successfully");
    },
  });
};

// hook for logging in user accounts. Payload as ILoginUserDTO. Calls loginUser function
export const useLoginUser = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: loginUser,
    mutationKey: [QUERY_MUTATION_KEYS.USERS, "login"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_MUTATION_KEYS.USERS, "login"],
      });
    },
  });
};
