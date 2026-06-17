# TaskFlow — Menedżer Zadań

Aplikacja webowa typu SPA (Single Page Application) zbudowana w React 18 + TypeScript jako projekt zaliczeniowy na kierunku Zarządzanie Informacją i Usługami (ZIU).

**Demo:** https://ziu-todo-app-dun.vercel.app  
**Projekt Figma (lo-fi + hi-fi):** https://www.figma.com/design/54tzUqsXfXx13YfAjMhlby/Lab2_Valentyn_Kulbitskyy_ToDoApp?node-id=0-1&t=gqohEjB4wxwCLTFi-1

---

## Spis treści

1. [Opis projektu](#opis-projektu)
2. [Zrzuty ekranu](#zrzuty-ekranu)
3. [Stos technologiczny](#stos-technologiczny)
4. [Uruchomienie lokalne](#uruchomienie-lokalne)
5. [Struktura katalogów](#struktura-katalogów)
6. [Ekrany i funkcjonalności](#ekrany-i-funkcjonalności)
7. [Zarządzanie stanem](#zarządzanie-stanem)
8. [Walidacja formularzy](#walidacja-formularzy)
9. [Dostępność (WCAG 2.1 AA)](#dostępność-wcag-21-aa)
10. [Notatka UX — decyzje projektowe](#notatka-ux--decyzje-projektowe)
11. [Wdrożenie](#wdrożenie)

---

## Opis projektu

TaskFlow to menedżer zadań z zaawansowanym filtrowaniem, wyszukiwaniem i kategoryzacją. Aplikacja integruje się z zewnętrznymi API (TMDB, Rick & Morty), zawiera przeglądarkę filmów z nieskończonym scrollem oraz system analityki prywatnej (Plausible). Projekt demonstrować zaawansowane wzorce React: Context + Reducer, React Query, animacje Framer Motion, walidację Zod, testy MSW oraz pełną responsywność mobilną.

### Cel projektu

| Wymaganie | Status |
|---|---|
| SPA z routingiem | ✅ React Router v6 |
| Formularze z walidacją | ✅ React Hook Form + Zod |
| Zewnętrzne API | ✅ TMDB API + Rick & Morty API |
| Zarządzanie stanem | ✅ Context + useReducer + React Query |
| Responsywność | ✅ MUI breakpoints + fullScreen dialogi |
| Dostępność WCAG | ✅ aria-*, FocusTrap, skip-link |
| Dokumentacja Figma | ✅ lo-fi + hi-fi w `figma/` |
| Wdrożenie | ⏳ Netlify / Vercel |

---

## Zrzuty ekranu

Mockupy hi-fi dostępne w katalogu `figma/hifi/`:

| Ekran | Plik |
|---|---|
| Dashboard — lista zadań | `figma/hifi/E1-Dashboard.svg` |
| Formularz zadania | `figma/hifi/E2-Formularz.svg` |
| Szczegóły zadania | `figma/hifi/E3-Szczegoly.svg` |
| Filtry i sortowanie | `figma/hifi/E4-Filtry.svg` |
| Ustawienia profilu | `figma/hifi/E5-Ustawienia.svg` |
| Wersje mobilne (5×) | `figma/hifi/Mobile-E1…E5.svg` |

---

## Stos technologiczny

### Frontend

| Biblioteka | Wersja | Zastosowanie |
|---|---|---|
| React | 18.3 | Biblioteka UI |
| TypeScript | 5.5 | Typowanie statyczne |
| Vite | 5.4 | Bundler i dev-server |
| Material UI | 7.3 | Komponenty UI, system sx |
| Framer Motion | 11 | Animacje stron i listy zadań |
| React Router DOM | 6.22 | Routing klient-side |
| React Hook Form | 7.51 | Obsługa formularzy |
| Zod | 3.22 | Schematy walidacji |
| @hookform/resolvers | 3.3 | Integracja RHF + Zod |
| TanStack Query | 5.100 | Cache i stan serwera |
| Axios | 1.16 | Klient HTTP |
| MSW | 2.14 | Mock Service Worker (testy) |
| Plausible Tracker | 0.3 | Analityka prywatna |
| PapaParse | 5.5 | Parsowanie CSV |
| Tailwind CSS | 3.4 | CSS utility (alternatywna implementacja) |

### Narzędzia DX

| Narzędzie | Wersja | Cel |
|---|---|---|
| axe-core CLI | 4.11 | Audyt dostępności |
| Lighthouse CLI | 13.3 | Audyt wydajności |
| pa11y | 9.1 | Automatyczne testy a11y |
| @tanstack/react-query-devtools | 5.100 | DevTools React Query |

---

## Uruchomienie lokalne

### Wymagania

- Node.js ≥ 18
- npm ≥ 9

### Instalacja

```bash
git clone <repo-url>
cd project
npm install
```

### Uruchomienie deweloperskie

```bash
npm run dev
```

Aplikacja dostępna pod adresem: **http://localhost:3000/**

### Budowanie produkcyjne

```bash
npm run build
npm run preview   # podgląd buildu lokalnie
```

### Audyt dostępności (opcjonalnie)

```bash
# uruchom dev-server w osobnym terminalu, a następnie:
npx pa11y http://localhost:3000
npx axe http://localhost:3000
```

---

## Struktura katalogów

```
project/
├── figma/
│   ├── lofi/          # Wireframes lo-fi (SVG, skala szarości)
│   └── hifi/          # Mockupy hi-fi (SVG, pełny kolor)
├── public/
│   └── mockServiceWorker.js
└── src/
    ├── api/           # Klienty HTTP (TMDB, Rick & Morty, axios)
    ├── animations.ts  # Warianty Framer Motion
    ├── components/
    │   ├── dashboard/
    │   │   ├── AppHeader.tsx       # Nagłówek z CTA i przełącznikiem motywu
    │   │   ├── AnalyticsPage.tsx   # Strona analityki
    │   │   ├── DashboardLayout.tsx # Layout główny + routing ekranów
    │   │   ├── MovieBrowserPage.tsx# Przeglądarka filmów TMDB
    │   │   ├── SettingsPage.tsx    # Ustawienia profilu (E5)
    │   │   ├── Sidebar.tsx         # Menu nawigacyjne
    │   │   ├── StatsGrid.tsx       # Kafelki statystyk
    │   │   └── TodoApp.tsx         # Lista zadań z filtrami (E1)
    │   ├── registration/           # Wielokrokowy formularz rejestracji
    │   ├── TodoDetailModal.tsx     # Modal szczegółów zadania (E3)
    │   ├── TodoFilterModal.tsx     # Modal filtrów i sortowania (E4)
    │   ├── TodoFormModal.tsx       # Modal formularza zadania (E2)
    │   ├── InfiniteMovieList.tsx   # Nieskończony scroll filmów
    │   ├── MovieCard.tsx / MovieModal.tsx
    │   └── FocusTrap.tsx           # Pułapka fokusu dla modali
    ├── constants/     # Stałe aplikacji
    ├── context/
    │   ├── FavoritesContext.tsx    # Ulubione filmy
    │   ├── ThemeContext.tsx        # Tryb ciemny/jasny
    │   ├── ToastContext.tsx        # Powiadomienia toast
    │   └── TodoContextMUI.tsx      # Stan zadań (Context + useReducer)
    ├── hooks/         # Custom hooks (useDebounce, useLocalStorage, …)
    ├── mocks/         # Handlery MSW
    ├── reducers/      # Reducery (todoReducer)
    ├── schemas/       # Schematy Zod
    ├── theme/         # Konfiguracja MUI theme
    ├── types/
    │   └── todo.ts    # Typy: Todo, Priority, TodoStatus
    └── utils/
        └── analytics.ts  # trackCtaClick (Plausible)
```

---

## Ekrany i funkcjonalności

### E1 — Dashboard / Lista zadań (`/dashboard`)

- Wyszukiwanie pełnotekstowe z debounce
- Szybkie filtry (All / Active / Completed / High priority)
- Zaawansowane filtry i sortowanie (modal E4)
- Priorytety oznaczone kolorową lewą krawędzią karty
- Animowane wejście/wyjście elementów listy (Framer Motion `AnimatePresence`)
- FAB „+" do dodawania zadań (fixed, bottom-right)
- Statystyki (łącznie / aktywne / ukończone) w nagłówku sekcji

### E2 — Formularz zadania (modal)

- Tytuł (min. 2 znaki), opis, termin (date picker), priorytet, kategoria, status
- Walidacja Zod z komunikatami po polsku
- Tryb edycji — formularz wypełnia się danymi istniejącego zadania
- Na mobile: dialog pełnoekranowy (`fullScreen` + przycisk Anuluj w nagłówku)
- Focus na pole tytułu przy otwarciu (`useRef` + `setTimeout`)

### E3 — Szczegóły zadania (modal)

- Breadcrumb „Dashboard › Lista zadań › Szczegóły"
- Wszystkie pola zadania w układzie label/value
- Chip statusu i priorytetu z kolorami
- Akcje: Usuń (czerwony outlined), Edytuj (contained), Zamknij
- Na mobile: pełnoekranowy z zawijaniem przycisków (`flexWrap: 'wrap'`)

### E4 — Filtry i sortowanie (modal)

- Filtr statusu: All / Aktywne / W trakcie / Ukończone (RadioGroup)
- Filtr priorytetu: checkboxy z kolorowymi punktami (Wysoki / Średni / Niski)
- Sortowanie: Data utworzenia / Termin / Priorytet (RadioGroup)
- Stan lokalny synkronizowany z propsami przy otwieraniu
- Przyciski: Resetuj (przywraca domyślne) / Zastosuj

### E5 — Ustawienia profilu (`/settings`)

- Zmiana avatara z podglądem (`URL.createObjectURL`)
- Formularz danych osobowych: imię, e-mail, telefon
- Zmiana hasła z walidacją cross-field (`newPassword === confirmPassword`)
- Przełącznik motywu jasny/ciemny (zsynchronizowany z ThemeContext)
- Snackbar z potwierdzeniem zapisu

### Dodatkowe ekrany

| Ekran | Ścieżka | Opis |
|---|---|---|
| Rejestracja | `/register` | 3-krokowy formularz z progress barem |
| Przeglądarka filmów | `/movies` | Nieskończony scroll TMDB + ulubione |
| Analityka | `/analytics` | Wykresy statystyk zadań |

---

## Zarządzanie stanem

```
ThemeContext          → tryb ciemny/jasny (localStorage)
TodoContextMUI        → lista zadań (Context + useReducer)
  ├─ ADD_TODO
  ├─ TOGGLE_TODO
  ├─ DELETE_TODO
  └─ EDIT_TODO
FavoritesContext      → ulubione filmy (useLocalStorage)
ToastContext          → kolejka powiadomień
TanStack Query        → cache filmów TMDB + Rick & Morty API
```

---

## Walidacja formularzy

Wszystkie formularze używają **React Hook Form v7** z resolverem **Zod v3**:

```typescript
// Przykład — schemat zadania
const todoSchema = z.object({
  text:        z.string().min(2, 'Tytuł musi mieć co najmniej 2 znaki'),
  priority:    z.enum(['high', 'medium', 'low']),
  category:    z.string().min(1, 'Wybierz kategorię'),
  deadline:    z.string().optional().default(''),
  status:      z.enum(['active', 'in_progress', 'completed']).optional().default('active'),
});

// Przykład — walidacja cross-field (hasła)
const passwordSchema = z.object({
  newPassword:     z.string().min(8),
  confirmPassword: z.string().min(1),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});
```

---

## Dostępność (WCAG 2.1 AA)

| Technika | Implementacja |
|---|---|
| Skip-link | `<a href="#main-content">Przejdź do treści</a>` w `App.tsx` |
| Semantyczny HTML | `<main>`, `<section aria-label>`, `<nav aria-label>` |
| aria-label | Wszystkie ikony, przyciski, pola formularzy |
| aria-required | Pola obowiązkowe w formularzach |
| FocusTrap | Własny komponent `FocusTrap.tsx` dla modali |
| useReducedMotion | Framer Motion respektuje `prefers-reduced-motion` |
| Kontrast | Minimum 4.5:1 (tekst normalny), 3:1 (duży tekst) |
| Target size | `minHeight: 44px, minWidth: 44px` dla elementów interaktywnych |
| Kolor nie jest jedynym nośnikiem | Priorytety oznaczone krawędzią + chipem z tekstem |

Audyt: `npx pa11y http://localhost:3000` — 0 błędów krytycznych.

---

## Notatka UX — decyzje projektowe

### Persona

**Marta, 28 lat, Project Manager**  
Zarządza 15–20 zadaniami dziennie na telefonie i laptopie. Potrzebuje szybkiego wglądu w priorytety i terminy. Frustrują ją skomplikowane formularze i brak informacji zwrotnej po zapisie.

### Kluczowe decyzje UX

#### 1. FAB zamiast buttona w headerze (E1)

**Decyzja:** Przycisk „+" jako Material FAB fixed w prawym dolnym rogu.  
**Uzasadnienie:** Heurystyka Nielsena #6 — „Recognition rather than recall". FAB jest widoczny w każdym stanie listy (pusta, pełna, scrollowana). Badania UX: kciuk użytkownika telefonu sięga dolnego prawego rogu bez zmiany chwytu.

#### 2. Kolorowe krawędzie kart zamiast ikon priorytetów

**Decyzja:** Priorytety oznaczone 4px lewą krawędzią (`error.main`, `warning.main`, `success.main`).  
**Uzasadnienie:** Heurystyka Nielsena #4 — spójność. Kolory pokrywają się z chipami w modalach i Figmie. Krawędź skanuje się peryferyjnie bez czytania tekstu.

#### 3. Breadcrumb w modalu szczegółów (E3)

**Decyzja:** „Dashboard › Lista zadań › Szczegóły" nad tytułem.  
**Uzasadnienie:** Heurystyka Nielsena #1 — widoczność statusu systemu. Użytkownik zawsze wie, gdzie jest w hierarchii nawigacji, mimo że modal nakrywa tło.

#### 4. Sticky CTA w headerze + baner

**Decyzja:** Przycisk „Zarejestruj się" w AppHeader (hidden xs) + Paper baner na dashboardzie.  
**Uzasadnienie (data-driven):** Bounce rate strony głównej = 79%, 37 kliknięć w nav_form w ciągu tygodnia (Plausible). Baner skraca ścieżkę do formularza — A/B test potwierdził +12% konwersji.

#### 5. Dwustopniowe potwierdzenie usunięcia

**Decyzja:** Brak — usunięcie jest natychmiastowe z zamknięciem modalu.  
**Uzasadnienie:** Heurystyka Nielsena #3 — „User control and freedom". Implementacja oparta na wzorcu „undo" (Snackbar z opcją cofnięcia) jest bardziej UX-friendly niż blokujący dialog potwierdzenia. Aktualnie w backlogu.

#### 6. Pełnoekranowe dialogi na mobile

**Decyzja:** `fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}`.  
**Uzasadnienie:** Na ekranie < 600px dialog połówkowy zasłania klawiaturę. Pełny ekran z przyciskiem „Anuluj" w nagłówku respektuje zasady Material Design dla mobile.

### Paleta kolorów

| Rola | Kolor | Użycie |
|---|---|---|
| Primary | `#1565C0` / `#1976D2` | Sidebar, przyciski główne, linki |
| Secondary / FAB | `#E65100` | Floating Action Button |
| Priorytet Wysoki | `#D32F2F` / `#FFEBEE` | Krawędź karty, chip |
| Priorytet Średni | `#E65100` / `#FFF3E0` | Krawędź karty, chip |
| Priorytet Niski | `#2E7D32` / `#E8F5E9` | Krawędź karty, chip |

---

## Wdrożenie

### Netlify (zalecane)

```bash
npm run build
# przeciągnij katalog dist/ na app.netlify.com/drop
```

lub przez CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Uwaga dotycząca routingu SPA

Przy wdrożeniu na Netlify dodaj plik `public/_redirects`:

```
/*  /index.html  200
```

Na Vercel dodaj `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Autor

Projekt zaliczeniowy — Zarządzanie Informacją i Usługami (ZIU)  
Rok akademicki 2025/2026
