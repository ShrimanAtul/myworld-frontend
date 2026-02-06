export enum AiAnalysisType {
  DISCIPLINE = 'DISCIPLINE',
  PROGRESS = 'PROGRESS',
  RECOMMENDATION = 'RECOMMENDATION',
  SUMMARY = 'SUMMARY',
  GENERATE_TIMETABLE = 'GENERATE_TIMETABLE',
}

export interface AiAnalysisRequest {
  type: AiAnalysisType;
  input: string;
}

export interface AiAnalysisResponse {
  content: string;
  fromCache: boolean;
  inputTokens: number;
  outputTokens: number;
}

export interface CachedAiResponse {
  id: string;
  type: AiAnalysisType;
  responseContent: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  isRegenerated: boolean;
  generatedAt: string;
  status: string;
}
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
