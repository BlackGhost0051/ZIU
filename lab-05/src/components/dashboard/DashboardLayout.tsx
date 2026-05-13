import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import StatsGrid from './StatsGrid';
import TodoApp from './TodoApp';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component='main' sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <AppHeader />
        <Toolbar />
        <StatsGrid />
        <Box sx={{ mt: 4 }}>
          <TodoApp />
        </Box>
      </Box>
    </Box>
  );
}
