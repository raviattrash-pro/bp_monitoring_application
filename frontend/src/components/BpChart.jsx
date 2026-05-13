import { useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from 'recharts';
import { metricOptions } from '../utils/health';

const NORMAL_SYSTOLIC = 120;
const NORMAL_DIASTOLIC = 80;
const metricConfig = {
    heartRate: { color: '#fb7185', label: 'Heart Rate', unit: 'bpm', normal: 100 },
    bloodSugar: { color: '#f59e0b', label: 'Blood Sugar', unit: 'mg/dL', normal: 140 },
    oxygenSaturation: { color: '#22c55e', label: 'Oxygen Saturation', unit: '%', normal: 95 },
    bodyTemperature: { color: '#38bdf8', label: 'Temperature', unit: 'F', normal: 98.6 },
    weightKg: { color: '#a78bfa', label: 'Weight', unit: 'kg', normal: null },
};

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div style={{
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '14px 18px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>{label}</p>
            {payload.map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
                    <span style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>
                        {entry.name}: <strong>{entry.value}</strong>
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function BpChart({ readings }) {
    const [activeMetric, setActiveMetric] = useState('bp');
    const chartData = useMemo(() => (readings || []).map((r) => ({
        label: `${r.readingDate} ${r.timeOfDay === 'MORNING' ? 'AM' : 'PM'}`,
        systolic: r.systolic,
        diastolic: r.diastolic,
        heartRate: r.heartRate,
        bloodSugar: r.bloodSugar,
        oxygenSaturation: r.oxygenSaturation,
        bodyTemperature: r.bodyTemperature,
        weightKg: r.weightKg,
    })), [readings]);

    if (!readings || readings.length === 0) {
        return (
            <div className="chart-section glass-card">
                <h2>Health Trends</h2>
                <div className="empty-state">
                    <div className="empty-icon">+</div>
                    <h3>No data to display yet</h3>
                    <p>Add your first health reading to see trends</p>
                </div>
            </div>
        );
    }

    const activeMetricConfig = metricConfig[activeMetric];
    const filteredMetricData = chartData.filter((item) => activeMetric === 'bp' || (item[activeMetric] !== null && item[activeMetric] !== undefined));

    return (
        <div className="chart-section glass-card">
            <div className="section-heading">
                <div>
                    <h2>Health Trends</h2>
                    <p className="chart-subtitle">
                        Review blood pressure, pulse, sugar, oxygen, temperature, and weight patterns over time.
                    </p>
                </div>
            </div>

            <div className="metric-toggle">
                {metricOptions.map((metric) => (
                    <button
                        key={metric.key}
                        className={`metric-pill ${activeMetric === metric.key ? 'active' : ''}`}
                        onClick={() => setActiveMetric(metric.key)}
                        type="button"
                    >
                        {metric.label}
                    </button>
                ))}
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={activeMetric === 'bp' ? chartData : filteredMetricData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="systolicGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="diastolicGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                            </linearGradient>
                            {activeMetric !== 'bp' && (
                                <linearGradient id="singleMetricGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={activeMetricConfig.color} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={activeMetricConfig.color} stopOpacity={0} />
                                </linearGradient>
                            )}
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

                        <XAxis
                            dataKey="label"
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                            tickLine={false}
                            angle={-30}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                            tickLine={false}
                            domain={['dataMin - 10', 'dataMax + 10']}
                            label={{
                                value: activeMetric === 'bp' ? 'mmHg' : activeMetricConfig.unit,
                                angle: -90,
                                position: 'insideLeft',
                                style: { fill: '#64748b', fontSize: 12 }
                            }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {activeMetric === 'bp' ? (
                            <>
                                <ReferenceLine
                                    y={NORMAL_SYSTOLIC}
                                    stroke="#34d399"
                                    strokeDasharray="8 4"
                                    strokeWidth={2}
                                    label={{ value: 'Normal Systolic (120)', position: 'right', fill: '#34d399', fontSize: 11 }}
                                />
                                <ReferenceLine
                                    y={NORMAL_DIASTOLIC}
                                    stroke="#fbbf24"
                                    strokeDasharray="8 4"
                                    strokeWidth={2}
                                    label={{ value: 'Normal Diastolic (80)', position: 'right', fill: '#fbbf24', fontSize: 11 }}
                                />
                                <Area type="monotone" dataKey="systolic" fill="url(#systolicGrad)" stroke="none" />
                                <Area type="monotone" dataKey="diastolic" fill="url(#diastolicGrad)" stroke="none" />
                                <Line
                                    type="monotone"
                                    dataKey="systolic"
                                    name="Your Systolic"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#0a0e1a' }}
                                    activeDot={{ r: 7, fill: '#818cf8', strokeWidth: 2, stroke: '#0a0e1a' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="diastolic"
                                    name="Your Diastolic"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: '#ec4899', strokeWidth: 2, stroke: '#0a0e1a' }}
                                    activeDot={{ r: 7, fill: '#f472b6', strokeWidth: 2, stroke: '#0a0e1a' }}
                                />
                            </>
                        ) : (
                            <>
                                {activeMetricConfig.normal && (
                                    <ReferenceLine
                                        y={activeMetricConfig.normal}
                                        stroke="#34d399"
                                        strokeDasharray="8 4"
                                        strokeWidth={2}
                                        label={{
                                            value: `Target ${activeMetricConfig.normal} ${activeMetricConfig.unit}`,
                                            position: 'right',
                                            fill: '#34d399',
                                            fontSize: 11
                                        }}
                                    />
                                )}
                                <Area type="monotone" dataKey={activeMetric} fill="url(#singleMetricGrad)" stroke="none" />
                                <Line
                                    type="monotone"
                                    dataKey={activeMetric}
                                    name={activeMetricConfig.label}
                                    stroke={activeMetricConfig.color}
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: activeMetricConfig.color, strokeWidth: 2, stroke: '#0a0e1a' }}
                                    activeDot={{ r: 7, fill: activeMetricConfig.color, strokeWidth: 2, stroke: '#0a0e1a' }}
                                />
                            </>
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-legend">
                {activeMetric === 'bp' ? (
                    <>
                        <div className="legend-item">
                            <div className="legend-dot" style={{ background: '#6366f1' }} />
                            Your Systolic (High)
                        </div>
                        <div className="legend-item">
                            <div className="legend-dot" style={{ background: '#ec4899' }} />
                            Your Diastolic (Low)
                        </div>
                        <div className="legend-item">
                            <div className="legend-dot" style={{ background: '#34d399', border: '2px dashed #34d399', width: 16, borderRadius: 0, height: 2 }} />
                            Normal Systolic (120)
                        </div>
                        <div className="legend-item">
                            <div className="legend-dot" style={{ background: '#fbbf24', border: '2px dashed #fbbf24', width: 16, borderRadius: 0, height: 2 }} />
                            Normal Diastolic (80)
                        </div>
                    </>
                ) : (
                    <div className="legend-item">
                        <div className="legend-dot" style={{ background: activeMetricConfig.color }} />
                        {activeMetricConfig.label} ({activeMetricConfig.unit})
                    </div>
                )}
            </div>
        </div>
    );
}
