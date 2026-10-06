import axios from 'axios';

export const tmdbClient = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'pl-PL',
  },
});
