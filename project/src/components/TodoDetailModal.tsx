import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, Divider,
  useMediaQuery, useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Todo, Priority, TodoStatus } from '../types/todo';

const PRIORITY_CONFIG: Record<Priority, { label: string; color: 'error' | 'warning' | 'success' }> = {
  high:   { label: 'Wysoki', color: 'error' },
  medium: { label: 'Średni', color: 'warning' },
  low:    { label: 'Niski',  color: 'success' },
};

const STATUS_CONFIG: Record<TodoStatus, { label: string; color: 'default' | 'warning' | 'success' }> = {
  active:      { label: 'Aktywne',    color: 'default' },
  in_progress: { label: 'W trakcie',  color: 'warning' },
  completed:   { label: 'Ukończone',  color: 'success' },
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ minWidth: 140 }}>
          {label}
        </Typography>
        <Box sx={{ textAlign: 'right' }}>{children}</Box>
      </Box>
      <Divider />
    </>
  );
}

interface TodoDetailModalProps {
  todo: Todo | null;
  open: boolean;
  onClose: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoDetailModal({ todo, open, onClose, onEdit, onDelete }: TodoDetailModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  if (!todo) return null;

  const priority = PRIORITY_CONFIG[todo.priority];
  const status   = STATUS_CONFIG[todo.status];

  const handleDelete = () => {
    onDelete(todo.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="detail-title"
    >
      {/* breadcrumb-style header */}
      <Box sx={{ px: 3, pt: 2.5, pb: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Dashboard › Lista zadań › <strong>Szczegóły</strong>
        </Typography>
      </Box>

      <DialogTitle id="detail-title" sx={{ fontWeight: 700, pt: 1, pb: 0.5 }}>
        {todo.text}
      </DialogTitle>

      <Box sx={{ px: 3, pb: 1 }}>
        <Chip
          label={status.label}
          color={status.color}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <DialogContent sx={{ pt: 1 }}>
        {/* opis */}
        <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          Opis zadania
        </Typography>
        <Box
          sx={{
            bgcolor: 'action.hover',
            borderRadius: 1,
            p: 1.5,
            mb: 2,
            minHeight: 60,
          }}
        >
          <Typography variant="body2" color={todo.description ? 'text.primary' : 'text.disabled'}>
            {todo.description || 'Brak opisu.'}
          </Typography>
        </Box>

        {/* szczegóły */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
          Szczegóły
        </Typography>
        <Divider />

        <DetailRow label="Termin">
          <Typography variant="body2" fontWeight={600}>{formatDate(todo.deadline)}</Typography>
        </DetailRow>

        <DetailRow label="Priorytet">
          <Chip label={priority.label} color={priority.color} size="small" sx={{ fontWeight: 600 }} />
        </DetailRow>

        <DetailRow label="Status">
          <Chip label={status.label} color={status.color} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
        </DetailRow>

        <DetailRow label="Kategoria">
          <Typography variant="body2" fontWeight={600}>{todo.category}</Typography>
        </DetailRow>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ minWidth: 140 }}>
            Data utworzenia
          </Typography>
          <Typography variant="body2" fontWeight={600}>{formatDate(todo.createdAt)}</Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={handleDelete}
          sx={{ minHeight: 44 }}
        >
          Usuń
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={onClose} variant="outlined" sx={{ minHeight: 44 }}>
            Zamknij
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => { onClose(); onEdit(todo); }}
            sx={{ minHeight: 44, fontWeight: 700 }}
          >
            Edytuj
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
