// React Query hooks for task management
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
} from '../types/task';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: TaskFilters) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

/**
 * Hook to fetch all tasks with optional filters
 */
export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskApi.listTasks(filters),
  });
};

/**
 * Hook to fetch a single task
 */
export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskApi.createTask(data),
    onSuccess: () => {
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      taskApi.updateTask(id, data),
    onSuccess: (updatedTask) => {
      // Update the specific task in cache
      queryClient.setQueryData<Task>(
        taskKeys.detail(updatedTask.id),
        updatedTask
      );
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook to get task instances (for recurring tasks)
 */
export const useTaskInstances = (
  id: string,
  from?: string,
  to?: string,
  max?: number
) => {
  return useQuery({
    queryKey: [...taskKeys.detail(id), 'instances', { from, to, max }],
    queryFn: () => taskApi.getTaskInstances(id, from, to, max),
    enabled: !!id,
  });
};
