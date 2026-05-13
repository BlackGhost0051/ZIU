import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';

interface AppHeaderProps {
  onMenuClick: () => void;
  mobileOpen: boolean;
}

export default function AppHeader({ onMenuClick, mobileOpen }: AppHeaderProps) {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: { md: 'calc(100% - 240px)' },
        ml: { md: '240px' },
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='Otwórz menu'
          aria-expanded={mobileOpen}
          edge='start'
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant='h5' fontWeight={600} sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        <Button
          component={Link}
          to="/register"
          variant="outlined"
          size="small"
          sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}
        >
          📝 Formularz (Lab 7)
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color='inherit'
            aria-label='Powiadomienia'
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <NotificationsIcon />
          </IconButton>
          <IconButton
            color='inherit'
            aria-label={mode === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            onClick={toggleTheme}
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
