import apiClient from './client';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  message?: string;
}

export const signupApi = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', { username, email, password });
  return response.data;
};

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const getMeApi = async (): Promise<any> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
