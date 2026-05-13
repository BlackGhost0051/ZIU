
import { Box } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import StatsCard from './StatsCard';
import { useTodoContext } from '../../context/TodoContextMUI';

export default function StatsGrid() {
  const { state } = useTodoContext();

  const total = state.todos.length;
  const completed = state.todos.filter(todo => todo.completed).length;
  const pending = state.todos.filter(todo => !todo.completed).length;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      <StatsCard
        title='Wszystkie zadania'
        value={total}
        icon={FormatListBulletedIcon}
        color='#1565C0'
        bgColor='#E3F2FD'
      />
      <StatsCard
        title='Ukończone'
        value={completed}
        icon={CheckCircleIcon}
        color='#2E7D32'
        bgColor='#E8F5E9'
      />
      <StatsCard
        title='Oczekujące'
        value={pending}
        icon={RadioButtonUncheckedIcon}
        color='#E65100'
        bgColor='#FFF3E0'
      />
    </Box>
  );
}
