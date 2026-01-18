import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';
import { AiAnalysisType } from '../types/ai';

export const aiKeys = {
  cache: (type: AiAnalysisType) => ['ai', 'cache', type] as const,
};

export const useAiAnalyze = () => {
  return useMutation({
    mutationFn: aiApi.analyze,
  });
};

export const useCachedResponses = (type: AiAnalysisType) => {
  return useQuery({
    queryKey: aiKeys.cache(type),
    queryFn: () => aiApi.getCachedResponses(type),
  });
};

export const useDeleteCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: aiApi.deleteCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'cache'] });
    },
  });
};

export const useRegenerateCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => aiApi.regenerateCache(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'cache'] });
    },
  });
};

export const useClearCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: aiApi.clearCache,
    onSuccess: (_, type) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.cache(type) });
    },
  });
};
