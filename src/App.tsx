import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Gallery from './pages/dashboard/Gallery';
import Upgrade from './pages/dashboard/Upgrade';
import ApiDocs from './pages/dashboard/ApiDocs';
import ApiKeys from './pages/dashboard/ApiKeys';
import Profile from './pages/dashboard/Profile';
import NotFound from './pages/NotFound';

// Components
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PremiumRoute from './components/auth/PremiumRoute';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  // Set title
  useEffect(() => {
    document.title = 'PixelVault - Image Hosting Platform';
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontWeight: 500,
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/gallery" element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            } />
            <Route path="/upgrade" element={
              <ProtectedRoute>
                <Upgrade />
              </ProtectedRoute>
            } />
            <Route path="/api-docs" element={
              <PremiumRoute>
                <ApiDocs />
              </PremiumRoute>
            } />
            <Route path="/api-keys" element={
              <PremiumRoute>
                <ApiKeys />
              </PremiumRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Catch-all */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;