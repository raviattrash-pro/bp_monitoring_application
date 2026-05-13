import { LayoutDashboard, Check, Sparkles, X } from 'lucide-react';

export default function FeatureDashboard({
    features,
    selectedFeatures,
    onToggleFeature,
    onApplyPreset,
    mobileSheet = false,
    onClose,
}) {
    const selectedCount = selectedFeatures.length;

    return (
        <section className={`feature-dashboard glass-card ${mobileSheet ? 'feature-dashboard-mobile-sheet' : ''}`}>
            <div className="feature-dashboard-header">
                <div>
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        Personalized layout
                    </div>
                    <h2>
                        <LayoutDashboard size={20} />
                        Feature Dashboard
                    </h2>
                    <p className="section-subtitle">
                        Choose only the sections you want. Your dashboard stays cleaner, shorter, and easier to use.
                    </p>
                </div>
                <div className="feature-dashboard-header-actions">
                    <div className="feature-dashboard-meta">
                        <strong>{selectedCount}</strong>
                        <span>active modules</span>
                    </div>
                    {mobileSheet && onClose ? (
                        <button type="button" className="feature-sheet-close" onClick={onClose} aria-label="Close feature dashboard">
                            <X size={18} />
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="feature-preset-row">
                <button type="button" className="btn btn-secondary" onClick={() => onApplyPreset('minimal')}>
                    Minimal
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => onApplyPreset('essentials')}>
                    Essentials
                </button>
                <button type="button" className="btn btn-primary" onClick={() => onApplyPreset('all')}>
                    Enable All
                </button>
            </div>

            <div className="feature-grid">
                {features.map((feature) => {
                    const active = selectedFeatures.includes(feature.key);
                    const Icon = feature.icon;

                    return (
                        <button
                            key={feature.key}
                            type="button"
                            className={`feature-card ${active ? 'active' : ''}`}
                            onClick={() => onToggleFeature(feature.key)}
                        >
                            <div className={`feature-card-icon ${feature.tone}`}>
                                <Icon size={18} />
                            </div>
                            <div className="feature-card-copy">
                                <div className="feature-card-topline">
                                    <strong>{feature.label}</strong>
                                    <span className={`feature-status ${active ? 'active' : ''}`}>
                                        {active ? <Check size={13} /> : null}
                                        {active ? 'Shown' : 'Hidden'}
                                    </span>
                                </div>
                                <p>{feature.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
