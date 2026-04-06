import { useMemo } from 'react';
import { Todo } from '../types/todo';

type FilterType = 'all' | 'active' | 'completed';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter?: FilterType;
}

export default function TodoListTailwind({ todos, onToggle, onDelete, filter = 'all' }: TodoListProps) {
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
      <p className='text-center text-gray-400 mt-8'>Brak zadań. Dodaj pierwsze!</p>
    );
  }

  return (
    <ul className='divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden'>
      {filteredTodos.map(todo => (
        <li
          key={todo.id}
          className={`flex items-center gap-3 px-4 py-3 ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}
        >
          <input
            type='checkbox'
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className='w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-2 focus:ring-brand-500 cursor-pointer'
          />
          <span
            className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
          >
            {todo.text}
          </span>
          {todo.completed && (
            <span className='px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full'>
              Ukończone
            </span>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className='px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors'
            aria-label='Usuń zadanie'
          >
            Usuń
          </button>
        </li>
      ))}
    </ul>
  );
}
