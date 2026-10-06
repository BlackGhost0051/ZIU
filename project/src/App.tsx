import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContextMUI';
import { ToastProvider } from './context/ToastContext';
import { RegistrationForm } from './components/registration/RegistrationForm';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { pageVariants } from './animations';
import './App.css';

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageWrapper><DashboardLayout /></PageWrapper>} />
        <Route path="/todos"     element={<PageWrapper><DashboardLayout /></PageWrapper>} />
        <Route path="/movies"    element={<PageWrapper><DashboardLayout /></PageWrapper>} />
        <Route path="/analytics" element={<PageWrapper><DashboardLayout /></PageWrapper>} />
        <Route path="/settings"  element={<PageWrapper><DashboardLayout /></PageWrapper>} />
        <Route path="/register"  element={<PageWrapper><RegistrationForm /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TodoProvider>
          <FavoritesProvider>
            <ToastProvider>
              <AnimatedRoutes />
            </ToastProvider>
          </FavoritesProvider>
        </TodoProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
