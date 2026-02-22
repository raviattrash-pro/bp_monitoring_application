import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare } from 'lucide-react';

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstruction, setShowIOSInstruction] = useState(false);

    useEffect(() => {
        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // If it's iOS and not already standalone, show a "How to install" hint
        if (isIOSDevice && !window.matchMedia('(display-mode: standalone)').matches) {
            setShowButton(true);
        }

        // Hide if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowButton(false);
        }

        const installHandler = () => {
            setShowButton(false);
        };
        window.addEventListener('appinstalled', installHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installHandler);
        };
    }, []);

    const handleInstall = async () => {
        if (isIOS) {
            setShowIOSInstruction(!showIOSInstruction);
            return;
        }

        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowButton(false);
        }
        setDeferredPrompt(null);
    };

    if (!showButton) return null;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="install-btn"
                onClick={handleInstall}
                title="Install BP Dashboard App"
                style={{
                    background: isIOS ? 'rgba(255, 255, 255, 0.1)' : 'var(--gradient-success)',
                    border: isIOS ? '1px solid var(--border-glass)' : 'none'
                }}
            >
                <Download size={16} />
                <span className="install-text">{isIOS ? 'Install Help' : 'Install App'}</span>
            </button>

            {showIOSInstruction && (
                <div className="glass-card" style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '260px',
                    padding: '16px',
                    zIndex: 1000,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    animation: 'slideDown 0.3s ease'
                }}>
                    <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>To install on iPhone/iPad:</p>
                    <ol style={{ paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '8px' }}>Tap the <strong>Share</strong> button <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> at the bottom of Safari.</li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />.</li>
                    </ol>
                </div>
            )}
        </div>
    );
}
