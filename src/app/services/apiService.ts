// services/apiService.ts
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserData {
  username: string;
  email: string;
  password: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  datetime: string;
  categories: string[];
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  locationLandmark: string;
  newsSourceLink: string | null;
  mediaUrls: string[];
  latitude: number;
  longitude: number;
  locationAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T = unknown> {
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

  getReports: async (): Promise<ApiResponse<Report[]>> => {
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      return {
        success: false,
        error: 'Failed to fetch reports. Please try again.',
      };
    }
  },
};