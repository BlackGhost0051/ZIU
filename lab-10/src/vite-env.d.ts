/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_TMDB_BASE_URL: string;
  readonly VITE_MSW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
