/**
 * Inline script for layout <head> — runs before React hydrates to prevent theme flash.
 * Keep in sync with STORAGE_KEYS.theme / useTheme.ts.
 */
export const themeInitScript = `(function(){try{var k='taskflow-theme';var t=localStorage.getItem(k);var d=false;if(t==='dark')d=true;else if(t==='light')d=false;else d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
