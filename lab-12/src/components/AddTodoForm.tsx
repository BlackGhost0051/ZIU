import { useState } from 'react';

interface AddTodoFormProps {
  onAdd: (title: string) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: '24px',
      display: 'flex',
      gap: '8px'
    }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Dodaj nowe zadanie..."
        style={{
          flex: 1,
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Dodaj
      </button>
    </form>
  );
}
