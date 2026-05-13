import {
  Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, Divider, Avatar, Box
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/' },
  { label: 'Zadania', icon: TaskIcon, path: '/todos' },
  { label: 'Ustawienia', icon: SettingsIcon, path: '/settings' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

export default function Sidebar({ mobileOpen, onDrawerToggle }: SidebarProps) {
  const location = useLocation();

  const drawerContent = (
    <>
      <Toolbar>
        <Typography variant="h6" fontWeight={700} component="span">
          TodoApp
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <Box component="nav" aria-label="Nawigacja boczna">
        <List>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                aria-current={isCurrent ? 'page' : undefined}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  ...(isCurrent && { bgcolor: 'rgba(255,255,255,0.15)' }),
                }}
              >
                <ListItemIcon sx={{ color: 'white' }} aria-hidden="true">
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        component="footer"
        sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        aria-label="Zalogowany użytkownik"
      >
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.dark' }} aria-hidden="true">
          U
        </Avatar>
        <Typography variant="body2">Użytkownik</Typography>
      </Box>
    </>
  );

  return (
    <Box
      component="aside"
      aria-label="Panel boczny"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
            color: 'white',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
            color: 'white',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
