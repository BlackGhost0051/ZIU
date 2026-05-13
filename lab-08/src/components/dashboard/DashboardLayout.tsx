import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import StatsGrid from './StatsGrid';
import TodoApp from './TodoApp';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          p: { xs: 2, sm: 3 },
          width: { md: 'calc(100% - 240px)' },
          bgcolor: 'background.default',
          outline: 'none',
        }}
      >
        <AppHeader onMenuClick={handleDrawerToggle} mobileOpen={mobileOpen} />
        <Toolbar />
        <section aria-label="Statystyki zadań">
          <StatsGrid />
        </section>
        <section aria-label="Lista zadań" style={{ marginTop: 'clamp(1.5rem, 3vw, 2rem)' }}>
          <TodoApp />
        </section>
      </Box>
    </Box>
  );
}
