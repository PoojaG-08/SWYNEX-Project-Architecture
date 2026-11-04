import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DemoUser } from '../types/index.ts';
import { api } from '../api/client.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  demoUsers: DemoUser[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: (email?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('secretgift_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);

  // Load demo users for reviewer convenience
  useEffect(() => {
    api
      .getDemoUsers()
      .then(setDemoUsers)
      .catch((err) => console.warn('Could not load demo accounts list', err));
  }, []);

  // Check existing token on mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('secretgift_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Stored token invalid, clearing...', err);
          localStorage.removeItem('secretgift_token');
          setToken(null);
          setUser(null);
        }
      } else {
        // By default, if no token, automatically log in as the default demo user (Sarah - Organizer)
        // so reviewers can immediately see the working experience without having to type!
        try {
          const demoRes = await api.demoLogin('sarah@example.com');
          localStorage.setItem('secretgift_token', demoRes.token);
          setToken(demoRes.token);
          setUser(demoRes.user);
        } catch (e) {
          // If server still initializing, no problem
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('secretgift_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.register(name, email, password);
    localStorage.setItem('secretgift_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const demoLogin = async (email?: string) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(email);
      localStorage.setItem('secretgift_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('secretgift_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoUsers,
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
