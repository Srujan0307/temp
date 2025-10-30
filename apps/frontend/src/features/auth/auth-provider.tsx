import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthContext } from '@/features/auth/auth-context';
import { authTokenStorage } from '@/lib/auth-token';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() =>
    authTokenStorage.get(),
  );

  useEffect(() => {
    authTokenStorage.persist(token);
  }, [token]);

  useEffect(() => {
    const unsubscribe = authTokenStorage.subscribeToLogout(() => {
      setToken(null);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback((nextToken: string) => {
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    authTokenStorage.clearAndNotify();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
