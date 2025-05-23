import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PremiumRouteProps {
  children: ReactNode;
}

const PremiumRoute = ({ children }: PremiumRouteProps) => {
  const { isAuthenticated, isLoading, isPremium } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isPremium) {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
};

export default PremiumRoute;