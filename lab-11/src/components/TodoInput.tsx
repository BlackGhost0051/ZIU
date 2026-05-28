import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <Box
      component="form"
      aria-label="Dodaj nowe zadanie"
      onSubmit={e => { e.preventDefault(); handleSubmit(); }}
      sx={{ mb: 3 }}
    >
      <label htmlFor="todo-input" className="visually-hidden">
        Treść zadania
      </label>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          id="todo-input"
          fullWidth
          placeholder="Wpisz treść zadania..."
          value={text}
          onChange={e => setText(e.target.value)}
          inputProps={{
            'aria-describedby': 'todo-input-hint',
          }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon aria-hidden="true" />}
          disabled={!text.trim()}
          aria-label="Dodaj zadanie"
          sx={{ minWidth: 44, minHeight: 44 }}
        >
          Dodaj
        </Button>
      </Box>
      <span id="todo-input-hint" className="visually-hidden">
        Wpisz treść zadania i naciśnij Enter lub przycisk Dodaj
      </span>
    </Box>
  );
}
