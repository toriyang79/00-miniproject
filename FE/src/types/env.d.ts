/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_ENV: 'development' | 'production' | 'test';
  readonly VITE_FEATURE_ANALYTICS: string;
  readonly VITE_FEATURE_EXPORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
