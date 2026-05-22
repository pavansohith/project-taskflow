const STORAGE_KEY = "tf_session";

let memoryToken: string | null = null;

export const tokenStore = {
  get: (): string | null => {
    if (memoryToken) return memoryToken;
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },

  set: (token: string) => {
    memoryToken = token;
    try {
      sessionStorage.setItem(STORAGE_KEY, token);
    } catch {
      /* sessionStorage unavailable (e.g. strict private browsing) */
    }
  },

  clear: () => {
    memoryToken = null;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};
