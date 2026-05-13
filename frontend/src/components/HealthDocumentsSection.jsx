import { useEffect, useMemo, useState } from 'react';
import { Camera, Download, ExternalLink, FileImage, FilePlus2, FileText, FolderOpen, Receipt, ScanLine, ShieldCheck, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { base64ToBlob, documentCategories, fileToBase64 } from '../utils/health';

const categoryIcons = {
    APPOINTMENT: Camera,
    PRESCRIPTION: FileText,
    BILL: Receipt,
    LAB_REPORT: FileText,
    SCAN: ScanLine,
    INSURANCE: ShieldCheck,
    OTHER: FolderOpen,
};

export default function HealthDocumentsSection() {
    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('APPOINTMENT');
    const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const groupedDocuments = useMemo(() => {
        return documentCategories.map((item) => ({
            ...item,
            items: documents.filter((document) => document.category === item.value),
        }));
    }, [documents]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!file) {
            setError('Please choose a file or photo to upload');
            return;
        }

        setSaving(true);
        try {
            const content = await fileToBase64(file);
            await api.post('/documents', {
                title: title.trim() || file.name,
                category,
                fileName: file.name,
                mimeType: file.type || 'application/octet-stream',
                content,
                documentDate,
                notes,
            });
            setTitle('');
            setCategory('APPOINTMENT');
            setDocumentDate(new Date().toISOString().split('T')[0]);
            setNotes('');
            setFile(null);
            const input = document.getElementById('health-document-input');
            if (input) input.value = '';
            setSuccess('Document added to your health folder');
            fetchDocuments();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload document');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this document?')) return;
        try {
            await api.delete(`/documents/${id}`);
            setDocuments((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error('Failed to delete document:', err);
        }
    };

    const openDocument = (documentItem) => {
        try {
            const blob = base64ToBlob(documentItem.content, documentItem.mimeType);
            const blobUrl = URL.createObjectURL(blob);
            const newWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');

            if (!newWindow) {
                downloadDocument(documentItem);
                return;
            }

            setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        } catch (err) {
            console.error('Failed to open document:', err);
            setError('Unable to preview this document. Please use download instead.');
        }
    };

    const downloadDocument = (documentItem) => {
        try {
            const blob = base64ToBlob(documentItem.content, documentItem.mimeType);
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = documentItem.fileName || documentItem.title || 'document';
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        } catch (err) {
            console.error('Failed to download document:', err);
            setError('Unable to download this document.');
        }
    };

    return (
        <div className="documents-layout">
            <div className="documents-section glass-card">
                <div className="section-heading">
                    <div>
                        <h2>
                            <FolderOpen size={20} style={{ color: '#34d399' }} />
                            Health Document Vault
                        </h2>
                        <p className="section-subtitle">
                            Keep appointment photos, prescriptions, bills, reports, and scans arranged in one place for doctors and family.
                        </p>
                    </div>
                    <div className="document-count-chip">
                        <FileImage size={14} />
                        {documents.length} files
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Loading documents...</span>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="empty-state compact-empty">
                        <div className="empty-icon"><FilePlus2 size={34} /></div>
                        <h3>No documents yet</h3>
                        <p>Upload the first prescription, bill, or appointment photo to build your personal health record.</p>
                    </div>
                ) : (
                    <div className="document-groups">
                        {groupedDocuments.map((group) => {
                            const Icon = categoryIcons[group.value] || FolderOpen;
                            return (
                                <div key={group.value} className="document-group glass-panel">
                                    <div className="document-group-header">
                                        <div className="document-group-title">
                                            <Icon size={16} />
                                            <span>{group.label}</span>
                                        </div>
                                        <span className="document-group-count">{group.items.length}</span>
                                    </div>
                                    {group.items.length === 0 ? (
                                        <p className="document-group-empty">No {group.label.toLowerCase()} files yet.</p>
                                    ) : (
                                        <div className="document-list">
                                            {group.items.map((item) => (
                                                <div key={item.id} className="document-card">
                                                    <div className="document-card-main">
                                                        <strong>{item.title}</strong>
                                                        <span>{item.fileName}</span>
                                                        <span>{item.documentDate || 'No date added'}</span>
                                                        {item.notes && <p>{item.notes}</p>}
                                                    </div>
                                                    <div className="document-card-actions">
                                                        <button className="edit-btn" onClick={() => openDocument(item)}>
                                                            <ExternalLink size={14} /> View
                                                        </button>
                                                        <button className="edit-btn" onClick={() => downloadDocument(item)}>
                                                            <Download size={14} /> Download
                                                        </button>
                                                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="documents-upload glass-card">
                <h2>
                    <Camera size={20} style={{ color: '#f59e0b' }} />
                    Add New Document
                </h2>

                {success && <div className="success-msg" style={{ marginBottom: 16 }}>{success}</div>}
                {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

                <form onSubmit={handleSubmit} className="document-upload-form">
                    <div className="input-group">
                        <label>Document title</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Dr. Sharma prescription"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Category</label>
                        <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {documentCategories.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Document date</label>
                        <input
                            type="date"
                            className="input-field"
                            value={documentDate}
                            onChange={(e) => setDocumentDate(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Upload image or file</label>
                        <input
                            id="health-document-input"
                            type="file"
                            className="input-field"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <span className="input-hint">Photos, PDFs, and doctor-related files up to about 5 MB work best.</span>
                    </div>

                    <div className="input-group">
                        <label>Notes</label>
                        <textarea
                            className="input-field text-area-field"
                            placeholder="Add context such as follow-up date, medicine plan, or bill details"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                        {saving ? 'Uploading...' : 'Save Document'}
                    </button>
                </form>
            </div>
        </div>
    );
}
