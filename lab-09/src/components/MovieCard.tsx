import { useState, useCallback } from 'react';
import { useFavoritesContext } from '../context/FavoritesContext';
import type { Movie } from '../hooks/useFetchMovies';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props {
  movie: Movie;
  onSelect: (id: number) => void;
}

export function MovieCard({ movie, onSelect }: Props) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);

  const displayedFav = optimisticFav !== null ? optimisticFav : isFavorite(movie.id);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setOptimisticFav(!displayedFav);
      try {
        await toggleFavorite(movie);
        setOptimisticFav(null);
      } catch {
        setOptimisticFav(null);
      }
    },
    [displayedFav, toggleFavorite, movie]
  );

  return (
    <div className="movie-card" onClick={() => onSelect(movie.id)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(movie.id)}>
      <img
        src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '/no-poster.png'}
        alt={movie.title}
        loading="lazy"
      />
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.release_date?.slice(0, 4)} &bull; ⭐ {movie.vote_average.toFixed(1)}
        </p>
      </div>
      <button
        onClick={handleToggle}
        aria-label={displayedFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        className={`fav-btn ${displayedFav ? 'active' : ''}`}
      >
        {displayedFav ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
