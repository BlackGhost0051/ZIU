import { useMemo } from 'react';
import {
  List, ListItem, ListItemText, ListItemIcon,
  Checkbox, IconButton, Typography, Paper, Chip
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Todo } from '../types/todo';

type FilterType = 'all' | 'active' | 'completed';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter?: FilterType;
}

export default function TodoList({ todos, onToggle, onDelete, filter = 'all' }: TodoListProps) {
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (filteredTodos.length === 0) {
    return (
      <Typography color='text.secondary' textAlign='center' sx={{ mt: 4 }}>
        Brak zadań. Dodaj pierwsze!
      </Typography>
    );
  }

  return (
    <Paper variant='outlined' sx={{ overflow: 'hidden' }}>
      <List disablePadding>
        {filteredTodos.map((todo, idx) => (
          <ListItem
            key={todo.id}
            divider={idx < filteredTodos.length - 1}
            sx={{ bgcolor: todo.completed ? 'action.hover' : 'background.paper' }}
            secondaryAction={
              <IconButton
                edge='end'
                color='error'
                onClick={() => onDelete(todo.id)}
                aria-label='Usuń zadanie'
              >
                <DeleteOutlineIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              <Checkbox
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                inputProps={{ 'aria-label': todo.text }}
              />
            </ListItemIcon>
            <ListItemText
              primary={todo.text}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.disabled' : 'text.primary',
              }}
            />
            {todo.completed && (
              <Chip label='Ukończone' size='small' color='success' sx={{ mr: 1 }} />
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
