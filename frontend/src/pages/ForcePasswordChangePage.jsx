import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, Check, AlertCircle, ShieldCheck, MoonStar } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function ForcePasswordChangePage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword,
                newPassword
            });

            // Re-fetch or update user session to clear the flag
            // Since our login logic in AuthContext handles initial load/login
            // we should update the stored user data
            const updatedUser = { ...user, mustChangePassword: false };
            const token = localStorage.getItem('bp_token');
            login(token, updatedUser);

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update password');
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
                        <ShieldCheck size={14} />
                        Security first
                    </div>
                    <h2>Let’s secure your account before you continue.</h2>
                    <p>
                        Your password was reset recently. Choose a new one here, then continue to your dashboard with the same polished day and night experience.
                    </p>
                    <div className="auth-feature-list">
                        <div className="auth-feature-item">
                            <ShieldCheck size={16} />
                            Keep your account protected with a fresh password
                        </div>
                        <div className="auth-feature-item">
                            <MoonStar size={16} />
                            Comfortable viewing whether you prefer day or night mode
                        </div>
                    </div>
                </div>

                <div className="auth-card glass-card">
                    <div className="auth-header">
                        <div className="auth-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            <ShieldAlert size={28} color="white" />
                        </div>
                        <h1>Security Update</h1>
                        <p>Your password was recently reset. Please set a new password of your choice to continue.</p>
                    </div>

                    {error && (
                        <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Current (Admin Set) Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    className="input-field"
                                    style={{ paddingLeft: '42px' }}
                                    placeholder="Enter temporary password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>New Secure Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    className="input-field"
                                    style={{ paddingLeft: '42px' }}
                                    placeholder="At least 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    className="input-field"
                                    style={{ paddingLeft: '42px' }}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? (
                                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Updating...</>
                            ) : (
                                <><Check size={18} /> Update Password</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
