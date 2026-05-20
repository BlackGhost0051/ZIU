import { useInfiniteQuery } from '@tanstack/react-query';
import { tmdbClient } from '../api/tmdbClient';
import type { MoviesResponse } from './useFetchMovies';

export function useInfiniteMovies(query = '') {
  return useInfiniteQuery({
    queryKey: ['movies', 'infinite', query],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = query ? '/search/movie' : '/movie/popular';
      const params: Record<string, string | number> = { page: pageParam };
      if (query) params.query = query;
      const { data } = await tmdbClient.get<MoviesResponse>(endpoint, { params });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
