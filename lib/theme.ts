export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'adi-theme';

/**
 * Theme lives on <html data-theme> — the same hook the design system's light
 * palette keys off. It is exposed as an external store rather than React state
 * so the inline boot script below can set it before first paint (no flash) and
 * hydration still lines up.
 */
export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem('${STORAGE_KEY}');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){}`;

const listeners = new Set<() => void>();

export function subscribeTheme(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/** Dark is primary; light is the extrapolated theme flagged in the handoff. */
export const getServerTheme = (): Theme => 'dark';

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing — the theme just won't persist.
  }
  listeners.forEach((l) => l());
}
