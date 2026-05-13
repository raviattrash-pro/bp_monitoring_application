import { useState, useEffect } from 'react';
import { Droplets, HeartPulse, Save, Thermometer, Weight, Waves, X } from 'lucide-react';
import api from '../api/axios';

export default function EditModal({ reading, onClose, onSaved }) {
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
    const [readingDate, setReadingDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (reading) {
            setSystolic(reading.systolic.toString());
            setDiastolic(reading.diastolic.toString());
            setHeartRate(reading.heartRate?.toString() || '');
            setBloodSugar(reading.bloodSugar?.toString() || '');
            setOxygenSaturation(reading.oxygenSaturation?.toString() || '');
            setBodyTemperature(reading.bodyTemperature?.toString() || '');
            setWeightKg(reading.weightKg?.toString() || '');
            setNotes(reading.notes || '');
            setSymptoms(reading.symptoms || '');
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
            <div className="modal-content glass-card modal-content-wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Reading</h2>
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
                            <label><HeartPulse size={14} style={{ marginRight: 6 }} />Heart Rate (bpm)</label>
                            <input
                                type="number"
                                className="input-field"
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
                        <div className="input-group modal-notes-group">
                            <label>Symptoms</label>
                            <textarea
                                className="input-field text-area-field"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                rows="3"
                            />
                        </div>
                        <div className="input-group modal-notes-group">
                            <label>Notes</label>
                            <textarea
                                className="input-field text-area-field"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows="3"
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
