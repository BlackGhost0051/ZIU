import { FilterType } from '../types/todo.types';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'Wszystkie', value: 'all' },
    { label: 'Aktywne', value: 'active' },
    { label: 'Ukończone', value: 'completed' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      justifyContent: 'center'
    }}>
      {filters.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          style={{
            padding: '10px 20px',
            backgroundColor: activeFilter === value ? '#2196F3' : '#f0f0f0',
            color: activeFilter === value ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeFilter === value ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
