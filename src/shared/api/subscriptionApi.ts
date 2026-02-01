import apiClient from './client';
import { Module, Plan, Subscription, CreateSubscriptionRequest } from '../types/subscription';

export const subscriptionApi = {
  getModules: async (): Promise<Module[]> => {
    const response = await apiClient.get<Module[]>('/modules');
    return response.data;
  },

  getModulePlans: async (moduleId: string): Promise<Plan[]> => {
    const response = await apiClient.get<Plan[]>(`/modules/${moduleId}/plans`);
    return response.data;
  },

  createSubscription: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/subscriptions', data);
    return response.data;
  },

  getUserSubscriptions: async (): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>('/subscriptions');
    return response.data;
  },

  getSubscription: async (id: string): Promise<Subscription> => {
    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`);
    return response.data;
  },

  cancelSubscription: async (id: string): Promise<void> => {
    await apiClient.delete(`/subscriptions/${id}`);
  },
};
