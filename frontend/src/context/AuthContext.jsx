import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('teamflow_token'));
  const [loading, setLoading] = useState(true);

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem('teamflow_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data.token, data.user);
    toast.success('Signed in');
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    toast.success('Account created');
    return data;
  };

  const registerOrganization = async (payload) => {
    const { data } = await api.post('/auth/register-organization', payload);
    toast.success('Organization created');
    return data;
  };

  const updateCurrentUser = useCallback((updates) => {
    setUser((current) => current ? { ...current, ...updates } : current);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('teamflow_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const restore = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (_error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, [logout, token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    signup,
    registerOrganization,
    updateCurrentUser,
    refreshUser,
    logout
  }), [loading, logout, refreshUser, token, updateCurrentUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
