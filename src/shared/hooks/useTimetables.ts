import apiClient from './client';

export const timetableCollectionApi = {
  createCollection: async (data: Partial<TimetableCollection>): Promise<TimetableCollection> => {
    const response = await apiClient.post<TimetableCollection>('/timetable-collections', data);
    return response.data;
  },

  getCollections: async (): Promise<TimetableCollection[]> => {
    const response = await apiClient.get<TimetableCollection[]>('/timetable-collections');
    return response.data;
  },

  updateCollection: async (id: string, data: Partial<TimetableCollection>): Promise<TimetableCollection> => {
    const response = await apiClient.put<TimetableCollection>(`/timetable-collections/${id}`, data);
    return response.data;
  },

  deleteCollection: async (id: string): Promise<void> => {
    await apiClient.delete(`/timetable-collections/${id}`);
  },
};

export const timetableApi = {
  createTimetable: async (data: Partial<Timetable>): Promise<Timetable> => {
    const response = await apiClient.post<Timetable>('/timetables', data);
    return response.data;
  },

  getTimetables: async (): Promise<Timetable[]> => {
    const response = await apiClient.get<Timetable[]>('/timetables');
    return response.data;
  },

  getTimetable: async (id: string): Promise<Timetable> => {
    const response = await apiClient.get<Timetable>(`/timetables/${id}`);
    return response.data;
  },

  updateTimetable: async (id: string, data: Partial<Timetable>): Promise<Timetable> => {
    const response = await apiClient.put<Timetable>(`/timetables/${id}`, data);
    return response.data;
  },

  deleteTimetable: async (id: string): Promise<void> => {
    await apiClient.delete(`/timetables/${id}`);
  },
};
