import apiClient from './client';
import { Timetable } from '../types/timetable';

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
