import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import TodoCard from './TodoCard';
import { Todo } from '../types/todo';

type FilterType = 'all' | 'active' | 'completed';

interface TodoCardGridProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter?: FilterType;
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400',
  'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400',
  'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=400',
];

export default function TodoCardGrid({
  todos,
  onToggle,
  onDelete,
  filter = 'all',
}: TodoCardGridProps) {
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (filteredTodos.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
        Brak zadań. Dodaj pierwsze!
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(0.75rem, 2vw, 1.5rem)',
      }}
    >
      {filteredTodos.map((todo, index) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          imageUrl={placeholderImages[index % placeholderImages.length]}
        />
      ))}
    </Box>
  );
}
