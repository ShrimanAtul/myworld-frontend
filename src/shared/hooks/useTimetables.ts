import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timetableApi } from '../api/timetableApi';
import { Timetable } from '../types/timetable';

export const timetableKeys = {
  all: ['timetables'] as const,
  detail: (id: string) => ['timetables', id] as const,
};

export const useTimetables = () => {
  return useQuery({
    queryKey: timetableKeys.all,
    queryFn: timetableApi.getTimetables,
  });
};

export const useTimetable = (id: string) => {
  return useQuery({
    queryKey: timetableKeys.detail(id),
    queryFn: () => timetableApi.getTimetable(id),
    enabled: !!id,
  });
};

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableApi.createTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
    },
  });
};

export const useUpdateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Timetable> }) =>
      timetableApi.updateTimetable(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
      queryClient.invalidateQueries({ queryKey: timetableKeys.detail(variables.id) });
    },
  });
};

export const useDeleteTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableApi.deleteTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
    },
  });
};
