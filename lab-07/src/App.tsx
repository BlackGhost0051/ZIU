import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './context/TodoContextMUI';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { RegistrationForm } from './components/registration/RegistrationForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <TodoProvider>
              <DashboardLayout />
            </TodoProvider>
          }
        />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
