import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, Typography, Chip,
  useMediaQuery, useTheme,
} from '@mui/material';
import { Priority, TodoStatus, Todo } from '../types/todo';

const PRIORITIES: { value: Priority; label: string; color: 'error' | 'warning' | 'success' }[] = [
  { value: 'high',   label: 'Wysoki', color: 'error' },
  { value: 'medium', label: 'Średni', color: 'warning' },
  { value: 'low',    label: 'Niski',  color: 'success' },
];

const CATEGORIES = ['Praca', 'Nauka', 'Osobiste', 'Zdrowie', 'Zakupy', 'Inne'];

const STATUSES: { value: TodoStatus; label: string }[] = [
  { value: 'active',      label: 'Aktywne' },
  { value: 'in_progress', label: 'W trakcie' },
  { value: 'completed',   label: 'Ukończone' },
];

const todoSchema = z.object({
  text:        z.string().min(2, 'Tytuł musi mieć co najmniej 2 znaki'),
  description: z.string().optional().default(''),
  priority:    z.enum(['high', 'medium', 'low']),
  category:    z.string().min(1, 'Wybierz kategorię'),
  deadline:    z.string().optional().default(''),
  status:      z.enum(['active', 'in_progress', 'completed']).optional().default('active'),
});

type FormValues = z.infer<typeof todoSchema>;

interface TodoFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => void;
  editTodo?: Todo | null;
}

export default function TodoFormModal({ open, onClose, onSave, editTodo }: TodoFormModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(editTodo);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      text:        '',
      description: '',
      priority:    'medium',
      category:    'Praca',
      deadline:    '',
      status:      'active',
    },
  });

  useEffect(() => {
    if (open) {
      if (editTodo) {
        reset({
          text:        editTodo.text,
          description: editTodo.description,
          priority:    editTodo.priority,
          category:    editTodo.category,
          deadline:    editTodo.deadline ?? '',
          status:      editTodo.status,
        });
      } else {
        reset({ text: '', description: '', priority: 'medium', category: 'Praca', deadline: '', status: 'active' });
      }
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, editTodo, reset]);

  const onSubmit = (data: FormValues) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="todo-form-title"
    >
      <DialogTitle id="todo-form-title" sx={{ fontWeight: 700, pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {isEdit ? 'Edytuj zadanie' : 'Nowe zadanie'}
        {fullScreen && (
          <Button onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>Anuluj</Button>
        )}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>

          {/* Tytuł */}
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                inputRef={titleRef}
                label="Tytuł zadania"
                required
                fullWidth
                error={Boolean(errors.text)}
                helperText={errors.text?.message}
                inputProps={{ 'aria-required': 'true', 'aria-invalid': Boolean(errors.text) }}
              />
            )}
          />

          {/* Opis */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Opis zadania"
                multiline
                rows={3}
                fullWidth
                placeholder="Dodaj szczegółowy opis zadania..."
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Termin */}
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Termin"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1, minWidth: 160 }}
                />
              )}
            />

            {/* Priorytet */}
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Priorytet"
                  required
                  error={Boolean(errors.priority)}
                  sx={{ flex: 1, minWidth: 140 }}
                >
                  {PRIORITIES.map(p => (
                    <MenuItem key={p.value} value={p.value}>
                      <Chip label={p.label} color={p.color} size="small" sx={{ fontWeight: 600 }} />
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Kategoria */}
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Kategoria"
                  required
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                  sx={{ flex: 1, minWidth: 140 }}
                >
                  {CATEGORIES.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* Status — tylko w trybie edycji */}
            {isEdit && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    sx={{ flex: 1, minWidth: 140 }}
                  >
                    {STATUSES.map(s => (
                      <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}
          </Box>

          {/* priority hint row */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Priorytety:
            </Typography>
            {PRIORITIES.map(p => (
              <Chip key={p.value} label={p.label} color={p.color} size="small" variant="outlined" />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" sx={{ minHeight: 44 }}>
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ minHeight: 44, fontWeight: 700 }}
          >
            {isEdit ? 'Zapisz zmiany' : 'Zapisz zadanie'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
