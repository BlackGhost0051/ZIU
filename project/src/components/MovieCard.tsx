import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useToastContext } from '../context/ToastContext';
import { DURATION_ITEM, CARD_LIFT, DURATION_MICRO } from '../animations';
import type { Movie } from '../hooks/useFetchMovies';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props {
  movie: Movie;
  onSelect: (id: number) => void;
}


export function MovieCard({ movie, onSelect }: Props) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { addToast } = useToastContext();
  const shouldReduce = useReducedMotion();
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);

  const displayedFav = optimisticFav !== null ? optimisticFav : isFavorite(movie.id);

  const variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : CARD_LIFT },
    visible: { opacity: 1, y: 0, transition: { duration: DURATION_ITEM } },
  };

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const adding = !displayedFav;
      setOptimisticFav(adding);
      try {
        await toggleFavorite(movie);
        setOptimisticFav(null);
        addToast(
          adding ? `Dodano "${movie.title}" do ulubionych` : `Usunięto "${movie.title}" z ulubionych`,
          adding ? 'success' : 'info'
        );
      } catch {
        setOptimisticFav(null);
        addToast('Błąd podczas aktualizacji ulubionych', 'error');
      }
    },
    [displayedFav, toggleFavorite, movie, addToast]
  );

  return (
    <motion.div
      className="movie-card"
      variants={variants}
      onClick={() => onSelect(movie.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(movie.id)}
      whileHover={shouldReduce ? {} : { scale: 1.03, y: -2 }}
      transition={{ duration: DURATION_MICRO }}
    >
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
    </motion.div>
  );
}
