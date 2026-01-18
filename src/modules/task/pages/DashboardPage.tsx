import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL, CORRELATION_ID_HEADER, AUTH_TOKEN_HEADER, REQUEST_TIMEOUT } from '../../../shared/constants/config';
import { generateCorrelationId } from '../../../shared/utils/correlationId';
import { ApiError } from '../../../shared/types/api';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const correlationId = generateCorrelationId();
    config.headers.set(CORRELATION_ID_HEADER, correlationId);

    if (accessToken) {
      config.headers.set(AUTH_TOKEN_HEADER, `Bearer ${accessToken}`);
    }

    if (import.meta.env.MODE === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        correlationId,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const correlationId = response.headers[CORRELATION_ID_HEADER.toLowerCase()];
    
    if (import.meta.env.MODE === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        correlationId,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    const correlationId = error.response?.headers?.[CORRELATION_ID_HEADER.toLowerCase()];
    
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      correlationId: correlationId || error.response?.data?.correlationId,
      timestamp: error.response?.data?.timestamp || new Date().toISOString(),
      path: error.response?.data?.path || error.config?.url || '',
    };

    console.error('[API Error]', {
      correlationId: apiError.correlationId,
      status: apiError.status,
      message: apiError.message,
      path: apiError.path,
    });

    if (apiError.status === 401) {
      setAccessToken(null);
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
