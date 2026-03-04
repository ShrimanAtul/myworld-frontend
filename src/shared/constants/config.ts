const getApiUrl = (): string => {
  const env = import.meta.env.VITE_APP_ENV || 'local';
  
  // const urls: Record<string, string> = {
  //   local: 'http://localhost:8080',
  //   dev: 'https://dev.api.myworld.ai',
  //   uat: 'https://uat.api.myworld.ai',
  //   perf: 'https://perf.api.myworld.ai',
  //   prod: 'https://api.myworld.ai',
  // };
  
  // Commented above as replacing with actual Render deployed backend app urls.
  
  const urls: Record<string, string> = {
    local: 'http://localhost:8080',
    dev: 'https://myworld-backend-md68.onrender.com',
    uat: 'https://myworld-backend-md68.onrender.com',
    perf: 'https://myworld-backend-md68.onrender.com',
    prod: 'https://myworld-backend-md68.onrender.com',
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
