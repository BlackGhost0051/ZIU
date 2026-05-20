import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import StatsGrid from './StatsGrid';
import TodoApp from './TodoApp';
import MovieBrowserPage from './MovieBrowserPage';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMovies = location.pathname === '/movies';

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
        ) : (
          <>
            <Toolbar />
            <section aria-label="Statystyki zadań">
              <StatsGrid />
            </section>
            <section aria-label="Lista zadań" style={{ marginTop: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <TodoApp />
            </section>
          </>
        )}
      </Box>
    </Box>
  );
}
