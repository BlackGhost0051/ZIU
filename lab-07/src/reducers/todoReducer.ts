import { Todo, TodoAction } from '../types/todo.types';

export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [
        {
          id: crypto.randomUUID(),
          title: action.payload,
          completed: false,
          createdAt: new Date()
        },
        ...state
      ];

    case 'TOGGLE':
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case 'DELETE':
      return state.filter((todo) => todo.id !== action.payload);

    case 'EDIT':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, title: action.payload.title }
          : todo
      );

    default:
      return state;
  }
}
