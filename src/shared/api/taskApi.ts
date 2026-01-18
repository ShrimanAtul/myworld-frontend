// Task API service
import apiClient from './client';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../types/task';

export const taskApi = {
  /**
   * Create a new task
   */
  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<Task>('/api/v1/tasks', data);
    return response.data;
  },

  /**
   * Get a task by ID
   */
  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/api/v1/tasks/${id}`);
    return response.data;
  },

  /**
   * List tasks with optional filters
   */
  listTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    
    const response = await apiClient.get<Task[]>('/api/v1/tasks', {
      params,
    });
    return response.data;
  },

  /**
   * Update a task
   */
  updateTask: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await apiClient.put<Task>(`/api/v1/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/tasks/${id}`);
  },

  /**
   * Get task instances (for recurring tasks)
   */
  getTaskInstances: async (
    id: string,
    from?: string,
    to?: string,
    max?: number
  ): Promise<string[]> => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (max) params.append('max', max.toString());

    const response = await apiClient.get<string[]>(
      `/api/v1/tasks/${id}/instances`,
      { params }
    );
    return response.data;
  },
};
