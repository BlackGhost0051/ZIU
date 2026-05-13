import { Box, Button, ButtonGroup } from '@mui/material';

type FilterType = 'all' | 'active' | 'completed';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterButtons({ currentFilter, onFilterChange }: FilterButtonsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
      <ButtonGroup variant='outlined' size='small'>
        <Button
          onClick={() => onFilterChange('all')}
          variant={currentFilter === 'all' ? 'contained' : 'outlined'}
        >
          Wszystkie
        </Button>
        <Button
          onClick={() => onFilterChange('active')}
          variant={currentFilter === 'active' ? 'contained' : 'outlined'}
        >
          Aktywne
        </Button>
        <Button
          onClick={() => onFilterChange('completed')}
          variant={currentFilter === 'completed' ? 'contained' : 'outlined'}
        >
          Ukończone
        </Button>
      </ButtonGroup>
    </Box>
  );
}
