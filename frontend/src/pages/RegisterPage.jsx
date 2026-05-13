import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { UserPlus, Mail, Lock, User, HeartPulse, Sparkles, MoonStar } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password });
            login(res.data.token, {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                mustChangePassword: res.data.mustChangePassword
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell fade-in">
            <div className="auth-theme-bar">
                <ThemeToggle />
            </div>

            <div className="auth-container">
                <div className="auth-side-panel glass-card">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        Classy and simple
                    </div>
                    <h2>Set up your health dashboard in a minute.</h2>
                    <p>
                        Create your account and start recording blood pressure, reminders, family care details, and medical documents in a more thoughtful interface.
                    </p>
                    <div className="auth-feature-list">
                        <div className="auth-feature-item">
                            <HeartPulse size={16} />
                            Track readings, trends, and essential health metrics
                        </div>
                        <div className="auth-feature-item">
                            <MoonStar size={16} />
                            Switch between bright daytime and comfortable night mode
                        </div>
                    </div>
                </div>

                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <div className="auth-icon">
                            <UserPlus size={28} color="white" />
                        </div>
                        <h1>Create Account</h1>
                        <p>Start tracking your blood pressure and health journey today</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    id="name"
                                    type="text"
                                    className="input-field"
                                    style={{ paddingLeft: '42px' }}
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? (
                                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Creating account...</>
                            ) : (
                                <><UserPlus size={18} /> Create Account</>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
