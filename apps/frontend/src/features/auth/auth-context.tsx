import { createContext, ReactNode, useCallback, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  token?: string | null;
  refreshToken?: string | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refreshToken'),
  );

  const isAuthenticated = !!token;

  const login = useCallback((newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, token, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};