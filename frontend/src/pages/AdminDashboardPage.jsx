import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Users, Activity, TrendingUp, AlertTriangle, Calendar, UserPlus,
    ChevronDown, ChevronUp, Search, Heart, Shield, Mail, Clock, Key, Check
} from 'lucide-react';

export default function AdminDashboardPage() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userReadings, setUserReadings] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingReadings, setLoadingReadings] = useState(null);
    const [resetPasswords, setResetPasswords] = useState({});
    const [resetStatus, setResetStatus] = useState({});

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserDetail = async (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }
        setExpandedUser(userId);

        if (!userReadings[userId]) {
            setLoadingReadings(userId);
            try {
                const res = await api.get(`/admin/users/${userId}`);
                setUserReadings((prev) => ({ ...prev, [userId]: res.data.readings || [] }));
            } catch (err) {
                console.error('Failed to fetch user readings:', err);
            } finally {
                setLoadingReadings(null);
            }
        }
    };

    const handleResetPassword = async (userId) => {
        const newPassword = resetPasswords[userId];
        if (!newPassword || newPassword.length < 6) {
            setResetStatus((prev) => ({ ...prev, [userId]: { error: 'Minimum 6 characters' } }));
            return;
        }

        try {
            const res = await api.put(`/admin/users/${userId}/reset-password`, { newPassword });
            setResetStatus((prev) => ({ ...prev, [userId]: { success: res.data.message } }));
            setResetPasswords((prev) => ({ ...prev, [userId]: '' }));
        } catch (err) {
            setResetStatus((prev) => ({
                ...prev,
                [userId]: { error: err.response?.data?.error || 'Failed to reset password' },
            }));
        }
    };

    const getBpCategory = (sys, dia) => {
        if (!sys || !dia) return { label: '--', className: '' };
        if (sys < 120 && dia < 80) return { label: 'Normal', className: 'normal' };
        if (sys < 130 && dia < 80) return { label: 'Elevated', className: 'elevated' };
        if (sys < 140 || dia < 90) return { label: 'High (Stage 1)', className: 'high' };
        return { label: 'High (Stage 2)', className: 'high' };
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard fade-in">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Loading admin dashboard...</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard fade-in">
                <div className="dashboard-header">
                    <h1>
                        <Shield size={28} style={{ color: '#818cf8', marginRight: '10px' }} />
                        <span>Admin</span> Dashboard
                    </h1>
                </div>

                {/* Stats Cards */}
                <div className="admin-stats-grid">
                    <div className="admin-stat-card glass-card">
                        <div className="stat-icon purple">
                            <Users size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalUsers || 0}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>

                    <div className="admin-stat-card glass-card">
                        <div className="stat-icon pink">
                            <Activity size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalReadings || 0}</h3>
                            <p>Total Readings</p>
                        </div>
                    </div>

                    <div className="admin-stat-card glass-card">
                        <div className="stat-icon green">
                            <Heart size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.avgSystolic || 0}/{stats?.avgDiastolic || 0}</h3>
                            <p>Platform Avg BP</p>
                        </div>
                    </div>

                    <div className="admin-stat-card glass-card">
                        <div className="stat-icon orange">
                            <AlertTriangle size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.usersWithHighBp || 0}</h3>
                            <p>High BP Users</p>
                        </div>
                    </div>

                    <div className="admin-stat-card glass-card">
                        <div className="stat-icon blue">
                            <Calendar size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.readingsToday || 0}</h3>
                            <p>Readings Today</p>
                        </div>
                    </div>

                    <div className="admin-stat-card glass-card">
                        <div className="stat-icon teal">
                            <UserPlus size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.newUsersThisWeek || 0}</h3>
                            <p>New This Week</p>
                        </div>
                    </div>
                </div>

                {/* Users Section */}
                <div className="admin-users-section glass-card">
                    <div className="admin-users-header">
                        <h2>
                            <Users size={20} style={{ color: '#818cf8' }} />
                            All Users ({filteredUsers.length})
                        </h2>
                        <div className="admin-search-box">
                            <Search size={16} />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👤</div>
                            <h3>No users found</h3>
                            <p>Try adjusting your search</p>
                        </div>
                    ) : (
                        <div className="admin-users-list">
                            {filteredUsers.map((user) => {
                                const cat = getBpCategory(user.lastSystolic, user.lastDiastolic);
                                const isExpanded = expandedUser === user.id;
                                const readings = userReadings[user.id] || [];
                                const isLoadingThis = loadingReadings === user.id;
                                const status = resetStatus[user.id];

                                return (
                                    <div key={user.id} className={`admin-user-card ${isExpanded ? 'expanded' : ''}`}>
                                        <div className="admin-user-row" onClick={() => toggleUserDetail(user.id)}>
                                            <div className="admin-user-avatar">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="admin-user-info">
                                                <div className="admin-user-name">
                                                    {user.name}
                                                    {user.role === 'ROLE_ADMIN' && (
                                                        <span className="admin-badge">Admin</span>
                                                    )}
                                                </div>
                                                <div className="admin-user-email">
                                                    <Mail size={12} /> {user.email}
                                                </div>
                                            </div>
                                            <div className="admin-user-stats">
                                                <div className="admin-user-stat">
                                                    <span className="admin-stat-label">Readings</span>
                                                    <span className="admin-stat-value">{user.readingCount}</span>
                                                </div>
                                                <div className="admin-user-stat">
                                                    <span className="admin-stat-label">Last BP</span>
                                                    <span className={`admin-stat-value bp-value ${cat.className}`}>
                                                        {user.lastSystolic ? `${user.lastSystolic}/${user.lastDiastolic}` : '--'}
                                                    </span>
                                                </div>
                                                <div className="admin-user-stat">
                                                    <span className="admin-stat-label">Status</span>
                                                    <span className={`admin-stat-value bp-value ${cat.className}`}>
                                                        {cat.label}
                                                    </span>
                                                </div>
                                                <div className="admin-user-stat">
                                                    <span className="admin-stat-label">Joined</span>
                                                    <span className="admin-stat-value">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="admin-user-expand">
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="admin-user-detail">
                                                {/* Password Reset */}
                                                <div className="admin-reset-password">
                                                    <h4>
                                                        <Key size={14} style={{ marginRight: 6 }} />
                                                        Reset Password
                                                    </h4>
                                                    {status?.error && <div className="auth-error" style={{ marginBottom: 8 }}>{status.error}</div>}
                                                    {status?.success && <div className="success-msg" style={{ marginBottom: 8 }}>{status.success}</div>}
                                                    <div className="admin-reset-row">
                                                        <input
                                                            type="text"
                                                            className="input-field"
                                                            placeholder="Enter new password (min 6 chars)"
                                                            value={resetPasswords[user.id] || ''}
                                                            onChange={(e) =>
                                                                setResetPasswords((prev) => ({ ...prev, [user.id]: e.target.value }))
                                                            }
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleResetPassword(user.id);
                                                            }}
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            <Key size={14} /> Reset
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Reading History */}
                                                <h4>
                                                    <Clock size={14} style={{ marginRight: 6 }} />
                                                    Reading History
                                                </h4>
                                                {isLoadingThis ? (
                                                    <div className="loading-spinner" style={{ padding: '16px' }}>
                                                        <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                                                        <span>Loading readings...</span>
                                                    </div>
                                                ) : readings.length === 0 ? (
                                                    <p className="admin-no-readings">No readings recorded yet</p>
                                                ) : (
                                                    <div className="admin-readings-table-wrap">
                                                        <table className="readings-table admin-readings-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <th>Time</th>
                                                                    <th>Systolic</th>
                                                                    <th>Diastolic</th>
                                                                    <th>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {readings.map((r) => {
                                                                    const rc = getBpCategory(r.systolic, r.diastolic);
                                                                    return (
                                                                        <tr key={r.id}>
                                                                            <td>{r.readingDate}</td>
                                                                            <td>
                                                                                <span className={`badge ${r.timeOfDay.toLowerCase()}`}>
                                                                                    {r.timeOfDay === 'MORNING' ? '🌅 Morning' : '🌙 Night'}
                                                                                </span>
                                                                            </td>
                                                                            <td><span className={`bp-value ${rc.className}`}>{r.systolic}</span></td>
                                                                            <td><span className={`bp-value ${rc.className}`}>{r.diastolic}</span></td>
                                                                            <td><span className={`bp-value ${rc.className}`}>{rc.label}</span></td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
