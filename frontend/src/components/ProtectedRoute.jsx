import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <span>Loading...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Force password change redirection
    if (user.mustChangePassword && location.pathname !== '/force-password-change') {
        return <Navigate to="/force-password-change" replace />;
    }

    // Prevents accessing force-password-change if not required
    if (!user.mustChangePassword && location.pathname === '/force-password-change') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
