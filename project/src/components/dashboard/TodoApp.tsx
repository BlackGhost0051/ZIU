import { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Fab, InputAdornment,
  Chip, List, ListItem, ListItemText, ListItemIcon,
  Checkbox, IconButton, Divider, Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion, AnimatePresence } from 'framer-motion';

import { useTodoContext, AddTodoPayload, EditTodoPayload } from '../../context/TodoContextMUI';
import { Todo, Priority, TodoStatus } from '../../types/todo';
import TodoFormModal from '../TodoFormModal';
import TodoDetailModal from '../TodoDetailModal';
import TodoFilterModal, { TodoFilters, DEFAULT_FILTERS, FilterStatus } from '../TodoFilterModal';

const PRIORITY_CONFIG: Record<Priority, { label: string; color: 'error' | 'warning' | 'success' }> = {
  high:   { label: 'Wysoki', color: 'error' },
  medium: { label: 'Średni', color: 'warning' },
  low:    { label: 'Niski',  color: 'success' },
};

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function prioritySortVal(p: Priority) { return PRIORITY_ORDER[p]; }

function applyFiltersAndSort(todos: Todo[], search: string, filters: TodoFilters): Todo[] {
  let result = todos;

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(t =>
      t.text.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  if (filters.status !== 'all') {
    result = result.filter(t => {
      if (filters.status === 'completed') return t.completed;
      if (filters.status === 'active')    return !t.completed && t.status === 'active';
      if (filters.status === 'in_progress') return t.status === 'in_progress';
      return true;
    });
  }

  result = result.filter(t => filters.priorities.includes(t.priority));

  result = [...result].sort((a, b) => {
    if (filters.sortBy === 'priority') return prioritySortVal(a.priority) - prioritySortVal(b.priority);
    if (filters.sortBy === 'deadline') {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    }
    return b.createdAt.localeCompare(a.createdAt);
  });

  return result;
}

const QUICK_FILTERS: { value: FilterStatus | 'high'; label: string }[] = [
  { value: 'all',         label: 'Wszystkie' },
  { value: 'active',      label: 'Aktywne' },
  { value: 'completed',   label: 'Ukończone' },
  { value: 'high',        label: 'High Priority' },
];

export default function TodoApp() {
  const { state, dispatch } = useTodoContext();

  const [search, setSearch]           = useState('');
  const [quickFilter, setQuickFilter] = useState<FilterStatus | 'high'>('all');
  const [filters, setFilters]         = useState<TodoFilters>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen]       = useState(false);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [detailTodo, setDetailTodo]   = useState<Todo | null>(null);
  const [editTodo, setEditTodo]       = useState<Todo | null>(null);

  const effectiveFilters: TodoFilters = useMemo(() => {
    if (quickFilter === 'high') return { ...filters, status: 'all', priorities: ['high'] };
    return { ...filters, status: quickFilter };
  }, [quickFilter, filters]);

  const displayed = useMemo(
    () => applyFiltersAndSort(state.todos, search, effectiveFilters),
    [state.todos, search, effectiveFilters]
  );

  const handleAdd = (data: AddTodoPayload) => {
    dispatch({ type: 'ADD', payload: data });
  };

  const handleEdit = (data: EditTodoPayload) => {
    dispatch({ type: 'EDIT', payload: data });
  };

  const handleToggle = (id: string) => dispatch({ type: 'TOGGLE', payload: id });
  const handleDelete = (id: string) => dispatch({ type: 'DELETE', payload: id });

  const openEdit = (todo: Todo) => { setEditTodo(todo); setFormOpen(true); };

  return (
    <Box sx={{ maxWidth: { xs: '100%', lg: 1100 }, mx: 'auto', mt: { xs: 1, sm: 4 }, position: 'relative', pb: 10 }}>
      <Paper sx={{ p: { xs: 1.5, sm: 3 } }}>

        {/* heading */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight={700} sx={{ fontSize: { xs: '1.15rem', sm: '1.5rem' } }}>
            Lista zadań
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterOpen(true)}
            aria-label="Otwórz filtry"
            sx={{ minHeight: 44, minWidth: 44 }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Filtry</Box>
          </Button>
        </Box>

        {/* search */}
        <TextField
          fullWidth
          placeholder="Szukaj zadań..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" aria-hidden="true" />
              </InputAdornment>
            ),
          }}
          inputProps={{ 'aria-label': 'Szukaj zadań' }}
        />

        {/* quick filter chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3, overflowX: 'auto', pb: 0.5 }}>
          {QUICK_FILTERS.map(f => (
            <Chip
              key={f.value}
              label={f.label}
              onClick={() => setQuickFilter(f.value)}
              color={quickFilter === f.value ? 'primary' : 'default'}
              variant={quickFilter === f.value ? 'filled' : 'outlined'}
              clickable
              aria-pressed={quickFilter === f.value}
            />
          ))}
        </Box>

        {/* live region */}
        <div role="status" aria-atomic="true" className="visually-hidden">
          {`Znaleziono ${displayed.length} zadań`}
        </div>

        {/* task list */}
        <article aria-label="Lista zadań">
          {displayed.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
              Brak zadań pasujących do filtrów.
            </Typography>
          ) : (
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <List disablePadding>
                <AnimatePresence initial={false}>
                  {displayed.map((todo, idx) => {
                    const pCfg = PRIORITY_CONFIG[todo.priority];
                    return (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItem
                          divider={idx < displayed.length - 1}
                          sx={{
                            bgcolor: todo.completed ? 'action.hover' : 'background.paper',
                            borderLeft: `4px solid`,
                            borderLeftColor: `${pCfg.color}.main`,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.selected' },
                          }}
                          onClick={() => setDetailTodo(todo)}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={e => { e.stopPropagation(); handleDelete(todo.id); }}
                              aria-label="Usuń zadanie"
                              sx={{ minWidth: 44, minHeight: 44 }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          }
                        >
                          <ListItemIcon onClick={e => e.stopPropagation()}>
                            <Checkbox
                              checked={todo.completed}
                              onChange={() => handleToggle(todo.id)}
                              inputProps={{ 'aria-label': todo.text }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography
                                  variant="body1"
                                  fontWeight={600}
                                  sx={{
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    color: todo.completed ? 'text.disabled' : 'text.primary',
                                  }}
                                >
                                  {todo.text}
                                </Typography>
                                <Chip
                                  label={pCfg.label}
                                  color={pCfg.color}
                                  size="small"
                                  sx={{ fontWeight: 600, height: 20, fontSize: 11 }}
                                />
                              </Box>
                            }
                            secondary={todo.deadline ? `📅 Termin: ${new Date(todo.deadline).toLocaleDateString('pl-PL')}` : undefined}
                          />
                        </ListItem>
                        {idx < displayed.length - 1 && <Divider component="li" />}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </List>
            </Paper>
          )}
        </article>
      </Paper>

      {/* FAB */}
      <Fab
        color="secondary"
        aria-label="Dodaj nowe zadanie"
        onClick={() => { setEditTodo(null); setFormOpen(true); }}
        sx={{ position: 'fixed', bottom: { xs: 16, sm: 32 }, right: { xs: 16, sm: 32 }, zIndex: 1200 }}
      >
        <AddIcon />
      </Fab>

      {/* modals */}
      <TodoFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTodo(null); }}
        onSave={data => {
          if (editTodo) {
            handleEdit({
              id:          editTodo.id,
              text:        data.text,
              description: data.description ?? '',
              priority:    data.priority,
              category:    data.category,
              deadline:    data.deadline || null,
              status:      (data.status ?? 'active') as TodoStatus,
            });
          } else {
            handleAdd({
              text:        data.text,
              description: data.description ?? '',
              priority:    data.priority,
              category:    data.category,
              deadline:    data.deadline || null,
            });
          }
        }}
        editTodo={editTodo}
      />

      <TodoDetailModal
        todo={detailTodo}
        open={Boolean(detailTodo)}
        onClose={() => setDetailTodo(null)}
        onEdit={todo => { setDetailTodo(null); openEdit(todo); }}
        onDelete={handleDelete}
      />

      <TodoFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
        resultCount={displayed.length}
      />
    </Box>
  );
}
