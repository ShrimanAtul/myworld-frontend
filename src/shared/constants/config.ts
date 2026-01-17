const getApiUrl = (): string => {
  const env = process.env.REACT_APP_ENV || 'local';
  
  const urls: Record<string, string> = {
    local: 'http://localhost:8080',
    dev: 'https://dev.api.myworld.ai',
    uat: 'https://uat.api.myworld.ai',
    perf: 'https://perf.api.myworld.ai',
    prod: 'https://api.myworld.ai',
  };

  return urls[env] || urls.local;
};

export const API_BASE_URL = getApiUrl();
export const API_VERSION = 'v1';
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

export const CORRELATION_ID_HEADER = 'X-Correlation-ID';
export const AUTH_TOKEN_HEADER = 'Authorization';

export const REQUEST_TIMEOUT = 30000;
export const AI_REQUEST_TIMEOUT = 60000;
