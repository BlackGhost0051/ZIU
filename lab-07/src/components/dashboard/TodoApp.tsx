import { useState } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useTodoContext } from '../../context/TodoContextMUI';
import TodoInput from '../TodoInput';
import TodoList from '../TodoListMUI';
import TodoCardGrid from '../TodoCardGrid';
import FilterButtons from './FilterButtons';

type FilterType = 'all' | 'active' | 'completed';
type ViewType = 'list' | 'grid';

export default function TodoApp() {
  const { state, dispatch } = useTodoContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<ViewType>('grid');

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
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ maxWidth: { xs: '100%', lg: 1200 }, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant='h4'
          sx={{
            mb: 3,
            textAlign: 'center',
            fontSize: 'var(--font-h2)',
          }}
        >
          Todo App
        </Typography>

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
            aria-label='Widok zadań'
            size='small'
          >
            <ToggleButton
              value='list'
              aria-label='Widok listy'
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton
              value='grid'
              aria-label='Widok siatki'
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

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
      </Paper>
    </Box>
  );
}
