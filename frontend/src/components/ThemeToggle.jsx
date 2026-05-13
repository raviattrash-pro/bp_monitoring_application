import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ compact = false, iconOnly = false }) {
    const { isDarkMode, toggleTheme } = useTheme();

    if (iconOnly) {
        return (
            <button
                type="button"
                className="theme-icon-btn"
                onClick={toggleTheme}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDarkMode ? <Moon size={18} /> : <SunMedium size={18} />}
            </button>
        );
    }

    return (
        <button
            type="button"
            className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span className="theme-toggle-track">
                <span className={`theme-toggle-thumb ${isDarkMode ? 'dark' : 'light'}`}>
                    {isDarkMode ? <Moon size={14} /> : <SunMedium size={14} />}
                </span>
            </span>
            <span className="theme-toggle-label">
                {isDarkMode ? 'Night mode' : 'Day mode'}
            </span>
        </button>
    );
}
