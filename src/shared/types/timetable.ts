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

export interface Timetable {
  id: string;
  title: string;
  description?: string;
  type: TimetableType;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}
