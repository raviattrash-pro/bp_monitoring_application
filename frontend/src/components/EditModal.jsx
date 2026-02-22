import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/axios';

export default function EditModal({ reading, onClose, onSaved }) {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('MORNING');
    const [readingDate, setReadingDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (reading) {
            setSystolic(reading.systolic.toString());
            setDiastolic(reading.diastolic.toString());
            setTimeOfDay(reading.timeOfDay);
            setReadingDate(reading.readingDate);
        }
    }, [reading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.put(`/bp/${reading.id}`, {
                systolic: parseInt(systolic),
                diastolic: parseInt(diastolic),
                timeOfDay,
                readingDate,
            });
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update reading');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>✏️ Edit Reading</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-grid">
                        <div className="input-group">
                            <label>Systolic (High)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={systolic}
                                onChange={(e) => setSystolic(e.target.value)}
                                min="50"
                                max="300"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Diastolic (Low)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={diastolic}
                                onChange={(e) => setDiastolic(e.target.value)}
                                min="30"
                                max="200"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Time of Day</label>
                            <select
                                className="input-field"
                                value={timeOfDay}
                                onChange={(e) => setTimeOfDay(e.target.value)}
                            >
                                <option value="MORNING">🌅 Morning</option>
                                <option value="NIGHT">🌙 Night</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Date</label>
                            <input
                                type="date"
                                className="input-field"
                                value={readingDate}
                                onChange={(e) => setReadingDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Saving...</>
                            ) : (
                                <><Save size={16} /> Save Changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
