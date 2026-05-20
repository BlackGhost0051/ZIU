import { http, HttpResponse, delay } from 'msw';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export const handlers = [
  http.get(`${TMDB_BASE}/movie/popular`, async ({ request }) => {
    await delay(800);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    return HttpResponse.json({
      page,
      total_pages: 10,
      total_results: 200,
      results: Array.from({ length: 20 }, (_, i) => ({
        id: page * 100 + i,
        title: `Film testowy ${page}-${i + 1}`,
        overview: 'Opis testowego filmu.',
        poster_path: null,
        release_date: '2024-01-01',
        vote_average: 7.5,
        genre_ids: [28, 12],
      })),
    });
  }),

  http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const q = url.searchParams.get('query') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const results = Array.from({ length: 5 }, (_, i) => ({
      id: 9000 + i,
      title: `Wynik dla "${q}" #${i + 1}`,
      overview: 'Opis znalezionego filmu.',
      poster_path: null,
      release_date: '2023-06-15',
      vote_average: 6.8,
      genre_ids: [18],
    }));
    return HttpResponse.json({ page, total_pages: 1, total_results: results.length, results });
  }),

  http.get(`${TMDB_BASE}/movie/:id`, async ({ params }) => {
    await delay(600);
    return HttpResponse.json({
      id: Number(params.id),
      title: `Film testowy #${params.id}`,
      overview: 'Szczegółowy opis testowego filmu.',
      poster_path: null,
      backdrop_path: null,
      release_date: '2024-01-01',
      vote_average: 7.5,
      runtime: 120,
      genres: [{ id: 28, name: 'Akcja' }, { id: 12, name: 'Przygoda' }],
      tagline: 'To jest tagline testowy',
    });
  }),

  http.get('https://rickandmortyapi.com/api/character', () => {
    return HttpResponse.json({
      info: { count: 2, pages: 1, next: null },
      results: [
        { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', image: '' },
        { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', image: '' },
      ],
    });
  }),
];

export const errorHandlers = [
  http.get(`${TMDB_BASE}/movie/popular`, () => {
    return HttpResponse.json(
      { status_message: 'Invalid API key.' },
      { status: 401 }
    );
  }),
];
