import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Todo } from '../types/todo';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  imageUrl?: string;
}

export default function TodoCard({ todo, onToggle, onDelete, imageUrl }: TodoCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {imageUrl && (
        <CardMedia
          component="img"
          image={imageUrl}
          alt={todo.text}
          sx={{
            aspectRatio: '16 / 9',
            objectFit: 'cover',
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.disabled' : 'text.primary',
              fontSize: 'var(--font-h3)',
            }}
          >
            {todo.text}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onToggle(todo.id)}
            aria-label={todo.completed ? 'Oznacz jako nieukończone' : 'Oznacz jako ukończone'}
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <CheckCircleIcon color={todo.completed ? 'success' : 'disabled'} />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {todo.completed ? (
            <Chip label="Ukończone" size="small" color="success" />
          ) : (
            <Chip label="Oczekujące" size="small" color="warning" />
          )}
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(todo.id)}
            aria-label="Usuń zadanie"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
