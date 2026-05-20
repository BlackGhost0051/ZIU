import { useEffect } from 'react';
import { useMovieDetails } from '../hooks/useMovieDetails';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props {
  movieId: number | null;
  onClose: () => void;
}

export function MovieModal({ movieId, onClose }: Props) {
  const { data, isLoading, isError } = useMovieDetails(movieId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!movieId) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Zamknij">✕</button>

        {isLoading && (
          <div className="modal-loading">
            <div className="shimmer" style={{ width: '100%', height: 300 }} />
            <div className="shimmer" style={{ width: '60%', height: 24, marginTop: 16 }} />
          </div>
        )}

        {isError && <p className="modal-error">Błąd podczas ładowania szczegółów.</p>}

        {data && (
          <>
            {data.backdrop_path && (
              <img
                className="modal-backdrop"
                src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
                alt={data.title}
              />
            )}
            <div className="modal-body">
              <div className="modal-poster">
                <img
                  src={data.poster_path ? `${IMG_BASE}${data.poster_path}` : '/no-poster.png'}
                  alt={data.title}
                />
              </div>
              <div className="modal-info">
                <h2>{data.title}</h2>
                {data.tagline && <p className="tagline">"{data.tagline}"</p>}
                <p className="modal-meta">
                  {data.release_date?.slice(0, 4)}
                  {data.runtime ? ` • ${data.runtime} min` : ''}
                  {' • '}⭐ {data.vote_average.toFixed(1)}
                </p>
                <div className="genres">
                  {data.genres.map((g) => (
                    <span key={g.id} className="genre-tag">{g.name}</span>
                  ))}
                </div>
                <p className="overview">{data.overview || 'Brak opisu.'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
