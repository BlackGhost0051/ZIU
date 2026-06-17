import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormGroup, FormControlLabel, Checkbox,
  RadioGroup, Radio, Typography, Box, Divider, Chip,
} from '@mui/material';
import { Priority } from '../types/todo';

export type FilterStatus = 'all' | 'active' | 'completed' | 'in_progress';
export type SortBy = 'createdAt' | 'deadline' | 'priority';

export interface TodoFilters {
  status: FilterStatus;
  priorities: Priority[];
  sortBy: SortBy;
}

interface TodoFilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: TodoFilters;
  onApply: (filters: TodoFilters) => void;
  resultCount: number;
}

const PRIORITY_OPTS: { value: Priority; label: string; color: 'error' | 'warning' | 'success' }[] = [
  { value: 'high',   label: 'Wysoki', color: 'error' },
  { value: 'medium', label: 'Średni', color: 'warning' },
  { value: 'low',    label: 'Niski',  color: 'success' },
];

export const DEFAULT_FILTERS: TodoFilters = {
  status:     'all',
  priorities: ['high', 'medium', 'low'],
  sortBy:     'createdAt',
};

import { useState, useEffect } from 'react';

export default function TodoFilterModal({ open, onClose, filters, onApply, resultCount }: TodoFilterModalProps) {
  const [local, setLocal] = useState<TodoFilters>(filters);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const togglePriority = (p: Priority) => {
    setLocal(prev => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter(x => x !== p)
        : [...prev.priorities, p],
    }));
  };

  const handleReset = () => setLocal(DEFAULT_FILTERS);

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="filter-title">
      <DialogTitle id="filter-title" sx={{ fontWeight: 700 }}>
        Filtry i sortowanie
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>

        {/* STATUS */}
        <Typography variant="overline" color="primary" fontWeight={700} display="block" sx={{ mb: 0.5 }}>
          Status
        </Typography>
        <RadioGroup
          value={local.status}
          onChange={e => setLocal(prev => ({ ...prev, status: e.target.value as FilterStatus }))}
        >
          {[
            { value: 'all',         label: 'Wszystkie' },
            { value: 'active',      label: 'Aktywne' },
            { value: 'in_progress', label: 'W trakcie' },
            { value: 'completed',   label: 'Ukończone' },
          ].map(opt => (
            <FormControlLabel
              key={opt.value}
              value={opt.value}
              control={<Radio size="small" />}
              label={opt.label}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: 14 } }}
            />
          ))}
        </RadioGroup>

        <Divider sx={{ my: 1.5 }} />

        {/* PRIORYTET */}
        <Typography variant="overline" color="primary" fontWeight={700} display="block" sx={{ mb: 0.5 }}>
          Priorytet
        </Typography>
        <FormGroup>
          {PRIORITY_OPTS.map(p => (
            <FormControlLabel
              key={p.value}
              control={
                <Checkbox
                  size="small"
                  checked={local.priorities.includes(p.value)}
                  onChange={() => togglePriority(p.value)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: 14 }}>{p.label}</span>
                  <Chip label="●" color={p.color} size="small" sx={{ width: 24, height: 18, fontSize: 8 }} />
                </Box>
              }
            />
          ))}
        </FormGroup>

        <Divider sx={{ my: 1.5 }} />

        {/* SORTUJ */}
        <Typography variant="overline" color="primary" fontWeight={700} display="block" sx={{ mb: 0.5 }}>
          Sortuj według
        </Typography>
        <RadioGroup
          value={local.sortBy}
          onChange={e => setLocal(prev => ({ ...prev, sortBy: e.target.value as SortBy }))}
        >
          {[
            { value: 'createdAt', label: 'Data dodania' },
            { value: 'deadline',  label: 'Termin' },
            { value: 'priority',  label: 'Priorytet' },
          ].map(opt => (
            <FormControlLabel
              key={opt.value}
              value={opt.value}
              control={<Radio size="small" />}
              label={opt.label}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: 14 } }}
            />
          ))}
        </RadioGroup>

        {/* WYNIKI */}
        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Wyniki: <strong>{resultCount} zadań</strong>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleReset} variant="outlined" sx={{ minHeight: 44 }}>
          Resetuj
        </Button>
        <Button onClick={handleApply} variant="contained" sx={{ minHeight: 44, fontWeight: 700 }}>
          Zastosuj
        </Button>
      </DialogActions>
    </Dialog>
  );
}
