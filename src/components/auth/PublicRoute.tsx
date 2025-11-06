import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.125rem',
        color: 'var(--muted)'
      }}>
        Loading...
      </div>
    );
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // If not authenticated, allow access to public routes
  return <Outlet />;
};

export default PublicRoute;
