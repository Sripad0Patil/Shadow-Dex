import apiClient from './client';

export interface DailyFinishData {
  completed: boolean;
  date?: string;
  hintsUsed?: number;
}

export interface DailyStatusResponse {
  success: boolean;
  completedToday: boolean;
  date: string;
  alreadyPlayed?: boolean;
}

export const getDailyStatusApi = async (date?: string): Promise<DailyStatusResponse> => {
  const response = await apiClient.get<DailyStatusResponse>('/daily/status', {
    params: date ? { date } : undefined,
  });
  return response.data;
};

export const startDailyApi = async (date?: string): Promise<any> => {
  const response = await apiClient.post('/daily/start', { date });
  return response.data;
};

export const finishDailyApi = async (data: DailyFinishData): Promise<any> => {
  const response = await apiClient.post('/daily/finish', data);
  return response.data;
};
