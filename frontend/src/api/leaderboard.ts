import apiClient from './client';

export const getLeaderboardApi = async (mode?: 'quickplay' | 'daily'): Promise<any> => {
  const response = await apiClient.get('/leaderboard', {
    params: { mode },
  });
  return response.data;
};
