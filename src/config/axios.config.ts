import useAuthStore from "@/stores/auth.store";
import axios, { type AxiosInstance } from "axios";

// axios instance with base url
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// axios request interceptor
// intercepts all requests and adds the token to the header
// if the token is available in the store
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("Error in axiosInstance request", error);
    return Promise.reject(error);
  },
);

// axios response interceptor
// intercepts all responses and returns the response data
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error in axiosInstance response", error);
    const customError = {
      ...error,
      message: error.response?.data?.message || error.message,
    };
    return Promise.reject(customError);
  },
);

export default axiosInstance;
