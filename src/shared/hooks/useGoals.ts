import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalApi } from '../api/goalApi';
import { Goal } from '../types/goal';

export const goalKeys = {
  all: ['goals'] as const,
  detail: (id: string) => ['goals', id] as const,
};

export const useGoals = () => {
  return useQuery({
    queryKey: goalKeys.all,
    queryFn: goalApi.getGoals,
  });
};

export const useGoal = (id: string) => {
  return useQuery({
    queryKey: goalKeys.detail(id),
    queryFn: () => goalApi.getGoal(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalApi.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) =>
      goalApi.updateGoal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.id) });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalApi.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};
