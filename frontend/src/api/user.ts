import apiClient from './client';

export const getProfileApi = async (): Promise<any> => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};
