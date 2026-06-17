import { useState } from 'react';
import { Box, Toolbar, Paper, Typography, Button } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import StatsGrid from './StatsGrid';
import TodoApp from './TodoApp';
import MovieBrowserPage from './MovieBrowserPage';
import AnalyticsPage from './AnalyticsPage';
import SettingsPage from './SettingsPage';
import { trackCtaClick } from '../../utils/analytics';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMovies = location.pathname === '/movies';
  const isAnalytics = location.pathname === '/analytics';
  const isSettings = location.pathname === '/settings';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        aria-label="Treść główna aplikacji"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: isMovies ? 0 : { xs: 2, sm: 3 },
          width: { md: 'calc(100% - 240px)' },
          bgcolor: isMovies ? 'transparent' : 'background.default',
          outline: 'none',
          overflow: isMovies ? 'auto' : undefined,
        }}
      >
        {!isMovies && <AppHeader onMenuClick={handleDrawerToggle} mobileOpen={mobileOpen} />}
        {isMovies ? (
          <MovieBrowserPage />
        ) : isAnalytics ? (
          <>
            <Toolbar />
            <Box sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}>
              <AnalyticsPage />
            </Box>
          </>
        ) : isSettings ? (
          <>
            <Toolbar />
            <Box sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}>
              <SettingsPage />
            </Box>
          </>
        ) : (
          <>
            <Toolbar />
            <section aria-label="Statystyki zadań">
              <StatsGrid />
            </section>
            {/* Iteracja C3 — CTA baner uzasadniony danymi: bounce home=79%, nav_form=37 kliknięć
                sugeruje że użytkownicy szukają drogi do formularza. Baner skraca tę ścieżkę. */}
            <Paper
              elevation={0}
              sx={{
                mt: 'clamp(1rem, 2vw, 1.5rem)',
                p: { xs: 2, sm: 3 },
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                  Gotowy, żeby dołączyć?
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
                  Rejestracja zajmuje 2 minuty — 3 kroki, bez zbędnych danych.
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                startIcon={<AssignmentIcon />}
                onClick={() => trackCtaClick('hero_cta_banner')}
                aria-label="Zarejestruj się — przejdź do formularza rejestracji"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'grey.100' },
                  whiteSpace: 'nowrap',
                }}
              >
                Zarejestruj się
              </Button>
            </Paper>
            <section aria-label="Lista zadań" style={{ marginTop: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <TodoApp />
            </section>
          </>
        )}
      </Box>
    </Box>
  );
}
