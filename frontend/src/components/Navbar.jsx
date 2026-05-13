import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Shield, Calculator, LayoutDashboard } from 'lucide-react';
import { createPortal } from 'react-dom';
import InstallButton from './InstallButton';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onOpenFeatureDashboard }) {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isOnAdmin = location.pathname === '/admin';
    const isOnCalc = location.pathname === '/calculator';
    const mobileDock = (
        <div className="mobile-app-dock">
            <button
                type="button"
                className={`mobile-dock-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
                aria-label="Dashboard"
            >
                <LayoutDashboard size={18} />
                <span>Home</span>
            </button>
            {onOpenFeatureDashboard ? (
                <button
                    type="button"
                    className="mobile-dock-btn"
                    onClick={onOpenFeatureDashboard}
                    aria-label="Open feature dashboard"
                >
                    <LayoutDashboard size={18} />
                    <span>Features</span>
                </button>
            ) : null}
            <button
                type="button"
                className={`mobile-dock-btn ${isOnCalc ? 'active' : ''}`}
                onClick={() => navigate(isOnCalc ? '/dashboard' : '/calculator')}
                aria-label={isOnCalc ? 'Dashboard' : 'BP Calculator'}
            >
                <Calculator size={18} />
                <span>{isOnCalc ? 'Home' : 'BP Calc'}</span>
            </button>
            {isAdmin() && (
                <button
                    type="button"
                    className={`mobile-dock-btn ${isOnAdmin ? 'active' : ''}`}
                    onClick={() => navigate(isOnAdmin ? '/dashboard' : '/admin')}
                    aria-label={isOnAdmin ? 'User dashboard' : 'Admin panel'}
                >
                    <Shield size={18} />
                    <span>Admin</span>
                </button>
            )}
            <div className="mobile-dock-theme">
                <ThemeToggle iconOnly />
                <span>Theme</span>
            </div>
        </div>
    );

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <div className="brand-icon">BP</div>
                    <span>BP Dashboard</span>
                </div>
                <button
                    type="button"
                    className="mobile-logout-btn"
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
                <div className="navbar-actions">
                    <div className="navbar-user">
                        <ThemeToggle compact />
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
            {typeof document !== 'undefined' ? createPortal(mobileDock, document.body) : null}
        </>
    );
}
