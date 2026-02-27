# SkyMap - Satellite Tracking Landing Page

Interaktywna landing page o tematyce śledzenia satelitów i map nieba, stworzona w React.

## Opis projektu

SkyMap to nowoczesna strona typu landing page promująca aplikację do śledzenia satelitów w czasie rzeczywistym oraz eksploracji map gwiezdnych. Projekt zawiera:

- **Hero Section** z animowanymi satelitami na orbicie
- **Sekcję Features** z 6 kluczowymi funkcjami aplikacji
- **Kartami satelitów** (ISS, Hubble, Starlink, JWST) z danymi orbitalnymi
- **Responsywny design** z futurystyczną kolorystyką
- **Animacje CSS** (gwiazdki, orbity, efekty hover)

## Technologie

- React 18.3.1
- CSS3 z animacjami i gradientami
- Google Fonts (Orbitron, Space Grotesk)
- React Scripts 5.0.1

## Instalacja i uruchomienie

### Wymagania
- Node.js 20 LTS lub nowszy
- npm 9.x lub nowszy

### Kroki instalacji

```bash
npm install

npm start
```

Aplikacja zostanie uruchomiona na: **http://localhost:3000**

## Struktura projektu

```
lab-01/
├── public/
│   └── index.html          # Główny plik HTML
├── src/
│   ├── components/         # Komponenty React
│   │   ├── Header.jsx      # Nawigacja
│   │   ├── Hero.jsx        # Sekcja główna z animacjami
│   │   ├── Features.jsx    # Funkcje aplikacji
│   │   ├── Satellites.jsx  # Karty satelitów
│   │   └── Footer.jsx      # Stopka
│   ├── styles/            # Style CSS
│   │   ├── index.css       # Style globalne
│   │   ├── App.css         # Style App
│   │   ├── Header.css      # Style nawigacji
│   │   ├── Hero.css        # Style Hero z animacjami orbit
│   │   ├── Features.css    # Style Features
│   │   ├── Satellites.css  # Style kart satelitów
│   │   └── Footer.css      # Style Footer
│   ├── App.jsx            # Główny komponent
│   └── index.js           # Entry point React
├── package.json           # Zależności projektu
└── README.md             # Dokumentacja

```

## Funkcje i szczegóły UI/UX

### Kolory (Space Theme)
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#ec4899` (Pink)
- **Background**: Dark gradients (`#0f0f23`, `#050510`)

### Animacje
- Rotujące satelity na orbicie (3 różne prędkości)
- Pulsująca planeta w Hero section
- Migające gwiazdki w tle
- Hover effects na kartach (transform, glow)
- Gradient animations na przyciskach

### Responsywność
- Desktop: Grid layout, sidebar navigation
- Tablet: 2-kolumnowy grid
- Mobile: Single column, stack layout

## Dodatkowe komendy

```bash
npm run build

npm test

npm run eject
```
