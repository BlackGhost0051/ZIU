# Tabela Porównawcza: Material-UI vs Tailwind CSS

## Autor: Laboratorium 5 - ZIU 2026

---

## 1. Tabela Porównawcza

| Kryterium | Material-UI | Tailwind CSS | Zwycięzca |
|-----------|-------------|--------------|---------|
| **Szybkość rozwoju** | Średnia - wymaga importowania komponentów | Wysoka - klasy utility bezpośrednio w JSX | Tailwind |
| **Krzywą uczenia** | Stroma - trzeba znać API MUI | Łagodna - podstawy CSS + nazewnictwo klas | Tailwind |
| **Rozmiar bundle** | 350 kB (z tree-shaking) | 10 kB (po purge) | Tailwind |
| **Spójność designu** | Wysoka - Material Design out-of-the-box | Wymaga dyscypliny i własnego design system | MUI     |
| **Dostępność (a11y)** | Wbudowana - aria labels, keyboard nav | Manualna implementacja | MUI     |
| **Customizacja** | Theme provider - centralna konfiguracja | Tailwind config + własne klasy | ⚖Remis  |
| **Komponenty gotowe** | Bogata biblioteka (Button, TextField, Dialog) | Brak - tylko utility classes | MUI     |
| **Responsywność** | Breakpoints w sx prop | Prefixy responsive (sm:, md:, lg:) | Tailwind |
| **TypeScript support** | Doskonały - pełne typy | Dobry - ale brak autocomplete dla klas | MUI     |
| **Konserwacja** | Logika w komponentach, style w theme | Style w JSX - łatwiej znaleźć i edytować | Tailwind |
| **Performance** | Re-render przez emotion/styled | Statyczne klasy CSS - szybsze | Tailwind |
| **Dark Mode** | useTheme + palette.mode | dark: prefix lub CSS variables | Remis   |

---

## 2. Analiza Kodu z Projektu

### 2.1. TodoInput - Porównanie Implementacji

#### Material-UI (`TodoInput.tsx`)
```tsx
<TextField
  fullWidth
  placeholder='Wpisz treść zadania...'
  value={text}
  onChange={e => setText(e.target.value)}
  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
/>
<Button
  variant='contained'
  startIcon={<AddIcon />}
  onClick={handleSubmit}
  disabled={!text.trim()}
>
  Dodaj
</Button>
```

**Zalety:**
- Gotowy komponent TextField z walidacją, focus states
- Button z ikonami out-of-the-box
- Automatyczna obsługa disabled state styling
- Aria labels wbudowane

**Wady:**
- Wymaga importu 3 komponentów + ikona
- Większy bundle size
- Mniej kontroli nad HTML structure

#### Tailwind CSS (`TodoInput.tailwind.tsx`)
```tsx
<input
  type='text'
  className='flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
/>
<button
  className='px-5 py-2 text-sm font-semibold text-white bg-brand-500 rounded-lg
    hover:bg-brand-700 transition-colors disabled:opacity-40'
>
  Dodaj
</button>
```

**Zalety:**
- Pełna kontrola nad HTML i stylami
- Wszystko w jednym miejscu - łatwe debugowanie
- Mniejszy bundle
- Szybszy rendering (brak JS-in-CSS)

**Wady:**
- Długie className strings
- Manualna implementacja focus/hover states
- Brak wbudowanej accessibility

---

### 2.2. Theme i Stylowanie

#### Material-UI - Centralna konfiguracja
```tsx
const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#E65100' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});
```

**Obserwacje:**
- Jeden plik - wszystkie kolory i typy
- Łatwa zmiana motywu globalnie
- Wymaga ThemeProvider wrapper
- Runtime overhead (emotion)

#### Tailwind - tailwind.config.js
```js
theme: {
  extend: {
    colors: {
      'brand-500': '#1565C0',
      'brand-700': '#0D47A1'
    }
  }
}
```

**Obserwacje:**
- Build-time processing - zero runtime cost
- Purge unused styles automatycznie
- Trzeba znać wszystkie kolory z góry
- Brak dynamicznej zmiany theme (wymaga CSS variables)

---

### 2.3. Dashboard z Dynamicznymi Danymi

W projekcie zaimplementowano mini-dashboard z **rzeczywistymi statystykami**:

```tsx
// StatsGrid.tsx - obliczenia dynamiczne
const total = state.todos.length;
const completed = state.todos.filter(todo => todo.completed).length;
const pending = state.todos.filter(todo => !todo.completed).length;

<StatsCard
  title='Wszystkie zadania'
  value={total}  // 👈 Dynamiczna wartość
  icon={FormatListBulletedIcon}
/>
```

**Osiągnięcia:**
- 3 karty statystyk (Wszystkie, Ukończone, Oczekujące)
- Dane obliczane z state w czasie rzeczywistym
- Ikony Material Design
- Responsive grid layout
- Komponenty MUI: Card, CardContent, Box, Avatar, Typography

---

## 3. Wnioski

### Kiedy używać Material-UI?

1. **Enterprise aplikacje** - potrzebna spójna UI/UX zgodna z Material Design
2. **Szybkie prototypy** - gotowe komponenty jak DatePicker, Autocomplete, Stepper
3. **Accessibility-first** - aplikacje wymagające WCAG 2.1 compliance
4. **Zespoły backend-heavy** - developerzy nieznający CSS mogą szybko stworzyć UI
5. **Aplikacje z dark mode** - wbudowane wsparcie przez theme.palette.mode

**Przykład:** Panel administracyjny, dashboard analityczny, internal tools

### Kiedy używać Tailwind CSS?

1. **Marketing pages** - potrzebna unikalna, custom grafika
2. **Performance-critical apps** - minimal JavaScript overhead
3. **Design-driven projects** - pełna kontrola nad każdym pixelem
4. **Małe zespoły** - wszyscy znają CSS, nie trzeba uczyć się MUI API
5. **Landing pages** - optymalizacja bundle size

**Przykład:** Portfolio, blog, e-commerce storefront, SaaS landing page

---

## 4. Osobiste Wnioski

### Co mi się podobało w MUI:
- **Konsystencja** - każdy komponent wygląda profesjonalnie bez wysiłku
- **Ikony** - @mui/icons-material to ogromna biblioteka
- **Theme System** - zmiana kolorów w całej aplikacji w 1 miejscu
- **TypeScript** - autocomplete dla wszystkich props

### Co mi się podobało w Tailwind:
- **Szybkość** - nie trzeba przeskakiwać między plikami
- **Czytelność** - widzę dokładnie jakie style są aplikowane
- **Bundle size** - różnica 470 kB to ogromna sprawa dla mobile
- **Flexibilność** - mogę zrobić DOKŁADNIE to co chcę
