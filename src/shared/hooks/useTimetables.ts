import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timetableApi, timetableCollectionApi } from '../api/timetableApi';
import { Timetable, TimetableCollection } from '../types/timetable';

export const timetableKeys = {
  all: ['timetables'] as const,
  detail: (id: string) => ['timetables', id] as const,
  byCollection: (collectionId: string) => ['timetables', 'collection', collectionId] as const,
};

export const collectionKeys = {
  all: ['timetable-collections'] as const,
  detail: (id: string) => ['timetable-collections', id] as const,
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

// Collection hooks
export const useCollections = () => {
  return useQuery({
    queryKey: collectionKeys.all,
    queryFn: timetableCollectionApi.getCollections,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableCollectionApi.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TimetableCollection> }) =>
      timetableCollectionApi.updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableCollectionApi.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
    },
  });
};
