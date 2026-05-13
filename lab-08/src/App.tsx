import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './context/TodoContextMUI';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { RegistrationForm } from './components/registration/RegistrationForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Przejdź do treści głównej
      </a>
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
