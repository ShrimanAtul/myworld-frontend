import apiClient from './client';
import { AiAnalysisRequest, AiAnalysisResponse, CachedAiResponse, AiAnalysisType } from '../types/ai';

export const aiApi = {
  analyze: async (data: AiAnalysisRequest): Promise<AiAnalysisResponse> => {
    const response = await apiClient.post<AiAnalysisResponse>('/ai/analyze', data);
    return response.data;
  },
  getCachedResponses: async (type: AiAnalysisType): Promise<CachedAiResponse[]> => {
    const response = await apiClient.get<CachedAiResponse[]>('/ai/cache', {
      params: { type },
    });
    return response.data;
  },

    deleteCache: async (id: string): Promise<void> => {
    await apiClient.delete(`/ai/cache/${id}`);
  },
  regenerateCache: async (id: string, data: AiAnalysisRequest): Promise<CachedAiResponse> => {
    const response = await apiClient.post<CachedAiResponse>(`/ai/cache/${id}/regenerate`, data);
    return response.data;
  },
  clearCache: async (type: AiAnalysisType): Promise<void> => {
    await apiClient.delete('/ai/cache/clear', {
      params: { type },
    });
  },
};
