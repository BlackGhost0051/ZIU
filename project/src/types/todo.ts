export type Priority = 'high' | 'medium' | 'low';
export type TodoStatus = 'active' | 'completed' | 'in_progress';

export interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  deadline: string | null;
  createdAt: string;
  status: TodoStatus;
}
