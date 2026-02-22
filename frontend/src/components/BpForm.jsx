import { useState } from 'react';
import api from '../api/axios';
import { Plus, Sun, Moon } from 'lucide-react';

export default function BpForm({ onReadingAdded }) {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('MORNING');
    const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!systolic || !diastolic) {
            setError('Please enter both systolic and diastolic values');
            return;
        }

        setLoading(true);
        try {
            await api.post('/bp', {
                systolic: parseInt(systolic),
                diastolic: parseInt(diastolic),
                timeOfDay,
                readingDate,
            });
            setSuccess('Reading added successfully!');
            setSystolic('');
            setDiastolic('');
            if (onReadingAdded) onReadingAdded();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add reading');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bp-form-section glass-card">
            <h2>
                <Plus size={20} style={{ color: '#818cf8' }} />
                Add BP Reading
            </h2>

            {success && <div className="success-msg" style={{ marginBottom: 16 }}>{success}</div>}
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="bp-form-grid">
                    <div className="input-group">
                        <label>Systolic (High)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 120"
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
                            placeholder="e.g. 80"
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

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div> Saving</>
                        ) : (
                            <><Plus size={18} /> Add Reading</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
