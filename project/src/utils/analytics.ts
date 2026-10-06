/**
 * Plausible analytics wrapper — Zadanie A (Ścieżka B).
 *
 * Dane zbierane: pageview (URL bez query string), zdarzenia niestandardowe
 * z właściwościami nieidentyfikującymi użytkownika (brak IP, brak cookies,
 * brak treści pól formularza). Zasada minimalizacji RODO — zbieramy tylko
 * to, co niezbędne do analizy lejka konwersji.
 *
 * Plausible nie wymaga banera cookie — nie korzysta z localStorage ani
 * cookies do śledzenia. Nie przesyła danych osobowych na serwery trzecie.
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(event, props ? { props } : undefined);
  }
}

/** Kliknięcie przycisku CTA (hero_cta, sticky_cta, about_cta itp.) */
export function trackCtaClick(location: string) {
  track('cta_click', { location });
}

/** Porzucenie formularza — użytkownik opuszcza stronę lub klika Anuluj */
export function trackFormAbandon(step: number, trigger: 'cancel_btn' | 'navigation' | 'back_btn') {
  track('form_abandon', { step, trigger });
}

/** Pomyślne przesłanie formularza */
export function trackFormSubmit(step: number) {
  track('form_submit', { step });
}

/** Przejście do kolejnego kroku formularza */
export function trackFormStepNext(from_step: number) {
  track('form_step_next', { from_step });
}

/** Kliknięcie team_card na stronie About */
export function trackTeamCardClick(name: string) {
  track('team_card_click', { name });
}
