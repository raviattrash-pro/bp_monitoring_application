import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Shield, Calculator } from 'lucide-react';
import InstallButton from './InstallButton';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isOnAdmin = location.pathname === '/admin';
    const isOnCalc = location.pathname === '/calculator';

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <div className="brand-icon">🩺</div>
                <span>BP Dashboard</span>
            </div>
            <div className="navbar-actions">
                <div className="navbar-user">
                    <span className="navbar-greeting">
                        Hello, <strong>{user?.name}</strong>
                    </span>
                    <button
                        className={`btn ${isOnCalc ? 'btn-secondary' : 'btn-calc'}`}
                        onClick={() => navigate(isOnCalc ? '/dashboard' : '/calculator')}
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                        <Calculator size={14} />
                        {isOnCalc ? 'Dashboard' : 'BP Calculator'}
                    </button>
                    {isAdmin() && (
                        <button
                            className={`btn ${isOnAdmin ? 'btn-secondary' : 'btn-admin'}`}
                            onClick={() => navigate(isOnAdmin ? '/dashboard' : '/admin')}
                            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                        >
                            <Shield size={14} />
                            {isOnAdmin ? 'User Dashboard' : 'Admin Panel'}
                        </button>
                    )}
                    <InstallButton />
                    <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
