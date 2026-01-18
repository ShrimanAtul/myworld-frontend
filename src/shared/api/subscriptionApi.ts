import apiClient from './client';
import { Module, Plan, Subscription, CreateSubscriptionRequest } from '../types/subscription';

export const subscriptionApi = {
  getModules: async (): Promise<Module[]> => {
    const response = await apiClient.get<Module[]>('/api/v1/modules');
    return response.data;
  },

  getModulePlans: async (moduleId: string): Promise<Plan[]> => {
    const response = await apiClient.get<Plan[]>(`/api/v1/modules/${moduleId}/plans`);
    return response.data;
  },

  createSubscription: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/api/v1/subscriptions', data);
    return response.data;
  },

  getUserSubscriptions: async (): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>('/api/v1/subscriptions');
    return response.data;
  },

  getSubscription: async (id: string): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>(`/api/v1/subscriptions/${id}`);
    return response.data;
  },

  cancelSubscription: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/subscriptions/${id}`);
  },
};
