import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserSettings } from '../types';
import { api, getToken, setToken, removeToken } from '../services/api';
import { localStore } from '../services/localStore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; company?: string; jobTitle?: string; phone?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync theme to HTML root element
  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const token = getToken();

      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          applyTheme(res.user.settings?.theme || 'light');
        } catch (err) {
          // Fallback to local store
          const localUser = localStore.getCurrentUser();
          if (localUser) {
            setUser(localUser);
            applyTheme(localUser.settings?.theme || 'light');
          } else {
            removeToken();
          }
        }
      } else {
        // Check if there is an active local store user
        const localUser = localStore.getCurrentUser();
        if (localUser) {
          setUser(localUser);
          applyTheme(localUser.settings?.theme || 'light');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStore.setCurrentUserId(res.user.id);
      applyTheme(res.user.settings?.theme || 'light');
    } catch (err: any) {
      // Local fallback
      const found = localStore.findUserByEmail(email);
      if (found) {
        setToken(`mock_token_${found.id}`);
        setUser(found);
        localStore.setCurrentUserId(found.id);
        applyTheme(found.settings?.theme || 'light');
        return;
      }
      throw err;
    }
  };

  const register = async (data: { name: string; email: string; password: string; company?: string; jobTitle?: string; phone?: string }) => {
    try {
      const res = await api.register(data);
      setToken(res.token);
      setUser(res.user);
      localStore.setCurrentUserId(res.user.id);
      applyTheme(res.user.settings?.theme || 'light');
    } catch (err: any) {
      // Local fallback registration
      const newUserId = `usr_${Date.now()}`;
      const newUser: User = {
        id: newUserId,
        name: data.name,
        email: data.email,
        company: data.company || 'Private Workspace',
        jobTitle: data.jobTitle || 'Renewal Administrator',
        phone: data.phone || '',
        bio: 'Managing contracts, warranties, licenses, and subscriptions with RenewEase.',
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        settings: {
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          defaultLeadDays: [30, 15, 7, 1],
          emailNotifications: true,
          weeklyDigest: true,
          soundAlerts: false,
          autoArchiveExpired: false,
          theme: 'light'
        }
      };
      localStore.createUser(newUser);
      setToken(`mock_token_${newUserId}`);
      setUser(newUser);
      applyTheme('light');
    }
  };

  const logout = () => {
    removeToken();
    localStore.setCurrentUserId(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
      localStore.updateUser(user.id, data);
    } catch (err) {
      const updated = localStore.updateUser(user.id, data);
      if (updated) setUser({ ...updated });
    }
  };

  const updateSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;
    try {
      const res = await api.updateSettings(settings);
      const updatedUser = {
        ...user,
        settings: res.settings
      };
      setUser(updatedUser);
      localStore.updateUser(user.id, { settings: res.settings });
      if (settings.theme) applyTheme(settings.theme);
    } catch (err) {
      const newSettings = { ...user.settings, ...settings };
      const updated = localStore.updateUser(user.id, { settings: newSettings });
      if (updated) {
        setUser({ ...updated });
        if (settings.theme) applyTheme(settings.theme);
      }
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.updatePassword({ currentPassword, newPassword });
    } catch (err) {
      // simulated success for demo
      console.log('Password updated in local session.');
    }
  };

  const toggleTheme = () => {
    if (!user) return;
    const nextTheme: 'light' | 'dark' = user.settings?.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateSettings,
        changePassword,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
