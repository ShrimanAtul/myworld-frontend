import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscriptionApi';

export const subscriptionKeys = {
  modules: ['modules'] as const,
  modulePlans: (moduleId: string) => ['modules', moduleId, 'plans'] as const,
  subscriptions: ['subscriptions'] as const,
  subscription: (id: string) => ['subscriptions', id] as const,
};

export const useModules = () => {
  return useQuery({
    queryKey: subscriptionKeys.modules,
    queryFn: subscriptionApi.getModules,
  });
};

export const useModulePlans = (moduleId: string) => {
  return useQuery({
    queryKey: subscriptionKeys.modulePlans(moduleId),
    queryFn: () => subscriptionApi.getModulePlans(moduleId),
    enabled: !!moduleId,
  });
};

export const useUserSubscriptions = () => {
  return useQuery({
    queryKey: subscriptionKeys.subscriptions,
    queryFn: subscriptionApi.getUserSubscriptions,
  });
};

export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: subscriptionKeys.subscription(id),
    queryFn: () => subscriptionApi.getSubscription(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.subscriptions });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.cancelSubscription,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.subscriptions });
      queryClient.removeQueries({ queryKey: subscriptionKeys.subscription(id) });
    },
  });
};
