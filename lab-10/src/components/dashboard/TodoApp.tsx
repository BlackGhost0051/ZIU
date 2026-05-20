import { useState, useRef } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import InfoIcon from '@mui/icons-material/Info';
import { useTodoContext } from '../../context/TodoContextMUI';
import TodoInput from '../TodoInput';
import TodoList from '../TodoListMUI';
import TodoCardGrid from '../TodoCardGrid';
import FilterButtons from './FilterButtons';
import { ModalDialog } from '../ModalDialog';

type FilterType = 'all' | 'active' | 'completed';
type ViewType = 'list' | 'grid';

export default function TodoApp() {
  const { state, dispatch } = useTodoContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<ViewType>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  const handleAdd = (text: string) => {
    dispatch({ type: 'ADD', payload: text });
  };

  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE', payload: id });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: ViewType | null) => {
    if (newView !== null) setView(newView);
  };

  const filteredTodos = state.todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  const filteredCount = filteredTodos.length;
  const filterLabel = filter === 'all' ? 'wszystkich' : filter === 'active' ? 'aktywnych' : 'ukończonych';

  const liveMessage = state.todos.length === 0
    ? ''
    : filteredCount === 0
      ? `Brak ${filterLabel} zadań`
      : `Znaleziono ${filteredCount} ${filterLabel} zadań`;

  return (
    <Box sx={{ maxWidth: { xs: '100%', lg: 1200 }, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontSize: 'var(--font-h2)', textAlign: 'center' }}
          >
            Todo App
          </Typography>
          <Button
            ref={infoButtonRef}
            variant="outlined"
            size="small"
            startIcon={<InfoIcon aria-hidden="true" />}
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
            aria-label="Informacje o aplikacji"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            Info
          </Button>
        </header>

        <TodoInput onAdd={handleAdd} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          <FilterButtons currentFilter={filter} onFilterChange={setFilter} />

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="Widok zadań"
            size="small"
          >
            <ToggleButton value="list" aria-label="Widok listy" sx={{ minWidth: 44, minHeight: 44 }}>
              <ViewListIcon aria-hidden="true" />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="Widok siatki" sx={{ minWidth: 44, minHeight: 44 }}>
              <ViewModuleIcon aria-hidden="true" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <div
          role="status"
          aria-atomic="true"
          className="visually-hidden"
        >
          {liveMessage}
        </div>

        <article aria-label="Lista zadań todo">
          {view === 'list' ? (
            <TodoList
              todos={state.todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              filter={filter}
            />
          ) : (
            <TodoCardGrid
              todos={state.todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              filter={filter}
            />
          )}
        </article>
      </Paper>

      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Informacje o aplikacji"
        triggerRef={infoButtonRef as React.RefObject<HTMLElement>}
      >
        <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>
          Todo App to aplikacja do zarządzania zadaniami zbudowana w React z Material UI.
          Obsługuje dodawanie, usuwanie i filtrowanie zadań oraz dwa widoki: listę i siatkę kart.
        </p>
        <p style={{ marginTop: '0.75rem', marginBottom: 0, lineHeight: 1.6, color: '#374151' }}>
          Aplikacja spełnia wymagania dostępności WCAG 2.1 poziom AA (Lab 8).
        </p>
      </ModalDialog>
    </Box>
  );
}
