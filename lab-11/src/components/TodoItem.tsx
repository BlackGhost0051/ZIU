import { Todo } from '../types/todo.types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ cursor: 'pointer' }}
      />
      <span
        style={{
          flex: 1,
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? '#999' : '#333'
        }}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          padding: '6px 12px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Usuń
      </button>
    </div>
  );
}
