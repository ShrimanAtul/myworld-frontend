export enum AiAnalysisType {
  DISCIPLINE = 'DISCIPLINE',
  PROGRESS = 'PROGRESS',
  RECOMMENDATION = 'RECOMMENDATION',
  SUMMARY = 'SUMMARY',
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
