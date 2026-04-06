import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, CircularProgress, Alert,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExploreIcon from '@mui/icons-material/Explore';

interface SessionRow {
  session_id: string;
  page: string;
  duration_sec: string;
  bounce: string;
  form_step_reached: string;
  element_clicked: string;
  timestamp_bucket: string;
  device: string;
}

interface BounceEntry { page: string; total: number; bounced: number; rate: number }
interface FunnelEntry { step: number; count: number; pct: number }
interface ClickEntry { element: string; count: number }

function useSessionData() {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse<SessionRow>('/sessions_lab12.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setRows(result.data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  }, []);

  return { rows, loading, error };
}

function computeBounceRate(rows: SessionRow[]): BounceEntry[] {
  const totals: Record<string, number> = {};
  const bounced: Record<string, number> = {};
  for (const r of rows) {
    totals[r.page] = (totals[r.page] ?? 0) + 1;
    if (r.bounce === 'true') bounced[r.page] = (bounced[r.page] ?? 0) + 1;
  }
  return Object.keys(totals)
    .map((page) => ({
      page,
      total: totals[page],
      bounced: bounced[page] ?? 0,
      rate: Math.round(((bounced[page] ?? 0) / totals[page]) * 100),
    }))
    .sort((a, b) => b.rate - a.rate);
}

function computeFunnel(rows: SessionRow[]): FunnelEntry[] {
  const formRows = rows.filter((r) => r.page === 'form');
  const entered = formRows.length;
  if (!entered) return [];
  const steps = [1, 2, 3, 4];
  return steps.map((step) => {
    const count = formRows.filter(
      (r) => r.form_step_reached && parseInt(r.form_step_reached, 10) >= step
    ).length;
    return { step, count, pct: Math.round((count / entered) * 100) };
  });
}

function computeTopClicks(rows: SessionRow[]): ClickEntry[] {
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (r.element_clicked) counts[r.element_clicked] = (counts[r.element_clicked] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function rateColor(rate: number): 'error' | 'warning' | 'success' {
  if (rate >= 70) return 'error';
  if (rate >= 40) return 'warning';
  return 'success';
}

function HBar({ value, max, color }: { value: number; max: number; color: string }) {
  const w = Math.round((value / max) * 100);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          height: 20,
          width: `${w}%`,
          bgcolor: color,
          borderRadius: 1,
          minWidth: 4,
          transition: 'width 0.4s ease',
        }}
      />
      <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function AnalyticsPage() {
  const { rows, loading, error } = useSessionData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">Błąd wczytywania CSV: {error}</Alert>;
  }

  const bounceData = computeBounceRate(rows);
  const funnelData = computeFunnel(rows);
  const clickData = computeTopClicks(rows);
  const maxClicks = clickData[0]?.count ?? 1;
  const formEntered = rows.filter((r) => r.page === 'form').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BarChartIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Analiza behawioralna — sessions_lab12.csv
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {rows.length} sesji · dane syntetyczne, zanonimizowane · brak danych osobowych
      </Typography>

      {/* A — Eksploracja narzędzi (pkt 2.3) */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ExploreIcon color="secondary" />
          <Typography variant="h6" fontWeight={600}>
            A — Eksploracja narzędzi (pkt 2.3)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              1. Jakie zdarzenia GA4 śledzi domyślnie? Które wymagają implementacji?
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Domyślnie (automatically collected):</strong> <code>page_view</code>,{' '}
              <code>session_start</code>, <code>first_visit</code>, <code>user_engagement</code>.
              Przy włączonym Enhanced Measurement dodatkowo: <code>scroll</code> (90% strony),{' '}
              <code>click</code> (linki zewnętrzne), <code>file_download</code>,{' '}
              <code>video_start/progress/complete</code> (YouTube embed), <code>form_start</code>,{' '}
              <code>form_submit</code>.
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Wymagają implementacji (recommended events):</strong>{' '}
              <code>sign_up</code>, <code>login</code>, <code>purchase</code>,{' '}
              <code>add_to_cart</code>, <code>begin_checkout</code> oraz wszystkie zdarzenia
              biznesowe specyficzne dla projektu (np. <code>cta_click</code>,{' '}
              <code>form_abandon</code> użyte w tym lab).
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              2. Microsoft Clarity vs Hotjar Free — które wybrać i dlaczego?
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Wybieram Microsoft Clarity</strong> — plan bezpłatny jest bez limitu
              sesji i bez limitu nagrań (Hotjar Free: max 35 nagrań/miesiąc). Clarity oferuje
              heatmapy kliknięć, ruchu myszki i scrollowania oraz automatyczne wykrywanie{' '}
              <em>rage clicks</em> i <em>dead clicks</em> bez dodatkowej konfiguracji.
              Integruje się bezpośrednio z GA4 — każda sesja z Clarity jest tagowana w GA4,
              co pozwala korelować dane ilościowe z nagraniami. Wadą jest zbieranie przez
              Microsoft (kwestia RODO wymaga oceny), podczas gdy Hotjar ma siedzibę w UE.
              Dla projektu studyckiego Clarity jest lepszym wyborem ze względu na brak
              limitów i głębszą integrację z ekosystemem Google.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              3. Rozmiar paczek npm (Bundlephobia)
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, mt: 0.5, flexWrap: 'wrap' }}>
              {[
                { name: 'react-ga4', minGzip: '~3,4 kB', note: 'wrapper nad gtag.js; sam gtag.js to +45 kB ładowany zewnętrznie' },
                { name: 'plausible-tracker', minGzip: '~1,3 kB', note: 'lekki wrapper, skrypt główny ~1 kB ładowany z plausible.io' },
              ].map((pkg) => (
                <Box key={pkg.name} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5, minWidth: 220 }}>
                  <Typography variant="body2" fontFamily="monospace" fontWeight={700}>{pkg.name}</Typography>
                  <Typography variant="body2">min+gzip: <strong>{pkg.minGzip}</strong></Typography>
                  <Typography variant="caption" color="text.secondary">{pkg.note}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Różnica:</strong> <code>plausible-tracker</code> jest ~2,6× lżejsza
              (sam wrapper). Realna przewaga Plausible jest większa — brak zewnętrznego skryptu
              gtag.js (~45 kB), brak cookie, brak blokowania przez adblocki w trybie proxy.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              4. Które narzędzie wymaga banera cookie na polskiej stronie?
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Google Analytics 4</strong> wymaga banera cookie consent na każdej
              stronie dostępnej w Polsce (i UE). Podstawa prawna: art. 5 ust. 3 dyrektywy
              ePrivacy (implementacja: ustawa Prawo telekomunikacyjne) — każde przechowywanie
              lub dostęp do informacji na urządzeniu końcowym użytkownika wymaga uprzedniej,
              dobrowolnej i świadomej zgody. GA4 ustawia cookie{' '}
              <code>_ga</code>, <code>_ga_XXXX</code> (2 lata) służące do identyfikacji
              użytkownika między sesjami → konieczny CMP (Consent Management Platform).
              UODO w stanowisku z 2023 r. wprost wskazuje Google Analytics jako narzędzie
              wymagające zgody.
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Plausible, Matomo (cookieless)</strong> — nie ustawiają cookies,
              nie przesyłają danych osobowych na serwery trzecie → baner cookie{' '}
              <strong>nie jest wymagany</strong>.
            </Typography>
          </Box>

        </Box>
      </Paper>

      {/* B1 — Bounce rate */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          B1 — Bounce rate per strona
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Strona</strong></TableCell>
              <TableCell align="right"><strong>Sesje</strong></TableCell>
              <TableCell align="right"><strong>Odbite</strong></TableCell>
              <TableCell align="right"><strong>Bounce rate</strong></TableCell>
              <TableCell><strong>Interpretacja</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bounceData.map(({ page, total, bounced, rate }) => (
              <TableRow key={page}>
                <TableCell>
                  <code>{page}</code>
                </TableCell>
                <TableCell align="right">{total}</TableCell>
                <TableCell align="right">{bounced}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${rate}%`}
                    color={rateColor(rate)}
                    size="small"
                    variant="filled"
                  />
                </TableCell>
                <TableCell sx={{ fontSize: 12, color: 'text.secondary', maxWidth: 260 }}>
                  {page === 'home' &&
                    'Krytyczny — 4 na 5 użytkowników wychodzi bez interakcji. Hero section nie zatrzymuje uwagi.'}
                  {page === 'about' &&
                    'Wysoki — treść angażuje (team_card), ale brak wyraźnego CTA prowadzącego do konwersji.'}
                  {page === 'form' &&
                    'Niski — użytkownicy którzy dotrą są zaangażowani, ale tylko 7,5% kończy submit.'}
                  {page === 'confirm' &&
                    'Niski — strona potwierdzenia spełnia swoje zadanie, brak potrzeby optymalizacji.'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* B2 — Drop-off formularza */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          B2 — Drop-off formularza (funnel krok po kroku)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Wejścia na stronę <code>form</code>: <strong>{formEntered}</strong> (100%)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {funnelData.map(({ step, count, pct }) => {
            const prev = step === 1 ? formEntered : funnelData[step - 2]?.count ?? formEntered;
            const drop = prev - count;
            const dropPct = Math.round((drop / prev) * 100);
            return (
              <Box key={step}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ width: 72, fontWeight: 600 }}>
                    Krok {step}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        height: 32,
                        width: `${pct}%`,
                        bgcolor: step <= 2 ? 'primary.main' : 'primary.light',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        px: 1,
                        minWidth: 40,
                        transition: 'width 0.4s ease',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                        {count} ({pct}%)
                      </Typography>
                    </Box>
                  </Box>
                  {drop > 0 && (
                    <Typography variant="caption" color="error.main" sx={{ whiteSpace: 'nowrap' }}>
                      −{drop} (−{dropPct}%)
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <strong>Hipoteza:</strong> Największy drop-off (−34%) między krokiem 1→2 sugeruje,
          że krok 1 jest zbyt wymagający (5 pól naraz) lub walidacja blokuje użytkowników.
          <code>form_cancel</code> pojawia się 16 razy — świadoma rezygnacja, nie zamknięcie zakładki.
        </Alert>
      </Paper>

      {/* B3 — Top 5 kliknięć */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          B3 — Top 5 najczęściej klikanych elementów
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {clickData.map(({ element, count }, i) => (
            <Box key={element} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ width: 24, fontWeight: 700, color: 'text.secondary' }}>
                #{i + 1}
              </Typography>
              <Typography variant="body2" sx={{ width: 180, fontFamily: 'monospace' }}>
                {element}
              </Typography>
              <Box sx={{ flex: 1 }}>
                <HBar value={count} max={maxClicks} color={i === 0 ? '#ef5350' : '#42a5f5'} />
              </Box>
            </Box>
          ))}
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          <strong>Hipoteza:</strong> <code>logo</code> na 1. miejscu (85 kliknięć) sugeruje dezorientację —
          użytkownicy nawigują "wstecz" zamiast korzystać z menu. Niska liczba <code>form_submit</code> (11)
          przy 146 wejściach na formularz = wskaźnik konwersji zaledwie 7,5%.
        </Alert>
      </Paper>

      {/* Zadanie C — Iteracje */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          C — Propozycje iteracji UI (uzasadnione danymi)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            {
              title: 'Iteracja 1 — Home: sticky CTA + skrócenie hero',
              data: 'Bounce rate home = 79,4% · hero_cta kliknięty tylko ~10 razy',
              problem: 'Użytkownicy wychodzą zanim klikną cokolwiek wartościowego.',
              change: 'Sticky bar u góry z przyciskiem "Przejdź do formularza". Skróć hero do 2 sekcji. Dodaj social proof.',
              expected: 'Bounce home z 79% → <60%',
              rodo: 'Nowe zdarzenie cta_click (location: "sticky_bar") — zbiera wyłącznie identyfikator elementu, bez treści ani danych użytkownika. Zasada minimalizacji art. 5 RODO: śledzimy fakt kliknięcia, nie tożsamość klikającego.',
            },
            {
              title: 'Iteracja 2 — Form krok 1: redukcja pól + czytelny progress bar',
              data: 'Drop-off 1→2 = −34% · form_cancel = 16 · form_field_email = 30 kliknięć (tarcie)',
              problem: 'Krok 1 ma 5 pól naraz — przytłacza użytkownika.',
              change: 'Wydziel pole e-mail na osobny mini-krok. Dodaj widoczny pasek "Krok 1 z 4". Walidacja inline zamiast po submit.',
              expected: 'Przejście 1→2 z 61% → >75%',
              rodo: 'Zdarzenia form_step_next i form_abandon rejestrują numer kroku (int), nigdy wartości pól. E-mail użytkownika nie jest przesyłany do Plausible — zasada ograniczenia celu (art. 5 ust. 1 lit. b). Walidacja inline działa lokalnie w przeglądarce, bez sieciowego żądania per pole.',
            },
            {
              title: 'Iteracja 3 — About: CTA prowadzące do formularza',
              data: 'Bounce about = 61,6% · team_card ~10 kliknięć (zaangażowanie treścią)',
              problem: 'Użytkownicy czytają stronę, ale nie wiedzą co zrobić dalej.',
              change: 'Fixed button "Zarejestruj się" w prawym dolnym rogu + sekcja "Gotowy? →" na końcu strony.',
              expected: 'Bounce about z 62% → <45%, wzrost ruchu about→form',
              rodo: 'Zdarzenie team_card_click przekazuje tylko name (nazwa widoczna publicznie na stronie) — nie jest daną osobową w rozumieniu RODO. Nowe zdarzenie cta_click (location: "about_fixed_btn") śledzi wyłącznie nawigację — brak profilowania, dane agregowane przez Plausible bez cookies.',
            },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {item.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: 13 }}>
                <Typography variant="body2">
                  <strong>Dane:</strong> {item.data}
                </Typography>
                <Typography variant="body2">
                  <strong>Problem:</strong> {item.problem}
                </Typography>
                <Typography variant="body2">
                  <strong>Zmiana:</strong> {item.change}
                </Typography>
                <Typography variant="body2" color="success.main">
                  <strong>Oczekiwany efekt:</strong> {item.expected}
                </Typography>
                <Typography variant="body2" sx={{ color: 'info.dark', borderTop: '1px dashed', borderColor: 'divider', pt: 0.5, mt: 0.5 }}>
                  <strong>RODO:</strong> {item.rodo}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* RODO checklist */}
      <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Checklist anonimizacji RODO
        </Typography>
        {[
          'IP nie jest zbierane — Plausible nie przesyła adresów IP na serwer',
          'Session ID to wewnętrzny UUID bez powiązania z danymi osobowymi',
          'Brak zbierania treści pól formularza (hasła, e-maile)',
          'Plausible nie używa cookies → brak wymogu banera cookie consent',
          'Dane agregowane — brak profili indywidualnych użytkowników',
          'Czas retencji: domyślnie 5 lat (skonfiguruj w ustawieniach Plausible)',
        ].map((item) => (
          <Typography key={item} variant="body2" sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
            <span style={{ color: 'green' }}>✓</span> {item}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
}
