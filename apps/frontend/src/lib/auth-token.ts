const AUTH_TOKEN_KEY = 'app.authToken';
const LOGOUT_EVENT = 'auth:logout';

const isBrowser = typeof window !== 'undefined';

const read = (): string | null => {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

const write = (token: string | null) => {
  if (!isBrowser) {
    return;
  }

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

const notifyLogout = () => {
  if (!isBrowser) {
    return;
  }

  window.dispatchEvent(new CustomEvent(LOGOUT_EVENT));
};

export const authTokenStorage = {
  get: read,
  set: (token: string) => write(token),
  remove: () => write(null),
  persist: write,
  clearAndNotify: () => {
    write(null);
    notifyLogout();
  },
  subscribeToLogout: (callback: () => void) => {
    if (!isBrowser) {
      return () => undefined;
    }

    window.addEventListener(LOGOUT_EVENT, callback);

    return () => window.removeEventListener(LOGOUT_EVENT, callback);
  },
};
