
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function AppHeader() {
  return (
    <AppBar
      position='static'
      elevation={0}
      sx={{
        bgcolor: 'transparent',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Typography variant='h5' fontWeight={600} sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color='inherit' aria-label='Powiadomienia'>
            <NotificationsIcon />
          </IconButton>
          <IconButton color='inherit' aria-label='Zmień motyw'>
            <Brightness4Icon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
