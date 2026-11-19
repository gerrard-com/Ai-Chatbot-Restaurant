import { useEffect, useState } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Escape to close, focus moves in on open and returns to the trigger on close.
// With trap=true, Tab cycles inside the container (for modal dialogs).
export function useDialog({ open, onClose, containerRef, initialRef, trap = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    (initialRef?.current || containerRef.current)?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (trap && e.key === 'Tab' && containerRef.current) {
        const items = [...containerRef.current.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#100E18' : '#181222');
    try {
      localStorage.setItem('etoile-theme', theme);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}
