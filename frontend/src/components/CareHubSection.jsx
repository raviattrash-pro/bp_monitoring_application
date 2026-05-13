import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import {
    AlertCircle,
    CalendarDays,
    HeartHandshake,
    Microscope,
    Pill,
    Plus,
    ShieldAlert,
    Trash2,
    Users
} from 'lucide-react';

const emptyEmergencyProfile = {
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    contactName: '',
    contactPhone: '',
    contactRelation: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    doctorName: '',
    doctorPhone: '',
    notes: '',
};

export default function CareHubSection() {
    const [medications, setMedications] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [emergencyProfile, setEmergencyProfile] = useState(emptyEmergencyProfile);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [medicationForm, setMedicationForm] = useState({
        name: '',
        dosage: '',
        frequency: '',
        timeSchedule: '',
        instructions: '',
        remainingCount: '',
        refillThreshold: '',
        startDate: '',
        endDate: '',
        active: true,
    });
    const [appointmentForm, setAppointmentForm] = useState({
        doctorName: '',
        specialty: '',
        appointmentDateTime: '',
        location: '',
        purpose: '',
        followUpDate: '',
        status: 'UPCOMING',
        notes: '',
    });
    const [familyForm, setFamilyForm] = useState({
        name: '',
        relation: '',
        age: '',
        bloodGroup: '',
        conditions: '',
        medications: '',
        notes: '',
    });
    const [labForm, setLabForm] = useState({
        testName: '',
        resultValue: '',
        unit: '',
        normalRange: '',
        reportDate: '',
        labName: '',
        category: '',
        notes: '',
    });

    const overview = useMemo(() => {
        const refillSoon = medications.filter((item) => item.refillSoon).length;
        const upcomingAppointments = appointments.filter((item) => item.status === 'UPCOMING').length;
        return { refillSoon, upcomingAppointments };
    }, [medications, appointments]);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [medicationRes, appointmentRes, familyRes, emergencyRes, labRes] = await Promise.all([
                api.get('/medications'),
                api.get('/appointments'),
                api.get('/family-members'),
                api.get('/emergency-profile'),
                api.get('/lab-reports'),
            ]);
            setMedications(medicationRes.data);
            setAppointments(appointmentRes.data);
            setFamilyMembers(familyRes.data);
            setEmergencyProfile({ ...emptyEmergencyProfile, ...emergencyRes.data });
            setLabReports(labRes.data);
        } catch (err) {
            console.error('Failed to load care hub data:', err);
            setError('Failed to load care management data');
        } finally {
            setLoading(false);
        }
    };

    const flashMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleMedicationSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/medications', {
                ...medicationForm,
                remainingCount: medicationForm.remainingCount ? parseInt(medicationForm.remainingCount) : null,
                refillThreshold: medicationForm.refillThreshold ? parseInt(medicationForm.refillThreshold) : null,
            });
            setMedications((prev) => [...prev, res.data].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name)));
            setMedicationForm({
                name: '',
                dosage: '',
                frequency: '',
                timeSchedule: '',
                instructions: '',
                remainingCount: '',
                refillThreshold: '',
                startDate: '',
                endDate: '',
                active: true,
            });
            flashMessage('Medication added');
        } catch (err) {
            setError('Failed to add medication');
        }
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/appointments', appointmentForm);
            setAppointments((prev) => [...prev, res.data].sort((a, b) => a.appointmentDateTime.localeCompare(b.appointmentDateTime)));
            setAppointmentForm({
                doctorName: '',
                specialty: '',
                appointmentDateTime: '',
                location: '',
                purpose: '',
                followUpDate: '',
                status: 'UPCOMING',
                notes: '',
            });
            flashMessage('Appointment saved');
        } catch (err) {
            setError('Failed to save appointment');
        }
    };

    const handleFamilySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/family-members', {
                ...familyForm,
                age: familyForm.age ? parseInt(familyForm.age) : null,
            });
            setFamilyMembers((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
            setFamilyForm({
                name: '',
                relation: '',
                age: '',
                bloodGroup: '',
                conditions: '',
                medications: '',
                notes: '',
            });
            flashMessage('Family member added');
        } catch (err) {
            setError('Failed to add family member');
        }
    };

    const handleLabSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/lab-reports', labForm);
            setLabReports((prev) => [res.data, ...prev].sort((a, b) => b.reportDate.localeCompare(a.reportDate)));
            setLabForm({
                testName: '',
                resultValue: '',
                unit: '',
                normalRange: '',
                reportDate: '',
                labName: '',
                category: '',
                notes: '',
            });
            flashMessage('Lab report added');
        } catch (err) {
            setError('Failed to add lab report');
        }
    };

    const saveEmergencyProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/emergency-profile', emergencyProfile);
            setEmergencyProfile({ ...emptyEmergencyProfile, ...res.data });
            flashMessage('Emergency profile updated');
        } catch (err) {
            setError('Failed to update emergency profile');
        }
    };

    const deleteItem = async (path, id, setter) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await api.delete(`${path}/${id}`);
            setter((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            setError('Failed to delete item');
        }
    };

    return (
        <div className="care-hub-section">
            <div className="care-overview-grid">
                <div className="care-overview-card glass-card">
                    <Pill size={20} />
                    <div>
                        <strong>{medications.length}</strong>
                        <span>Medications</span>
                        <p>{overview.refillSoon} need refill attention</p>
                    </div>
                </div>
                <div className="care-overview-card glass-card">
                    <CalendarDays size={20} />
                    <div>
                        <strong>{overview.upcomingAppointments}</strong>
                        <span>Upcoming visits</span>
                        <p>Doctor appointments and follow-ups</p>
                    </div>
                </div>
                <div className="care-overview-card glass-card">
                    <Users size={20} />
                    <div>
                        <strong>{familyMembers.length}</strong>
                        <span>Family profiles</span>
                        <p>Track loved ones under one account</p>
                    </div>
                </div>
                <div className="care-overview-card glass-card">
                    <Microscope size={20} />
                    <div>
                        <strong>{labReports.length}</strong>
                        <span>Lab reports</span>
                        <p>Store trends like HbA1c and cholesterol</p>
                    </div>
                </div>
            </div>

            {message && <div className="success-msg">{message}</div>}
            {error && <div className="auth-error">{error}</div>}

            <div className="care-grid">
                <section className="care-card glass-card">
                    <div className="section-heading">
                        <div>
                            <h2><Pill size={18} style={{ color: '#818cf8' }} /> Medication Tracker</h2>
                            <p className="section-subtitle">Manage doses, schedule, and refill alerts.</p>
                        </div>
                    </div>
                    <form className="care-form-grid" onSubmit={handleMedicationSubmit}>
                        <input className="input-field" placeholder="Medicine name" value={medicationForm.name} onChange={(e) => setMedicationForm((prev) => ({ ...prev, name: e.target.value }))} required />
                        <input className="input-field" placeholder="Dosage" value={medicationForm.dosage} onChange={(e) => setMedicationForm((prev) => ({ ...prev, dosage: e.target.value }))} />
                        <input className="input-field" placeholder="Frequency" value={medicationForm.frequency} onChange={(e) => setMedicationForm((prev) => ({ ...prev, frequency: e.target.value }))} />
                        <input className="input-field" placeholder="Time schedule" value={medicationForm.timeSchedule} onChange={(e) => setMedicationForm((prev) => ({ ...prev, timeSchedule: e.target.value }))} />
                        <input type="number" className="input-field" placeholder="Remaining tablets" value={medicationForm.remainingCount} onChange={(e) => setMedicationForm((prev) => ({ ...prev, remainingCount: e.target.value }))} />
                        <input type="number" className="input-field" placeholder="Refill alert at" value={medicationForm.refillThreshold} onChange={(e) => setMedicationForm((prev) => ({ ...prev, refillThreshold: e.target.value }))} />
                        <input type="date" className="input-field" value={medicationForm.startDate} onChange={(e) => setMedicationForm((prev) => ({ ...prev, startDate: e.target.value }))} />
                        <input type="date" className="input-field" value={medicationForm.endDate} onChange={(e) => setMedicationForm((prev) => ({ ...prev, endDate: e.target.value }))} />
                        <textarea className="input-field text-area-field care-full-width" placeholder="Instructions" value={medicationForm.instructions} onChange={(e) => setMedicationForm((prev) => ({ ...prev, instructions: e.target.value }))} />
                        <button className="btn btn-primary care-inline-btn" type="submit"><Plus size={16} /> Add Medication</button>
                    </form>
                    <div className="care-list">
                        {loading ? <div className="loading-spinner"><div className="spinner"></div><span>Loading...</span></div> : medications.map((item) => (
                            <div key={item.id} className="care-item">
                                <div>
                                    <strong>{item.name}</strong>
                                    <p>{[item.dosage, item.frequency, item.timeSchedule].filter(Boolean).join(' | ') || 'Schedule not added'}</p>
                                    <span className={item.refillSoon ? 'care-flag warning' : 'care-flag'}>{item.refillSoon ? 'Refill soon' : item.active ? 'Active' : 'Inactive'}</span>
                                </div>
                                <button className="delete-btn" onClick={() => deleteItem('/medications', item.id, setMedications)}><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="care-card glass-card">
                    <div className="section-heading">
                        <div>
                            <h2><CalendarDays size={18} style={{ color: '#34d399' }} /> Doctor Visit Planner</h2>
                            <p className="section-subtitle">Track appointments, purpose, location, and follow-up date.</p>
                        </div>
                    </div>
                    <form className="care-form-grid" onSubmit={handleAppointmentSubmit}>
                        <input className="input-field" placeholder="Doctor name" value={appointmentForm.doctorName} onChange={(e) => setAppointmentForm((prev) => ({ ...prev, doctorName: e.target.value }))} required />
                        <input className="input-field" placeholder="Specialty" value={appointmentForm.specialty} onChange={(e) => setAppointmentForm((prev) => ({ ...prev, specialty: e.target.value }))} />
                        <input type="datetime-local" className="input-field" value={appointmentForm.appointmentDateTime} onChange={(e) => setAppointmentForm((prev) => ({ ...prev, appointmentDateTime: e.target.value }))} required />
                        <input className="input-field" placeholder="Location / hospital" value={appointmentForm.location} onChange={(e) => setAppointmentForm((prev) => ({ ...prev, location: e.target.value }))} />
                        <input className="input-field" placeholder="Purpose" value={appointmentForm.purpose} onChange={(e) => setAppointmentForm((prev) => ({ ...prev, purpose: e.target.value }))} />
                        <input type="date" className="input-field" value={appointmentForm.followUpDate} onChange={(e) => setAppointmentForm((prev) => ({ ...prev, followUpDate: e.target.value }))} />
                        <textarea className="input-field text-area-field care-full-width" placeholder="Notes" value={appointmentForm.notes} onChange={(e) => setAppointmentForm((prev) => ({ ...prev, notes: e.target.value }))} />
                        <button className="btn btn-primary care-inline-btn" type="submit"><Plus size={16} /> Save Appointment</button>
                    </form>
                    <div className="care-list">
                        {appointments.map((item) => (
                            <div key={item.id} className="care-item">
                                <div>
                                    <strong>{item.doctorName}</strong>
                                    <p>{new Date(item.appointmentDateTime).toLocaleString()}</p>
                                    <span className="care-muted">{[item.specialty, item.location, item.purpose].filter(Boolean).join(' | ')}</span>
                                </div>
                                <button className="delete-btn" onClick={() => deleteItem('/appointments', item.id, setAppointments)}><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="care-card glass-card">
                    <div className="section-heading">
                        <div>
                            <h2><Users size={18} style={{ color: '#f59e0b' }} /> Family Profiles</h2>
                            <p className="section-subtitle">Track health basics for parents, spouse, or children.</p>
                        </div>
                    </div>
                    <form className="care-form-grid" onSubmit={handleFamilySubmit}>
                        <input className="input-field" placeholder="Name" value={familyForm.name} onChange={(e) => setFamilyForm((prev) => ({ ...prev, name: e.target.value }))} required />
                        <input className="input-field" placeholder="Relation" value={familyForm.relation} onChange={(e) => setFamilyForm((prev) => ({ ...prev, relation: e.target.value }))} />
                        <input type="number" className="input-field" placeholder="Age" value={familyForm.age} onChange={(e) => setFamilyForm((prev) => ({ ...prev, age: e.target.value }))} />
                        <input className="input-field" placeholder="Blood group" value={familyForm.bloodGroup} onChange={(e) => setFamilyForm((prev) => ({ ...prev, bloodGroup: e.target.value }))} />
                        <textarea className="input-field text-area-field" placeholder="Health conditions" value={familyForm.conditions} onChange={(e) => setFamilyForm((prev) => ({ ...prev, conditions: e.target.value }))} />
                        <textarea className="input-field text-area-field" placeholder="Current medications" value={familyForm.medications} onChange={(e) => setFamilyForm((prev) => ({ ...prev, medications: e.target.value }))} />
                        <textarea className="input-field text-area-field care-full-width" placeholder="Care notes" value={familyForm.notes} onChange={(e) => setFamilyForm((prev) => ({ ...prev, notes: e.target.value }))} />
                        <button className="btn btn-primary care-inline-btn" type="submit"><Plus size={16} /> Add Member</button>
                    </form>
                    <div className="care-list">
                        {familyMembers.map((item) => (
                            <div key={item.id} className="care-item">
                                <div>
                                    <strong>{item.name}</strong>
                                    <p>{[item.relation, item.age ? `${item.age} yrs` : '', item.bloodGroup].filter(Boolean).join(' | ')}</p>
                                    <span className="care-muted">{item.conditions || item.medications || item.notes || 'No extra details yet'}</span>
                                </div>
                                <button className="delete-btn" onClick={() => deleteItem('/family-members', item.id, setFamilyMembers)}><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="care-card glass-card">
                    <div className="section-heading">
                        <div>
                            <h2><Microscope size={18} style={{ color: '#38bdf8' }} /> Lab Reports</h2>
                            <p className="section-subtitle">Track HbA1c, cholesterol, thyroid, kidney, and other lab values.</p>
                        </div>
                    </div>
                    <form className="care-form-grid" onSubmit={handleLabSubmit}>
                        <input className="input-field" placeholder="Test name" value={labForm.testName} onChange={(e) => setLabForm((prev) => ({ ...prev, testName: e.target.value }))} required />
                        <input className="input-field" placeholder="Result value" value={labForm.resultValue} onChange={(e) => setLabForm((prev) => ({ ...prev, resultValue: e.target.value }))} />
                        <input className="input-field" placeholder="Unit" value={labForm.unit} onChange={(e) => setLabForm((prev) => ({ ...prev, unit: e.target.value }))} />
                        <input className="input-field" placeholder="Normal range" value={labForm.normalRange} onChange={(e) => setLabForm((prev) => ({ ...prev, normalRange: e.target.value }))} />
                        <input type="date" className="input-field" value={labForm.reportDate} onChange={(e) => setLabForm((prev) => ({ ...prev, reportDate: e.target.value }))} required />
                        <input className="input-field" placeholder="Lab / hospital" value={labForm.labName} onChange={(e) => setLabForm((prev) => ({ ...prev, labName: e.target.value }))} />
                        <input className="input-field" placeholder="Category" value={labForm.category} onChange={(e) => setLabForm((prev) => ({ ...prev, category: e.target.value }))} />
                        <textarea className="input-field text-area-field care-full-width" placeholder="Notes" value={labForm.notes} onChange={(e) => setLabForm((prev) => ({ ...prev, notes: e.target.value }))} />
                        <button className="btn btn-primary care-inline-btn" type="submit"><Plus size={16} /> Add Report</button>
                    </form>
                    <div className="care-list">
                        {labReports.map((item) => (
                            <div key={item.id} className="care-item">
                                <div>
                                    <strong>{item.testName}</strong>
                                    <p>{[item.resultValue, item.unit].filter(Boolean).join(' ') || 'Result pending'} {item.normalRange ? ` | Range ${item.normalRange}` : ''}</p>
                                    <span className="care-muted">{[item.reportDate, item.labName, item.category].filter(Boolean).join(' | ')}</span>
                                </div>
                                <button className="delete-btn" onClick={() => deleteItem('/lab-reports', item.id, setLabReports)}><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="care-card glass-card care-card-wide">
                    <div className="section-heading">
                        <div>
                            <h2><ShieldAlert size={18} style={{ color: '#f87171' }} /> Emergency Profile</h2>
                            <p className="section-subtitle">Keep critical medical details ready for emergencies and hospital visits.</p>
                        </div>
                    </div>
                    <form className="care-form-grid" onSubmit={saveEmergencyProfile}>
                        <input className="input-field" placeholder="Blood group" value={emergencyProfile.bloodGroup || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, bloodGroup: e.target.value }))} />
                        <input className="input-field" placeholder="Emergency contact name" value={emergencyProfile.contactName || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, contactName: e.target.value }))} />
                        <input className="input-field" placeholder="Emergency contact phone" value={emergencyProfile.contactPhone || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, contactPhone: e.target.value }))} />
                        <input className="input-field" placeholder="Relation" value={emergencyProfile.contactRelation || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, contactRelation: e.target.value }))} />
                        <input className="input-field" placeholder="Primary doctor" value={emergencyProfile.doctorName || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, doctorName: e.target.value }))} />
                        <input className="input-field" placeholder="Doctor phone" value={emergencyProfile.doctorPhone || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, doctorPhone: e.target.value }))} />
                        <input className="input-field" placeholder="Insurance provider" value={emergencyProfile.insuranceProvider || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, insuranceProvider: e.target.value }))} />
                        <input className="input-field" placeholder="Policy number" value={emergencyProfile.insurancePolicyNumber || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, insurancePolicyNumber: e.target.value }))} />
                        <textarea className="input-field text-area-field" placeholder="Allergies" value={emergencyProfile.allergies || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, allergies: e.target.value }))} />
                        <textarea className="input-field text-area-field" placeholder="Chronic conditions" value={emergencyProfile.chronicConditions || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, chronicConditions: e.target.value }))} />
                        <textarea className="input-field text-area-field care-full-width" placeholder="Extra emergency notes" value={emergencyProfile.notes || ''} onChange={(e) => setEmergencyProfile((prev) => ({ ...prev, notes: e.target.value }))} />
                        <button className="btn btn-primary care-inline-btn" type="submit"><HeartHandshake size={16} /> Save Emergency Profile</button>
                    </form>
                    <div className="care-alert-banner">
                        <AlertCircle size={16} />
                        Share this section with family so key health information is available when needed.
                    </div>
                </section>
            </div>
        </div>
    );
}
