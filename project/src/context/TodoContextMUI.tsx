import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Todo, Priority, TodoStatus } from '../types/todo';

interface TodoState {
  todos: Todo[];
}

export interface AddTodoPayload {
  text: string;
  description: string;
  priority: Priority;
  category: string;
  deadline: string | null;
}

export interface EditTodoPayload {
  id: string;
  text: string;
  description: string;
  priority: Priority;
  category: string;
  deadline: string | null;
  status: TodoStatus;
}

type TodoAction =
  | { type: 'ADD'; payload: AddTodoPayload }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'DELETE'; payload: string }
  | { type: 'EDIT'; payload: EditTodoPayload };

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        todos: [
          ...state.todos,
          {
            id: crypto.randomUUID(),
            text: action.payload.text,
            description: action.payload.description,
            completed: false,
            priority: action.payload.priority,
            category: action.payload.category,
            deadline: action.payload.deadline,
            createdAt: new Date().toISOString(),
            status: 'active',
          },
        ],
      };
    case 'TOGGLE':
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed, status: todo.completed ? 'active' : 'completed' }
            : todo
        ),
      };
    case 'DELETE':
      return {
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case 'EDIT':
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                text: action.payload.text,
                description: action.payload.description,
                priority: action.payload.priority,
                category: action.payload.category,
                deadline: action.payload.deadline,
                status: action.payload.status,
                completed: action.payload.status === 'completed',
              }
            : todo
        ),
      };
    default:
      return state;
  }
}

const SAMPLE_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Przygotować prezentację dla klienta',
    description: 'Należy przygotować kompleksową prezentację dla klienta ABC przedstawiającą postępy projektu.',
    completed: false,
    priority: 'high',
    category: 'Praca',
    deadline: '2026-03-15',
    createdAt: '2026-03-01T10:00:00.000Z',
    status: 'in_progress',
  },
  {
    id: '2',
    text: 'Zaktualizować dokumentację projektu',
    description: 'Uzupełnić dokumentację techniczną o nowe endpointy API.',
    completed: false,
    priority: 'medium',
    category: 'Praca',
    deadline: '2026-03-20',
    createdAt: '2026-03-02T09:00:00.000Z',
    status: 'active',
  },
  {
    id: '3',
    text: 'Zorganizować spotkanie zespołu',
    description: 'Zaplanować retrospektywę i planowanie sprintu.',
    completed: false,
    priority: 'low',
    category: 'Praca',
    deadline: '2026-03-10',
    createdAt: '2026-03-03T08:00:00.000Z',
    status: 'active',
  },
  {
    id: '4',
    text: 'Przejrzeć kod w pull request',
    description: 'Code review PR #42 — refaktoryzacja modułu auth.',
    completed: false,
    priority: 'high',
    category: 'Praca',
    deadline: '2026-03-08',
    createdAt: '2026-03-04T11:00:00.000Z',
    status: 'active',
  },
  {
    id: '5',
    text: 'Napisać testy jednostkowe',
    description: 'Pokryć testami moduł płatności — min. 80% coverage.',
    completed: true,
    priority: 'medium',
    category: 'Praca',
    deadline: '2026-03-25',
    createdAt: '2026-03-05T07:00:00.000Z',
    status: 'completed',
  },
];

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, { todos: SAMPLE_TODOS });

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider');
  }
  return context;
}
