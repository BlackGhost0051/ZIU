import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Movie } from '../hooks/useFetchMovies';

const STORAGE_KEY = 'movie-browser-favorites';

function loadFavorites(): Movie[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

interface FavoritesContextValue {
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => Promise<void>;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>(loadFavorites);

  const toggleFavorite = useCallback(async (movie: Movie) => {
    setFavorites((prev) => {
      const next = prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used inside FavoritesProvider');
  return ctx;
}
