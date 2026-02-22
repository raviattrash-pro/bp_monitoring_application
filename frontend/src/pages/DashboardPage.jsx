import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import BpForm from '../components/BpForm';
import BpChart from '../components/BpChart';
import EditModal from '../components/EditModal';
import ReminderSettings from '../components/ReminderSettings';
import ChangePassword from '../components/ChangePassword';
import { Trash2, Edit3, Activity, TrendingUp, TrendingDown, Heart, FileDown, FileUp, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editReading, setEditReading] = useState(null);
    const [importing, setImporting] = useState(false);

    const fetchReadings = useCallback(async () => {
        try {
            const res = await api.get('/bp');
            setReadings(res.data);
        } catch (err) {
            console.error('Failed to fetch readings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReadings();
    }, [fetchReadings]);

    const handleExport = async () => {
        try {
            const response = await api.get('/bp/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'bp_readings.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to export data');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImporting(true);
        try {
            await api.post('/bp/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Data imported successfully!');
            fetchReadings();
        } catch (err) {
            alert('Failed to import data. Please check CSV format.');
        } finally {
            setImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this reading?')) return;
        try {
            await api.delete(`/bp/${id}`);
            setReadings((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Failed to delete reading:', err);
        }
    };

    // Compute stats
    const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;
    const avgSystolic = readings.length > 0
        ? Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length)
        : 0;
    const avgDiastolic = readings.length > 0
        ? Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length)
        : 0;

    const getBpCategory = (sys, dia) => {
        if (sys < 120 && dia < 80) return { label: 'Normal', className: 'normal' };
        if (sys < 130 && dia < 80) return { label: 'Elevated', className: 'elevated' };
        if (sys < 140 || dia < 90) return { label: 'High (Stage 1)', className: 'high' };
        return { label: 'High (Stage 2)', className: 'high' };
    };

    return (
        <>
            <Navbar />
            <div className="dashboard fade-in">
                <div className="dashboard-header">
                    <h1>
                        <span>Blood Pressure</span> Dashboard
                    </h1>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={handleExport} title="Export data to CSV">
                            <FileDown size={16} /> Export CSV
                        </button>
                        <div className="import-wrapper">
                            <input
                                type="file"
                                id="csv-import"
                                accept=".csv"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="csv-import" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                {importing ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />}
                                {importing ? 'Importing...' : 'Import CSV'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card glass-card">
                        <div className="stat-icon purple">
                            <Activity size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{readings.length}</h3>
                            <p>Total Readings</p>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon pink">
                            <TrendingUp size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{latestReading ? `${latestReading.systolic}/${latestReading.diastolic}` : '--/--'}</h3>
                            <p>Latest Reading</p>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon green">
                            <Heart size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{avgSystolic > 0 ? `${avgSystolic}/${avgDiastolic}` : '--/--'}</h3>
                            <p>Average BP</p>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon orange">
                            <TrendingDown size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{latestReading ? getBpCategory(latestReading.systolic, latestReading.diastolic).label : '--'}</h3>
                            <p>Current Status</p>
                        </div>
                    </div>
                </div>

                {/* BP Entry Form */}
                <BpForm onReadingAdded={fetchReadings} />

                {/* Chart */}
                <BpChart readings={readings} />

                {/* Reminder Settings */}
                <ReminderSettings />

                {/* Readings Table */}
                <div className="readings-section glass-card">
                    <h2>
                        📋 Reading History
                    </h2>

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <span>Loading readings...</span>
                        </div>
                    ) : readings.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💉</div>
                            <h3>No readings yet</h3>
                            <p>Use the form above to add your first blood pressure reading</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="table-wrapper">
                                <table className="readings-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Systolic</th>
                                            <th>Diastolic</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {readings.slice().reverse().map((r) => {
                                            const cat = getBpCategory(r.systolic, r.diastolic);
                                            return (
                                                <tr key={r.id}>
                                                    <td>{r.readingDate}</td>
                                                    <td>
                                                        <span className={`badge ${r.timeOfDay.toLowerCase()}`}>
                                                            {r.timeOfDay === 'MORNING' ? '🌅 Morning' : '🌙 Night'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`bp-value ${cat.className}`}>{r.systolic}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`bp-value ${cat.className}`}>{r.diastolic}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`bp-value ${cat.className}`}>{cat.label}</span>
                                                    </td>
                                                    <td>
                                                        <div className="action-btns">
                                                            <button className="edit-btn" onClick={() => setEditReading(r)} title="Edit reading">
                                                                <Edit3 size={15} />
                                                            </button>
                                                            <button className="delete-btn" onClick={() => handleDelete(r.id)} title="Delete reading">
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="readings-cards">
                                {readings.slice().reverse().map((r) => {
                                    const cat = getBpCategory(r.systolic, r.diastolic);
                                    return (
                                        <div key={r.id} className="reading-card">
                                            <div className="reading-card-header">
                                                <span className="reading-card-date">{r.readingDate}</span>
                                                <span className={`badge ${r.timeOfDay.toLowerCase()}`}>
                                                    {r.timeOfDay === 'MORNING' ? '🌅 Morning' : '🌙 Night'}
                                                </span>
                                            </div>
                                            <div className="reading-card-body">
                                                <div className="reading-card-bp">
                                                    <span className={`bp-value ${cat.className}`}>{r.systolic}/{r.diastolic}</span>
                                                    <span className="reading-card-unit">mmHg</span>
                                                </div>
                                                <span className={`reading-card-status ${cat.className}`}>{cat.label}</span>
                                            </div>
                                            <div className="reading-card-actions">
                                                <button className="edit-btn" onClick={() => setEditReading(r)}>
                                                    <Edit3 size={14} /> Edit
                                                </button>
                                                <button className="delete-btn" onClick={() => handleDelete(r.id)}>
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Change Password */}
                <ChangePassword />
            </div>

            {/* Edit Modal */}
            {editReading && (
                <EditModal
                    reading={editReading}
                    onClose={() => setEditReading(null)}
                    onSaved={fetchReadings}
                />
            )}
        </>
    );
}
