import apiClient from './client';

export interface QuickPlayFinishData {
  score: number;
  correctAnswers: number;
  hintsUsed: number;
}

export const startQuickPlayApi = async (): Promise<any> => {
  const response = await apiClient.post('/quickplay/start');
  return response.data;
};

export const finishQuickPlayApi = async (data: QuickPlayFinishData): Promise<any> => {
  const response = await apiClient.post('/quickplay/finish', data);
  return response.data;
};

export const getQuickPlayHistoryApi = async (): Promise<any> => {
  const response = await apiClient.get('/quickplay/history');
  return response.data;
};
