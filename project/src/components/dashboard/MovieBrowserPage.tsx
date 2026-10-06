import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchMovies } from '../../hooks/useFetchMovies';
import { useDebounce } from '../../hooks/useDebounce';
import { useCharacters } from '../../hooks/useCharacters';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { MovieCard } from '../MovieCard';
import { MovieModal } from '../MovieModal';
import { SkeletonCard } from '../SkeletonCard';
import { ErrorBanner } from '../ErrorBanner';
import { EmptyState } from '../EmptyState';
import { InfiniteMovieList } from '../InfiniteMovieList';
import { gridVariants, cardEnterVariants } from '../../animations';
import type { Movie } from '../../hooks/useFetchMovies';

function WarmUp() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isPlaceholderData } = useCharacters(page);

  return (
    <section className="warmup-section">
      <h2>🧪 Warm-up: Rick &amp; Morty API</h2>
      {isLoading && <p className="warmup-loading">Ładowanie postaci...</p>}
      {data && (
        <>
          <div className="warmup-grid">
            {data.results.map((char) => (
              <div key={char.id} className="warmup-card">
                {char.image && <img src={char.image} alt={char.name} />}
                <span>{char.name}</span>
                <small>{char.status} · {char.species}</small>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Poprzednia</button>
            <span className="page-info">Strona {page} / {data.info.pages}</span>
            <button className="page-btn" onClick={() => setPage((p) => p + 1)} disabled={!data.info.next || isPlaceholderData}>Następna →</button>
          </div>
        </>
      )}
    </section>
  );
}

export default function MovieBrowserPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [useInfinite, setUseInfinite] = useState(false);
  const [errorMode, setErrorMode] = useState(false);
  const [showWarmup, setShowWarmup] = useState(false);
  const { favorites, setFavorites } = useFavoritesContext();

  const debouncedQuery = useDebounce(query, 300);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useFetchMovies(page, debouncedQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const toggleErrorMode = async () => {
    if (!import.meta.env.DEV) return;
    const { worker } = await import('../../mocks/browser');
    const { errorHandlers, handlers } = await import('../../mocks/handlers');
    if (errorMode) {
      worker.resetHandlers(...handlers);
      setErrorMode(false);
    } else {
      worker.use(...errorHandlers);
      setErrorMode(true);
    }
    queryClient.invalidateQueries({ queryKey: ['movies'] });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 Movie Browser</h1>
        <div className="header-controls">
          <input
            className="search-input"
            type="search"
            placeholder="Szukaj filmów... (min. 2 znaki)"
            value={query}
            onChange={handleSearch}
            aria-label="Wyszukaj film"
          />
          <label className="infinite-toggle">
            <input type="checkbox" checked={useInfinite} onChange={(e) => setUseInfinite(e.target.checked)} />
            Infinite scroll
          </label>
          <button className="demo-btn" onClick={() => setShowWarmup((v) => !v)}>
            {showWarmup ? '🎬 Filmy' : '🧪 Warm-up'}
          </button>
          {import.meta.env.DEV && (
            <button
              className={`demo-btn ${errorMode ? 'demo-btn--active' : ''}`}
              onClick={toggleErrorMode}
              title="Demo błędu 401 (MSW)"
            >
              {errorMode ? '🔴 Reset 401' : '⚡ Demo 401'}
            </button>
          )}
        </div>
      </header>

      <main id="movies-content" className="app-main">
        {showWarmup ? (
          <WarmUp />
        ) : useInfinite ? (
          <InfiniteMovieList query={debouncedQuery} onSelect={setSelectedId} />
        ) : (
          <>
            {isLoading && (
              <div className="movie-grid">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}
            {isError && (
              <ErrorBanner
                message={(error as Error)?.message ?? 'Błąd pobierania danych'}
                onRetry={() => refetch()}
              />
            )}
            {!isLoading && !isError && data?.results?.length === 0 && <EmptyState />}
            {!isLoading && !isError && data?.results && data.results.length > 0 && (
              <motion.div
                className={`movie-grid ${isPlaceholderData ? 'dimmed' : ''}`}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
              >
                {data.results.map((movie) => (
                  <motion.div key={movie.id} variants={cardEnterVariants}>
                    <MovieCard movie={movie} onSelect={setSelectedId} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            {data?.results && data.total_pages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="page-btn">← Poprzednia</button>
                <span className="page-info">Strona {page} / {data.total_pages}</span>
                <button onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages || isPlaceholderData} className="page-btn">Następna →</button>
              </div>
            )}
          </>
        )}
      </main>

      {favorites.length > 0 && (
        <section className="app-main" style={{ paddingTop: 0 }} aria-label="Ulubione filmy">
          <h2 style={{ color: '#aaa', fontSize: '1rem', marginBottom: '0.75rem' }}>
            Ulubione — przeciągnij, aby zmienić kolejność
          </h2>
          <Reorder.Group
            axis="y"
            values={favorites}
            onReorder={setFavorites}
            style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {favorites.map((movie: Movie) => (
              <Reorder.Item
                key={movie.id}
                value={movie}
                style={{
                  background: '#1e1e2e',
                  borderRadius: 8,
                  padding: '0.5rem 1rem',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#e8e8f0',
                  fontSize: '0.9rem',
                }}
              >
                ☰ {movie.title} <span style={{ color: '#aaa', fontSize: '0.8rem' }}>({movie.release_date?.slice(0, 4)})</span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </section>
      )}

      <MovieModal movieId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
