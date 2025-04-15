// services/apiService.ts
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserData {
  username: string;
  email: string;
  password: string;
  // add other fields as needed
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiService = {
  register: async (userData: UserData): Promise<ApiResponse> => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },
};