export const ENDPOINTS = {
  movie: {
    popular: '/movie/popular',
    search: '/search/movie',
    detail: (id: number) => `/movie/${id}`,
  },
  genre: {
    list: '/genre/movie/list',
  },
} as const;
