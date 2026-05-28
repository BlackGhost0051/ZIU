import { Todo } from '../types/todo.types';
import { TodoItem } from './TodoItem';
import { motion, AnimatePresence } from 'framer-motion';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px',
        color: '#999',
        fontSize: '16px'
      }}>
        Brak zadań do wyświetlenia
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 48 }}
            transition={{ duration: 0.22 }}
          >
            <TodoItem
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
