export interface ApiError {
  status: number;
  message: string;
  correlationId?: string;
  timestamp: string;
  path: string;
}

export interface ApiResponse<T> {
  data: T;
  correlationId: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
