import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

function getStoredUser() {
    try {
        const token = localStorage.getItem('bp_token');
        const userData = localStorage.getItem('bp_user');
        if (!token || !userData) return null;
        return JSON.parse(userData);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(getStoredUser());
        setLoading(false);

        const handleStorage = () => {
            setUser(getStoredUser());
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('bp_token', token);
        localStorage.setItem('bp_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('bp_token');
        localStorage.removeItem('bp_user');
        setUser(null);
    };

    const isAdmin = () => user?.role === 'ROLE_ADMIN';

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
