import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Paper, Typography, TextField, Button, Avatar,
  Divider, Switch, FormControlLabel, Alert, Snackbar,
} from '@mui/material';
import { useState } from 'react';
import { useThemeMode } from '../../context/ThemeContext';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Imię i nazwisko musi mieć co najmniej 2 znaki'),
  email:    z.string().email('Podaj poprawny adres e-mail'),
  phone:    z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Podaj aktualne hasło'),
  newPassword:     z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  confirmPassword: z.string().min(1, 'Potwierdź hasło'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { mode, toggleTheme } = useThemeMode();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: 'Jan Kowalski', email: 'jan.kowalski@example.com', phone: '+48 123 456 789' },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onProfileSave = (_data: ProfileForm) => {
    setSnackbar({ open: true, message: 'Dane profilu zostały zapisane.', severity: 'success' });
  };

  const onPasswordSave = (_data: PasswordForm) => {
    passwordForm.reset();
    setSnackbar({ open: true, message: 'Hasło zostało zmienione.', severity: 'success' });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', mt: { xs: 1, sm: 4 }, display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        Ustawienia profilu
      </Typography>

      {/* ── avatar ── */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={avatarPreview ?? undefined}
          sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28, fontWeight: 700 }}
          aria-label="Zdjęcie profilowe"
        >
          JK
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Zmień zdjęcie profilowe
          </Typography>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            aria-label="Wybierz zdjęcie profilowe"
            onChange={handleAvatarChange}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => avatarInputRef.current?.click()}
            sx={{ minHeight: 36 }}
          >
            Wybierz plik
          </Button>
        </Box>
      </Paper>

      {/* ── dane osobowe ── */}
      <Paper
        component="form"
        onSubmit={profileForm.handleSubmit(onProfileSave)}
        noValidate
        sx={{ p: { xs: 2, sm: 3 } }}
        aria-label="Dane osobowe"
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Dane osobowe
        </Typography>
        <Divider sx={{ mb: 2.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="fullName"
            control={profileForm.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Imię i nazwisko"
                required
                fullWidth
                error={Boolean(profileForm.formState.errors.fullName)}
                helperText={profileForm.formState.errors.fullName?.message}
                inputProps={{ 'aria-required': 'true' }}
              />
            )}
          />
          <Controller
            name="email"
            control={profileForm.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Adres e-mail"
                type="email"
                required
                fullWidth
                error={Boolean(profileForm.formState.errors.email)}
                helperText={profileForm.formState.errors.email?.message}
                inputProps={{ 'aria-required': 'true' }}
              />
            )}
          />
          <Controller
            name="phone"
            control={profileForm.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Numer telefonu"
                type="tel"
                fullWidth
              />
            )}
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" sx={{ minHeight: 44, fontWeight: 700 }}>
            Zapisz dane
          </Button>
        </Box>
      </Paper>

      {/* ── zmiana hasła ── */}
      <Paper
        component="form"
        onSubmit={passwordForm.handleSubmit(onPasswordSave)}
        noValidate
        sx={{ p: { xs: 2, sm: 3 } }}
        aria-label="Zmiana hasła"
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Zmiana hasła
        </Typography>
        <Divider sx={{ mb: 2.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller
            name="currentPassword"
            control={passwordForm.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Aktualne hasło"
                type="password"
                required
                fullWidth
                error={Boolean(passwordForm.formState.errors.currentPassword)}
                helperText={passwordForm.formState.errors.currentPassword?.message}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={passwordForm.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nowe hasło"
                type="password"
                required
                fullWidth
                error={Boolean(passwordForm.formState.errors.newPassword)}
                helperText={passwordForm.formState.errors.newPassword?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={passwordForm.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Potwierdź hasło"
                type="password"
                required
                fullWidth
                error={Boolean(passwordForm.formState.errors.confirmPassword)}
                helperText={passwordForm.formState.errors.confirmPassword?.message}
              />
            )}
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" sx={{ minHeight: 44, fontWeight: 700 }}>
            Zmień hasło
          </Button>
        </Box>
      </Paper>

      {/* ── motyw ── */}
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Wygląd
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={toggleTheme}
              inputProps={{ 'aria-label': 'Przełącz motyw ciemny' }}
            />
          }
          label="Motyw ciemny"
        />
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
