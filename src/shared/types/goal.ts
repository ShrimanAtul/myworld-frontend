export enum GoalType {
  PERSONAL = 'PERSONAL',
  PROFESSIONAL = 'PROFESSIONAL',
  HEALTH = 'HEALTH',
  FINANCIAL = 'FINANCIAL',
  OTHER = 'OTHER',
}

export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  targetDate?: string;
  progressPercentage: number;
  activityDates?: string[];
  createdAt: string;
  updatedAt: string;
}
