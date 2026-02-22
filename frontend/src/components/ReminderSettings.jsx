import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bell, Phone, Clock, Save, MessageCircle } from 'lucide-react';

export default function ReminderSettings() {
    const [phone, setPhone] = useState('');
    const [morningTime, setMorningTime] = useState('09:00');
    const [nightTime, setNightTime] = useState('20:00');
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [notifPermission, setNotifPermission] = useState('default');

    useEffect(() => {
        fetchSettings();
        if ('Notification' in window) {
            setNotifPermission(Notification.permission);
        }
    }, []);

    // Timer for browser notifications
    useEffect(() => {
        if (!enabled || notifPermission !== 'granted') return;

        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            if (currentTime === morningTime || currentTime === nightTime) {
                const period = currentTime === morningTime ? 'morning' : 'night';
                new Notification('🩺 BP Reading Reminder', {
                    body: `Time to take your ${period} blood pressure reading!`,
                    icon: '/pwa-192x192.png',
                    tag: `bp-reminder-${period}`,
                });
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [enabled, morningTime, nightTime, notifPermission]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/reminder');
            setPhone(res.data.phoneNumber || '');
            setMorningTime(res.data.morningTime || '09:00');
            setNightTime(res.data.nightTime || '20:00');
            setEnabled(res.data.enabled || false);
        } catch (err) {
            // First time — use defaults
        }
    };

    const requestNotifPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotifPermission(permission);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Request notification permission if not granted
        if ('Notification' in window && Notification.permission === 'default') {
            await requestNotifPermission();
        }

        try {
            await api.put('/reminder', {
                phoneNumber: phone,
                morningTime,
                nightTime,
                enabled: true,
            });
            setEnabled(true);
            setSuccess('Reminder settings saved! You will receive notifications.');
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const openWhatsApp = () => {
        const phoneClean = phone.replace(/[^0-9]/g, '');
        if (!phoneClean) {
            setError('Please enter a phone number first');
            return;
        }
        const message = encodeURIComponent(
            `🩺 BP Reading Reminder\nTime to take your blood pressure reading!\n\nLog it here: ${window.location.origin}\n\nOpen BP Dashboard to log your reading.`
        );
        window.open(`https://wa.me/${phoneClean}?text=${message}`, '_blank');
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to disable reminders and clear your settings?')) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.delete('/reminder');
            setPhone('');
            setMorningTime('09:00');
            setNightTime('20:00');
            setEnabled(false);
            setSuccess('Reminder settings cleared and disabled.');
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setError('Failed to clear settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reminder-section glass-card">
            <div className="section-header-flex">
                <h2>
                    <Bell size={20} style={{ color: '#818cf8' }} />
                    Reminder Settings
                </h2>
                {enabled && (
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Disable All
                    </button>
                )}
            </div>
            <p className="reminder-subtitle">
                Get daily reminders to measure your blood pressure
            </p>

            {success && <div className="success-msg" style={{ marginBottom: 16 }}>{success}</div>}
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleSave}>
                <div className="reminder-grid">
                    <div className="input-group">
                        <label><Phone size={14} style={{ marginRight: 6 }} />WhatsApp Number</label>
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="e.g. 919876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <span className="input-hint">Include country code (e.g. 91 for India)</span>
                    </div>

                    <div className="input-group">
                        <label><Clock size={14} style={{ marginRight: 6 }} />Morning Reminder</label>
                        <input
                            type="time"
                            className="input-field"
                            value={morningTime}
                            onChange={(e) => setMorningTime(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label><Clock size={14} style={{ marginRight: 6 }} />Night Reminder</label>
                        <input
                            type="time"
                            className="input-field"
                            value={nightTime}
                            onChange={(e) => setNightTime(e.target.value)}
                        />
                    </div>

                    <div className="reminder-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Saving</>
                            ) : (
                                <><Save size={16} /> Save & Enable</>
                            )}
                        </button>
                        <button type="button" className="btn btn-whatsapp" onClick={openWhatsApp}>
                            <MessageCircle size={16} />
                            Test WhatsApp
                        </button>
                    </div>
                </div>
            </form>

            {enabled && (
                <div className="reminder-status">
                    <span className="reminder-active-dot"></span>
                    Reminders active — {morningTime} (Morning) & {nightTime} (Night)
                    {notifPermission !== 'granted' && (
                        <button className="btn btn-secondary" onClick={requestNotifPermission} style={{ marginLeft: 12, padding: '4px 12px', fontSize: '0.75rem' }}>
                            Enable Notifications
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
