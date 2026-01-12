import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      setToken(data.access_token);
      // Note: In a real app, you'd decode the JWT to get user info
      // For now, we'll fetch user data after login
      setUser({ email });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      const data = await authAPI.signup(email, password);
      // Auto-login after signup
      const loginData = await authAPI.login(email, password);
      setToken(loginData.access_token);
      setUser({ email });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

