export enum TimetableType {
  WORK = 'WORK',
  STUDY = 'STUDY',
  EXERCISE = 'EXERCISE',
  MEETING = 'MEETING',
  PERSONAL = 'PERSONAL',
  OTHER = 'OTHER',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface TimetableCollection {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Timetable {
  id: string;
  collectionId: string;
  title: string;
  description?: string;
  type: TimetableType;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export const DAY_PRESETS = {
  ALL: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
  WEEKDAYS: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY],
  WEEKENDS: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
};
