export interface Module {
  id: string;
  name: string;
  description: string;
  isPaid: boolean;
}

export enum PlanDuration {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export interface Plan {
  id: string;
  moduleId: string;
  duration: PlanDuration;
  basePrice: number;
  discountPercent: number;
  effectivePrice: number;
  quotaLimit: number;
  moduleName: string;
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface Subscription {
  id: string;
  userId: string;
  moduleId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  quotaRemaining: number;
  moduleName: string;
  planName: string;
}

export interface CreateSubscriptionRequest {
  moduleIdRaw?: string;
  planIdRaw: string;
  paymentMethod?: string;
}
