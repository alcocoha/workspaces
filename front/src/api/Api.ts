import axios, { AxiosResponse, Method } from 'axios';

const API_BASE_URL = 'http://localhost:4000/'; // Reemplaza esto con la URL de tu API

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const apiRequest = async <T>(method: Method, path: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await axios({
      method,
      url: `${API_BASE_URL}${path}`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      message: 'An error occurred while processing your request.',
    };
  }
};

export default apiRequest;
