import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContextMUI';
import { RegistrationForm } from './components/registration/RegistrationForm';
import DashboardLayout from './components/dashboard/DashboardLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TodoProvider>
          <FavoritesProvider>
            <Routes>
              <Route path="/" element={<DashboardLayout />} />
              <Route path="/todos" element={<DashboardLayout />} />
              <Route path="/movies" element={<DashboardLayout />} />
              <Route path="/settings" element={<DashboardLayout />} />
              <Route path="/register" element={<RegistrationForm />} />
            </Routes>
          </FavoritesProvider>
        </TodoProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
