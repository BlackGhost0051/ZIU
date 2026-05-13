import { TodoProvider } from './context/TodoContextMUI';
import DashboardLayout from './components/dashboard/DashboardLayout';

function App() {
  return (
    <TodoProvider>
      <DashboardLayout />
    </TodoProvider>
  );
}

export default App;
