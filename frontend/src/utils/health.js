export const documentCategories = [
    { value: 'APPOINTMENT', label: 'Appointment' },
    { value: 'PRESCRIPTION', label: 'Prescription' },
    { value: 'BILL', label: 'Bill' },
    { value: 'LAB_REPORT', label: 'Lab Report' },
    { value: 'SCAN', label: 'Scan / Imaging' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'OTHER', label: 'Other' },
];

export const metricOptions = [
    { key: 'bp', label: 'Blood Pressure', unit: 'mmHg' },
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
    { key: 'bloodSugar', label: 'Blood Sugar', unit: 'mg/dL' },
    { key: 'oxygenSaturation', label: 'Oxygen Saturation', unit: '%' },
    { key: 'bodyTemperature', label: 'Temperature', unit: 'F' },
    { key: 'weightKg', label: 'Weight', unit: 'kg' },
];

export function getBpCategory(sys, dia) {
    if (!sys || !dia) return { label: '--', className: '' };
    if (sys < 120 && dia < 80) return { label: 'Normal', className: 'normal' };
    if (sys < 130 && dia < 80) return { label: 'Elevated', className: 'elevated' };
    if (sys < 140 || dia < 90) return { label: 'High (Stage 1)', className: 'high' };
    return { label: 'High (Stage 2)', className: 'high' };
}

export function getTimeOfDayLabel(timeOfDay) {
    return timeOfDay === 'MORNING' ? 'Morning' : 'Night';
}

export function getMetricAverage(readings, key) {
    const values = readings.map((item) => item[key]).filter((value) => value !== null && value !== undefined);
    if (values.length === 0) return null;
    const total = values.reduce((sum, value) => sum + Number(value), 0);
    return Math.round((total / values.length) * 10) / 10;
}

export function formatMetricValue(value, suffix = '') {
    if (value === null || value === undefined || value === '') return '--';
    return `${value}${suffix}`;
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result !== 'string') {
                reject(new Error('Failed to read file'));
                return;
            }
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

export function getDocumentUrl(document) {
    return `data:${document.mimeType};base64,${document.content}`;
}

export function base64ToBlob(base64, mimeType = 'application/octet-stream') {
    const binary = window.atob(base64);
    const length = binary.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
}
