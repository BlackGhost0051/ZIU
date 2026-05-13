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
        component='main'
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: 'calc(100% - 240px)' },
          bgcolor: 'background.default',
        }}
      >
        <AppHeader onMenuClick={handleDrawerToggle} mobileOpen={mobileOpen} />
        <Toolbar />
        <StatsGrid />
        <Box sx={{ mt: { xs: 3, sm: 4 } }}>
          <TodoApp />
        </Box>
      </Box>
    </Box>
  );
}
