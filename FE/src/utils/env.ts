export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  appEnv: import.meta.env.VITE_APP_ENV,
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  features: {
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
    export: import.meta.env.VITE_FEATURE_EXPORT === 'true',
  },
} as const;

// 환경변수 검증
export function validateEnv() {
  const required = ['VITE_API_BASE_URL', 'VITE_APP_ENV'];

  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
