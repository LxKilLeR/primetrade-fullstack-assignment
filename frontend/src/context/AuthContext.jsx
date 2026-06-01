import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const normalizeAuthUser = (authData) => {
  if (!authData) {
    return null;
  }

  if (authData.user) {
    return authData.user;
  }

  return {
    id: authData.id,
    name: authData.name,
    email: authData.email,
    role: authData.role
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/profile');
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [token]);

  const login = (data) => {
    const tokenValue = data?.token;
    const userValue = normalizeAuthUser(data);

    setToken(tokenValue || '');
    setUser(userValue);

    if (tokenValue) {
      localStorage.setItem('token', tokenValue);
    }

    if (userValue) {
      localStorage.setItem('user', JSON.stringify(userValue));
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
