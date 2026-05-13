import { useState } from 'react';
import api from '../api/axios';
import { Droplets, HeartPulse, Plus, Thermometer, Weight, Waves } from 'lucide-react';

export default function BpForm({ onReadingAdded }) {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [bloodSugar, setBloodSugar] = useState('');
    const [oxygenSaturation, setOxygenSaturation] = useState('');
    const [bodyTemperature, setBodyTemperature] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [notes, setNotes] = useState('');
    const [symptoms, setSymptoms] = useState('');
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
                heartRate: heartRate ? parseInt(heartRate) : null,
                bloodSugar: bloodSugar ? parseInt(bloodSugar) : null,
                oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : null,
                bodyTemperature: bodyTemperature ? parseFloat(bodyTemperature) : null,
                weightKg: weightKg ? parseFloat(weightKg) : null,
                notes,
                symptoms,
                timeOfDay,
                readingDate,
            });
            setSuccess('Reading added successfully!');
            setSystolic('');
            setDiastolic('');
            setHeartRate('');
            setBloodSugar('');
            setOxygenSaturation('');
            setBodyTemperature('');
            setWeightKg('');
            setNotes('');
            setSymptoms('');
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
                Daily Health Check-in
            </h2>
            <p className="form-subtitle">Track blood pressure along with heart rate, sugar, oxygen, temperature, weight, and care notes in one place.</p>

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
                        <label><HeartPulse size={14} style={{ marginRight: 6 }} />Heart Rate (bpm)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 72"
                            value={heartRate}
                            onChange={(e) => setHeartRate(e.target.value)}
                            min="30"
                            max="240"
                        />
                    </div>

                    <div className="input-group">
                        <label><Droplets size={14} style={{ marginRight: 6 }} />Blood Sugar (mg/dL)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 110"
                            value={bloodSugar}
                            onChange={(e) => setBloodSugar(e.target.value)}
                            min="40"
                            max="600"
                        />
                    </div>

                    <div className="input-group">
                        <label><Waves size={14} style={{ marginRight: 6 }} />Oxygen Saturation (%)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 98"
                            value={oxygenSaturation}
                            onChange={(e) => setOxygenSaturation(e.target.value)}
                            min="50"
                            max="100"
                        />
                    </div>

                    <div className="input-group">
                        <label><Thermometer size={14} style={{ marginRight: 6 }} />Temperature (F)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 98.6"
                            value={bodyTemperature}
                            onChange={(e) => setBodyTemperature(e.target.value)}
                            min="90"
                            max="115"
                            step="0.1"
                        />
                    </div>

                    <div className="input-group">
                        <label><Weight size={14} style={{ marginRight: 6 }} />Weight (kg)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 68"
                            value={weightKg}
                            onChange={(e) => setWeightKg(e.target.value)}
                            min="1"
                            max="500"
                            step="0.1"
                        />
                    </div>

                    <div className="input-group">
                        <label>Time of Day</label>
                        <select
                            className="input-field"
                            value={timeOfDay}
                            onChange={(e) => setTimeOfDay(e.target.value)}
                        >
                            <option value="MORNING">Morning</option>
                            <option value="NIGHT">Night</option>
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

                    <div className="input-group form-notes-group">
                        <label>Symptoms diary</label>
                        <textarea
                            className="input-field text-area-field"
                            placeholder="Headache, dizziness, fatigue, swelling, chest pain, stress, sleep issues"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div className="input-group form-notes-group">
                        <label>Notes for doctor or family</label>
                        <textarea
                            className="input-field text-area-field"
                            placeholder="Symptoms, medicines taken, food timing, or follow-up notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
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
