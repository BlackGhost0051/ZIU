import { Box, Button, ButtonGroup } from '@mui/material';

type FilterType = 'all' | 'active' | 'completed';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'active', label: 'Aktywne' },
  { value: 'completed', label: 'Ukończone' },
];

export default function FilterButtons({ currentFilter, onFilterChange }: FilterButtonsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
      <ButtonGroup
        variant="outlined"
        size="small"
        aria-label="Filtruj zadania"
      >
        {filters.map(({ value, label }) => (
          <Button
            key={value}
            onClick={() => onFilterChange(value)}
            variant={currentFilter === value ? 'contained' : 'outlined'}
            aria-pressed={currentFilter === value}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
