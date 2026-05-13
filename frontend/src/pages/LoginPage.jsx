import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { LogIn, Mail, Lock, HeartPulse, ShieldCheck, MoonStar } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                mustChangePassword: res.data.mustChangePassword
            });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell auth-shell-login fade-in">
            <div className="auth-theme-bar">
                <ThemeToggle />
            </div>

            <div className="auth-container">
                <div className="auth-side-panel glass-card">
                    <div className="hero-badge">
                        <HeartPulse size={14} />
                        Smarter daily tracking
                    </div>
                    <h2>Health tracking that feels calm, clear, and easy to use.</h2>
                    <p>
                        Review your readings, monitor trends, and keep every important health detail in one place with a cleaner day and night experience.
                    </p>
                    <div className="auth-feature-list">
                        <div className="auth-feature-item">
                            <ShieldCheck size={16} />
                            Secure sign-in with a focused dashboard experience
                        </div>
                        <div className="auth-feature-item">
                            <MoonStar size={16} />
                            Built-in light and night mode for comfortable viewing
                        </div>
                    </div>
                </div>

                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <div className="auth-icon">
                            <LogIn size={28} color="white" />
                        </div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to manage your blood pressure and health records</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    style={{ paddingLeft: '42px' }}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    id="password"
                                    type="password"
                                    className="input-field"
                                    style={{ paddingLeft: '42px' }}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? (
                                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Signing in...</>
                            ) : (
                                <><LogIn size={18} /> Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
