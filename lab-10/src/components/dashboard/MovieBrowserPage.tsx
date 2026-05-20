import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchMovies } from '../../hooks/useFetchMovies';
import { useDebounce } from '../../hooks/useDebounce';
import { useCharacters } from '../../hooks/useCharacters';
import { MovieCard } from '../MovieCard';
import { MovieModal } from '../MovieModal';
import { SkeletonCard } from '../SkeletonCard';
import { ErrorBanner } from '../ErrorBanner';
import { EmptyState } from '../EmptyState';
import { InfiniteMovieList } from '../InfiniteMovieList';

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
              <div className={`movie-grid ${isPlaceholderData ? 'dimmed' : ''}`}>
                {data.results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onSelect={setSelectedId} />
                ))}
              </div>
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

      <MovieModal movieId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
