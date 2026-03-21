import { useReducer, useState } from 'react';
import { FilterType } from './types/todo.types';
import { todoReducer } from './reducers/todoReducer';
import { AddTodoForm } from './components/AddTodoForm';
import { FilterBar } from './components/FilterBar';
import { TodoList } from './components/TodoList';

function App() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAdd = (title: string) => {
    dispatch({ type: 'ADD', payload: title });
  };

  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE', payload: id });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }}>
      <header style={{
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '200',
          color: '#333',
          margin: '0 0 8px 0'
        }}>
          To-Do App
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: 0
        }}>
          {activeCount} aktywnych / {todos.length} wszystkich zadań
        </p>
      </header>

      <AddTodoForm onAdd={handleAdd} />

      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <TodoList
        todos={filteredTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
