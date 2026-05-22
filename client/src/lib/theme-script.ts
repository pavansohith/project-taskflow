/**
 * Inline script for layout <head> — runs before React hydrates to prevent theme flash.
 * Keep in sync with THEME_STORAGE_KEY in useTheme.ts.
 */
export const themeInitScript = `(function(){try{var k='taskflow-theme';var t=localStorage.getItem(k);var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
