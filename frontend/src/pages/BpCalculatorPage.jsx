import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Calculator, Heart, TrendingUp, TrendingDown, RotateCcw, Activity } from 'lucide-react';

export default function BpCalculatorPage() {
    const [readings, setReadings] = useState([
        { systolic: '', diastolic: '' },
        { systolic: '', diastolic: '' },
        { systolic: '', diastolic: '' },
    ]);
    const [result, setResult] = useState(null);

    const handleChange = (index, field, value) => {
        const updated = [...readings];
        updated[index][field] = value;
        setReadings(updated);
    };

    const getBpCategory = (sys, dia) => {
        if (sys < 120 && dia < 80) return { label: 'Normal', className: 'normal', emoji: '✅', desc: 'Your blood pressure is in a healthy range. Keep it up!' };
        if (sys < 130 && dia < 80) return { label: 'Elevated', className: 'elevated', emoji: '⚠️', desc: 'Your blood pressure is slightly elevated. Consider lifestyle changes.' };
        if (sys < 140 || dia < 90) return { label: 'High (Stage 1)', className: 'high', emoji: '🔶', desc: 'You have Stage 1 Hypertension. Consult your doctor for guidance.' };
        return { label: 'High (Stage 2)', className: 'high', emoji: '🔴', desc: 'You have Stage 2 Hypertension. Seek medical attention promptly.' };
    };

    const handleCalculate = () => {
        // Validate all fields
        for (let i = 0; i < readings.length; i++) {
            const sys = Number(readings[i].systolic);
            const dia = Number(readings[i].diastolic);
            if (!sys || !dia || sys < 50 || sys > 300 || dia < 30 || dia > 200) {
                alert(`Please enter valid values for Reading ${i + 1}.\nSystolic: 50–300, Diastolic: 30–200`);
                return;
            }
        }

        const avgSys = Math.round(readings.reduce((sum, r) => sum + Number(r.systolic), 0) / 3);
        const avgDia = Math.round(readings.reduce((sum, r) => sum + Number(r.diastolic), 0) / 3);
        const category = getBpCategory(avgSys, avgDia);

        setResult({ avgSys, avgDia, category });
    };

    const handleReset = () => {
        setReadings([
            { systolic: '', diastolic: '' },
            { systolic: '', diastolic: '' },
            { systolic: '', diastolic: '' },
        ]);
        setResult(null);
    };

    const readingLabels = ['1st Reading', '2nd Reading', '3rd Reading'];
    const readingEmojis = ['🩸', '🩸', '🩸'];

    return (
        <>
            <Navbar />
            <div className="dashboard fade-in">
                <div className="dashboard-header">
                    <h1>
                        <span>BP Average</span> Calculator
                    </h1>
                </div>

                {/* Calculator Card */}
                <div className="glass-card calc-card">
                    <h2 className="calc-title">
                        <Calculator size={22} /> Enter 3 Blood Pressure Readings
                    </h2>
                    <p className="calc-subtitle">
                        Enter your systolic (high) and diastolic (low) values from 3 separate readings to calculate your average blood pressure.
                    </p>

                    <div className="calc-readings">
                        {readings.map((r, i) => (
                            <div key={i} className="calc-reading-row">
                                <div className="calc-reading-label">
                                    <span className="calc-reading-emoji">{readingEmojis[i]}</span>
                                    <span>{readingLabels[i]}</span>
                                </div>
                                <div className="calc-inputs">
                                    <div className="calc-input-group">
                                        <label className="calc-input-label">
                                            <TrendingUp size={14} /> Systolic (High)
                                        </label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            placeholder="e.g. 120"
                                            value={r.systolic}
                                            onChange={(e) => handleChange(i, 'systolic', e.target.value)}
                                            min="50"
                                            max="300"
                                        />
                                    </div>
                                    <div className="calc-input-group">
                                        <label className="calc-input-label">
                                            <TrendingDown size={14} /> Diastolic (Low)
                                        </label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            placeholder="e.g. 80"
                                            value={r.diastolic}
                                            onChange={(e) => handleChange(i, 'diastolic', e.target.value)}
                                            min="30"
                                            max="200"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="calc-actions">
                        <button className="btn btn-primary btn-full" onClick={handleCalculate}>
                            <Calculator size={18} /> Calculate Average
                        </button>
                        <button className="btn btn-secondary" onClick={handleReset}>
                            <RotateCcw size={16} /> Reset
                        </button>
                    </div>
                </div>

                {/* Result Card */}
                {result && (
                    <div className={`glass-card calc-result-card calc-result-${result.category.className} fade-in`}>
                        <div className="calc-result-header">
                            <span className="calc-result-emoji">{result.category.emoji}</span>
                            <h2>Your Average Blood Pressure</h2>
                        </div>

                        <div className="calc-result-values">
                            <div className="calc-result-box">
                                <div className="calc-result-icon systolic">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="calc-result-number">{result.avgSys}</div>
                                <div className="calc-result-label">Avg Systolic</div>
                                <div className="calc-result-unit">mmHg</div>
                            </div>
                            <div className="calc-result-divider">
                                <Heart size={28} className="calc-heart-icon" />
                            </div>
                            <div className="calc-result-box">
                                <div className="calc-result-icon diastolic">
                                    <TrendingDown size={24} />
                                </div>
                                <div className="calc-result-number">{result.avgDia}</div>
                                <div className="calc-result-label">Avg Diastolic</div>
                                <div className="calc-result-unit">mmHg</div>
                            </div>
                        </div>

                        <div className={`calc-status-badge ${result.category.className}`}>
                            <Activity size={16} />
                            <span>{result.category.label}</span>
                        </div>
                        <p className="calc-result-desc">{result.category.desc}</p>

                        {/* Individual readings summary */}
                        <div className="calc-summary">
                            <h3>📊 Readings Summary</h3>
                            <div className="calc-summary-grid">
                                {readings.map((r, i) => (
                                    <div key={i} className="calc-summary-item">
                                        <span className="calc-summary-label">{readingLabels[i]}</span>
                                        <span className={`bp-value ${getBpCategory(Number(r.systolic), Number(r.diastolic)).className}`}>
                                            {r.systolic}/{r.diastolic}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Card */}
                <div className="glass-card calc-info-card">
                    <h2>📖 Blood Pressure Categories</h2>
                    <div className="calc-categories">
                        <div className="calc-category-item">
                            <span className="calc-cat-dot normal"></span>
                            <div>
                                <strong>Normal</strong>
                                <span>Less than 120/80 mmHg</span>
                            </div>
                        </div>
                        <div className="calc-category-item">
                            <span className="calc-cat-dot elevated"></span>
                            <div>
                                <strong>Elevated</strong>
                                <span>120–129 / Less than 80 mmHg</span>
                            </div>
                        </div>
                        <div className="calc-category-item">
                            <span className="calc-cat-dot high"></span>
                            <div>
                                <strong>High (Stage 1)</strong>
                                <span>130–139 / 80–89 mmHg</span>
                            </div>
                        </div>
                        <div className="calc-category-item">
                            <span className="calc-cat-dot critical"></span>
                            <div>
                                <strong>High (Stage 2)</strong>
                                <span>140+ / 90+ mmHg</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
