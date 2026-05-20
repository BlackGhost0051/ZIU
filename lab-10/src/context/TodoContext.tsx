import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme musi być użyty wewnątrz ThemeProvider');
  }
  return ctx;
}

export function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      style={{
        padding: '8px 16px',
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {theme === 'light' ? 'Tryb ciemny' : '☀Tryb jasny'}
    </button>
  );
}
