import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import BpForm from '../components/BpForm';
import BpChart from '../components/BpChart';
import EditModal from '../components/EditModal';
import ReminderSettings from '../components/ReminderSettings';
import ChangePassword from '../components/ChangePassword';
import HealthDocumentsSection from '../components/HealthDocumentsSection';
import CareHubSection from '../components/CareHubSection';
import FeatureDashboard from '../components/FeatureDashboard';
import { useAuth } from '../context/AuthContext';
import {
    Activity,
    Bell,
    Droplets,
    FileDown,
    Files,
    FileUp,
    Heart,
    HeartPulse,
    KeyRound,
    Loader2,
    PanelsTopLeft,
    PlusSquare,
    ShieldPlus,
    TableProperties,
    Thermometer,
    Trash2,
    Edit3,
    TrendingUp,
    Waves,
    Weight,
} from 'lucide-react';
import { formatMetricValue, getBpCategory, getMetricAverage, getTimeOfDayLabel } from '../utils/health';

const DEFAULT_FEATURES = ['checkin', 'trends', 'reminders', 'history'];
const ESSENTIAL_FEATURES = ['checkin', 'trends', 'history', 'reminders'];
const ALL_FEATURES = ['checkin', 'trends', 'careHub', 'documents', 'reminders', 'history', 'security'];

export default function DashboardPage() {
    const { user } = useAuth();
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editReading, setEditReading] = useState(null);
    const [importing, setImporting] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState(DEFAULT_FEATURES);
    const [isFeaturePanelOpen, setIsFeaturePanelOpen] = useState(false);

    const storageKey = useMemo(
        () => `bp_dashboard_features_${user?.email || 'default'}`,
        [user?.email]
    );

    const featureCards = useMemo(() => ([
        {
            key: 'checkin',
            label: 'Daily Check-in',
            description: 'Add blood pressure and health readings quickly.',
            icon: PlusSquare,
            tone: 'pink',
        },
        {
            key: 'trends',
            label: 'Health Trends',
            description: 'See blood pressure and wellness patterns over time.',
            icon: TrendingUp,
            tone: 'purple',
        },
        {
            key: 'careHub',
            label: 'Care Hub',
            description: 'Medications, family care, appointments, lab reports, and emergency info.',
            icon: PanelsTopLeft,
            tone: 'green',
        },
        {
            key: 'documents',
            label: 'Document Vault',
            description: 'Keep prescriptions, scans, reports, and bills together.',
            icon: Files,
            tone: 'blue',
        },
        {
            key: 'reminders',
            label: 'Reminders',
            description: 'Set daily prompts for morning and night readings.',
            icon: Bell,
            tone: 'orange',
        },
        {
            key: 'history',
            label: 'Reading History',
            description: 'Review past check-ins with edit and delete controls.',
            icon: TableProperties,
            tone: 'teal',
        },
        {
            key: 'security',
            label: 'Password & Security',
            description: 'Keep account access updated when you need it.',
            icon: KeyRound,
            tone: 'purple',
        },
    ]), []);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(storageKey);
            if (!stored) {
                setSelectedFeatures(DEFAULT_FEATURES);
                return;
            }

            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setSelectedFeatures(parsed.filter((item) => ALL_FEATURES.includes(item)));
            } else {
                setSelectedFeatures(DEFAULT_FEATURES);
            }
        } catch {
            setSelectedFeatures(DEFAULT_FEATURES);
        }
    }, [storageKey]);

    useEffect(() => {
        window.localStorage.setItem(storageKey, JSON.stringify(selectedFeatures));
    }, [selectedFeatures, storageKey]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsFeaturePanelOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            link.setAttribute('download', 'health_readings.csv');
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
            alert('Data imported successfully');
            fetchReadings();
        } catch (err) {
            alert('Failed to import data. Please check CSV format.');
        } finally {
            setImporting(false);
            e.target.value = '';
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

    const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;
    const avgSystolic = readings.length > 0
        ? Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length)
        : 0;
    const avgDiastolic = readings.length > 0
        ? Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length)
        : 0;

    const avgHeartRate = getMetricAverage(readings, 'heartRate');
    const avgBloodSugar = getMetricAverage(readings, 'bloodSugar');
    const avgOxygen = getMetricAverage(readings, 'oxygenSaturation');
    const avgTemperature = getMetricAverage(readings, 'bodyTemperature');
    const avgWeight = getMetricAverage(readings, 'weightKg');
    const latestCategory = latestReading ? getBpCategory(latestReading.systolic, latestReading.diastolic) : { label: '--', className: '' };

    const toggleFeature = (featureKey) => {
        setSelectedFeatures((current) => {
            if (current.includes(featureKey)) {
                if (current.length === 1) {
                    return current;
                }
                return current.filter((item) => item !== featureKey);
            }

            return [...current, featureKey];
        });
    };

    const applyPreset = (preset) => {
        if (preset === 'minimal') {
            setSelectedFeatures(['checkin', 'history']);
            return;
        }

        if (preset === 'essentials') {
            setSelectedFeatures(ESSENTIAL_FEATURES);
            return;
        }

        setSelectedFeatures(ALL_FEATURES);
    };

    const activeFeatureCards = featureCards.filter((feature) => selectedFeatures.includes(feature.key));

    const summaryCards = [
        {
            label: 'Latest BP',
            value: latestReading ? `${latestReading.systolic}/${latestReading.diastolic}` : '--/--',
            meta: latestCategory.label,
            icon: Heart,
            tone: 'pink',
        },
        {
            label: 'Heart Rate',
            value: formatMetricValue(latestReading?.heartRate, ' bpm'),
            meta: avgHeartRate ? `Avg ${avgHeartRate} bpm` : 'Add pulse readings',
            icon: HeartPulse,
            tone: 'purple',
        },
        {
            label: 'Blood Sugar',
            value: formatMetricValue(latestReading?.bloodSugar, ' mg/dL'),
            meta: avgBloodSugar ? `Avg ${avgBloodSugar} mg/dL` : 'Add sugar readings',
            icon: Droplets,
            tone: 'orange',
        },
        {
            label: 'Oxygen',
            value: formatMetricValue(latestReading?.oxygenSaturation, '%'),
            meta: avgOxygen ? `Avg ${avgOxygen}%` : 'Track SpO2',
            icon: Waves,
            tone: 'green',
        },
        {
            label: 'Temperature',
            value: formatMetricValue(latestReading?.bodyTemperature, ' F'),
            meta: avgTemperature ? `Avg ${avgTemperature} F` : 'Track fever trends',
            icon: Thermometer,
            tone: 'blue',
        },
        {
            label: 'Weight',
            value: formatMetricValue(latestReading?.weightKg, ' kg'),
            meta: avgWeight ? `Avg ${avgWeight} kg` : 'Track body weight',
            icon: Weight,
            tone: 'teal',
        },
    ];

    return (
        <>
            <Navbar onOpenFeatureDashboard={() => setIsFeaturePanelOpen(true)} />
            <div className="dashboard dashboard-health fade-in">
                <div className="dashboard-hero glass-card">
                    <div>
                        <div className="hero-badge">
                            <ShieldPlus size={14} />
                            Personal health command center
                        </div>
                        <h1>
                            <span>Health</span> Monitoring Dashboard
                        </h1>
                        <p>
                            Monitor blood pressure, heart rate, sugar level, oxygen, temperature, weight, track medications, family care, appointments, lab reports, and keep every medical document arranged for quick doctor visits.
                        </p>
                    </div>
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

                <div className="feature-dashboard-peek glass-card">
                    <div>
                        <h2>Feature Dashboard</h2>
                        <p className="section-subtitle">Customize which dashboard sections stay visible.</p>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsFeaturePanelOpen(true)}>
                        Manage Features
                    </button>
                </div>

                <div className="feature-dashboard-desktop">
                    <FeatureDashboard
                        features={featureCards}
                        selectedFeatures={selectedFeatures}
                        onToggleFeature={toggleFeature}
                        onApplyPreset={applyPreset}
                    />
                </div>

                <div className="active-features-strip glass-card">
                    <div>
                        <h2>Current Dashboard View</h2>
                        <p className="section-subtitle">Only your selected modules appear below, so the page stays focused.</p>
                    </div>
                    <div className="active-feature-chips">
                        {activeFeatureCards.map((feature) => (
                            <span key={feature.key} className="active-feature-chip">
                                <feature.icon size={14} />
                                {feature.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="stats-grid stats-grid-health">
                    <div className="stat-card glass-card stat-card-featured">
                        <div className="stat-icon pink">
                            <Activity size={22} />
                        </div>
                        <div className="stat-info">
                            <h3>{readings.length}</h3>
                            <p>Total Check-ins</p>
                            <span className="stat-meta">{avgSystolic > 0 ? `Average BP ${avgSystolic}/${avgDiastolic}` : 'Start by adding your first reading'}</span>
                        </div>
                    </div>
                    {summaryCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="stat-card glass-card">
                                <div className={`stat-icon ${card.tone}`}>
                                    <Icon size={22} />
                                </div>
                                <div className="stat-info">
                                    <h3>{card.value}</h3>
                                    <p>{card.label}</p>
                                    <span className="stat-meta">{card.meta}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedFeatures.includes('checkin') && <BpForm onReadingAdded={fetchReadings} />}
                {selectedFeatures.includes('trends') && <BpChart readings={readings} />}
                {selectedFeatures.includes('careHub') && <CareHubSection />}
                {selectedFeatures.includes('documents') && <HealthDocumentsSection />}
                {selectedFeatures.includes('reminders') && <ReminderSettings />}

                {selectedFeatures.includes('history') && (
                    <div className="readings-section glass-card">
                        <h2>Reading History</h2>

                        {loading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <span>Loading readings...</span>
                            </div>
                        ) : readings.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">+</div>
                                <h3>No readings yet</h3>
                                <p>Use the form above to add your first health reading.</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-wrapper">
                                    <table className="readings-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>BP</th>
                                                <th>Heart</th>
                                                <th>Sugar</th>
                                                <th>Oxygen</th>
                                                <th>Temp</th>
                                                <th>Weight</th>
                                                <th>Symptoms</th>
                                                <th>Notes</th>
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
                                                                {getTimeOfDayLabel(r.timeOfDay)}
                                                            </span>
                                                        </td>
                                                        <td><span className={`bp-value ${cat.className}`}>{r.systolic}/{r.diastolic}</span></td>
                                                        <td>{formatMetricValue(r.heartRate, ' bpm')}</td>
                                                        <td>{formatMetricValue(r.bloodSugar, ' mg/dL')}</td>
                                                        <td>{formatMetricValue(r.oxygenSaturation, '%')}</td>
                                                        <td>{formatMetricValue(r.bodyTemperature, ' F')}</td>
                                                        <td>{formatMetricValue(r.weightKg, ' kg')}</td>
                                                        <td className="notes-cell">{r.symptoms || '--'}</td>
                                                        <td className="notes-cell">{r.notes || '--'}</td>
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

                                <div className="readings-cards">
                                    {readings.slice().reverse().map((r) => {
                                        const cat = getBpCategory(r.systolic, r.diastolic);
                                        return (
                                            <div key={r.id} className="reading-card health-reading-card">
                                                <div className="reading-card-header">
                                                    <span className="reading-card-date">{r.readingDate}</span>
                                                    <span className={`badge ${r.timeOfDay.toLowerCase()}`}>
                                                        {getTimeOfDayLabel(r.timeOfDay)}
                                                    </span>
                                                </div>
                                                <div className="reading-card-body reading-card-body-stacked">
                                                    <div className="reading-card-bp">
                                                        <span className={`bp-value ${cat.className}`}>{r.systolic}/{r.diastolic}</span>
                                                        <span className="reading-card-unit">mmHg</span>
                                                    </div>
                                                    <span className={`reading-card-status ${cat.className}`}>{cat.label}</span>
                                                </div>
                                                <div className="reading-card-metrics">
                                                    <span>Heart: {formatMetricValue(r.heartRate, ' bpm')}</span>
                                                    <span>Sugar: {formatMetricValue(r.bloodSugar, ' mg/dL')}</span>
                                                    <span>Oxygen: {formatMetricValue(r.oxygenSaturation, '%')}</span>
                                                    <span>Temp: {formatMetricValue(r.bodyTemperature, ' F')}</span>
                                                    <span>Weight: {formatMetricValue(r.weightKg, ' kg')}</span>
                                                </div>
                                                {r.symptoms && <p className="reading-card-notes"><strong>Symptoms:</strong> {r.symptoms}</p>}
                                                {r.notes && <p className="reading-card-notes">{r.notes}</p>}
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
                )}

                {selectedFeatures.includes('security') && <ChangePassword />}
            </div>

            {editReading && (
                <EditModal
                    reading={editReading}
                    onClose={() => setEditReading(null)}
                    onSaved={fetchReadings}
                />
            )}

            {isFeaturePanelOpen && (
                <div className="feature-sheet-overlay" onClick={() => setIsFeaturePanelOpen(false)}>
                    <div className="feature-sheet-shell" onClick={(e) => e.stopPropagation()}>
                        <FeatureDashboard
                            features={featureCards}
                            selectedFeatures={selectedFeatures}
                            onToggleFeature={toggleFeature}
                            onApplyPreset={applyPreset}
                            mobileSheet
                            onClose={() => setIsFeaturePanelOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
