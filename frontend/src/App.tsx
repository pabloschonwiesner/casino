import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamesPage from './pages/GamesPage';
import SlotMachinePage from './pages/SlotMachinePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  useEffect(() => {
    const handleRateLimited = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;

      toast.error(
        customEvent.detail?.message ?? 'Too many requests. Please try again later.'
      );
    };

    window.addEventListener('api:rate-limited', handleRateLimited);

    return () => {
      window.removeEventListener('api:rate-limited', handleRateLimited);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/games" element={<GamesPage />} />
          <Route path="/slot-machine/:gameSlug" element={<SlotMachinePage />} />
        </Route>
        <Route path="/" element={<Navigate to="/games" replace />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;