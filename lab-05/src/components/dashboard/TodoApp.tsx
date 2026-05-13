import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTodoContext } from '../../context/TodoContextMUI';
import TodoInput from '../TodoInput';
import TodoList from '../TodoListMUI';
import FilterButtons from './FilterButtons';

type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const { state, dispatch } = useTodoContext();
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAdd = (text: string) => {
    dispatch({ type: 'ADD', payload: text });
  };

  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE', payload: id });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
          Todo App
        </Typography>

        <TodoInput onAdd={handleAdd} />

        <FilterButtons
          currentFilter={filter}
          onFilterChange={setFilter}
        />

        <TodoList
          todos={state.todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          filter={filter}
        />
      </Paper>
    </Box>
  );
}
