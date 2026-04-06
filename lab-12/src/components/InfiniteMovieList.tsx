import { useEffect, useRef } from 'react';
import { useInfiniteMovies } from '../hooks/useInfiniteMovies';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';

interface Props {
  query: string;
  onSelect: (id: number) => void;
}

export function InfiniteMovieList({ query, onSelect }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMovies(query);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const movies = data?.pages.flatMap((p) => p.results) ?? [];

  if (isLoading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>
      <div ref={sentinelRef} style={{ height: 1 }} />
    </>
  );
}
