import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';
import { trackCtaClick } from '../../utils/analytics';

interface AppHeaderProps {
  onMenuClick: () => void;
  mobileOpen: boolean;
}

export default function AppHeader({ onMenuClick, mobileOpen }: AppHeaderProps) {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      aria-label="Nagłówek aplikacji"
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
          color="inherit"
          aria-label="Otwórz menu nawigacyjne"
          aria-expanded={mobileOpen}
          aria-controls="sidebar-drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' }, minWidth: 44, minHeight: 44 }}
        >
          <MenuIcon aria-hidden="true" />
        </IconButton>

        <Typography variant="h1" component="h1" fontWeight={600} sx={{ flexGrow: 1, fontSize: '1.25rem' }}>
          Dashboard
        </Typography>

        {/* Iteracja C1 — sticky CTA uzasadnione bounce rate home=79% */}
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="small"
          startIcon={<AssignmentIcon />}
          aria-label="Zarejestruj się — przejdź do formularza"
          onClick={() => trackCtaClick('header_sticky_cta')}
          sx={{ mr: 2, fontWeight: 700 }}
        >
          Zarejestruj się
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }} role="toolbar" aria-label="Narzędzia">
          <IconButton
            color="inherit"
            aria-label="Powiadomienia"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <NotificationsIcon aria-hidden="true" />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label={mode === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            onClick={toggleTheme}
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            {mode === 'dark'
              ? <Brightness7Icon aria-hidden="true" />
              : <Brightness4Icon aria-hidden="true" />
            }
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
