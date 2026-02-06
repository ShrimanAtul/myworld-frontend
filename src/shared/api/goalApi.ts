import apiClient from './client';
import { Goal } from '../types/goal';

export const goalApi = {
  createGoal: async (data: Partial<Goal>): Promise<Goal> => {
    const response = await apiClient.post<Goal>('/goals', data);
    return response.data;
  },

  getGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>('/goals');
    return response.data;
  },

  getGoal: async (id: string): Promise<Goal> => {
    const response = await apiClient.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  updateGoal: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    const response = await apiClient.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  deleteGoal: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`);
  },
};
