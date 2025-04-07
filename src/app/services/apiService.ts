import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiService = {
  register: async (userData: any) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  }
};