import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, NavigationPage, isPageAllowedForRole, PAGE_TITLES } from '../types';
import { INITIAL_USERS } from '../mockData';

export interface DemoAccount {
  username: string;
  password: string;
  role: UserRole;
  user: User;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN',
    user: INITIAL_USERS[0], // Dr. Evelyn Vance
    description: 'Hospital Administrator • Full access to all 12 modules including Users & Settings',
  },
  {
    username: 'manager',
    password: 'manager123',
    role: 'WASTE_MANAGER',
    user: INITIAL_USERS[1], // Marcus Brody
    description: 'Waste Manager • Access to 10 operational modules (restricted: Users, Settings)',
  },
  {
    username: 'staff',
    password: 'staff123',
    role: 'STAFF',
    user: INITIAL_USERS[2], // Nurse Priya Sharma
    description: 'Clinical Staff • Access to 8 ward & collection modules (restricted: Analytics, Logs, Users, Settings)',
  },
];

const AUTH_STORAGE_KEY = 'medi_sort_auth_session';

export interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User;
  username: string;
  role: UserRole;
  accessDeniedMessage: string | null;
  login: (userStr: string, passStr: string) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  setCurrentUser: (user: User) => void;
  setAccessDeniedMessage: (msg: string | null) => void;
  clearAccessDeniedMessage: () => void;
  checkPageAccess: (page: NavigationPage) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read persisted session from localStorage synchronously on initial mount
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.username && parsed.role) {
          return true;
        }
      }
    } catch {
      // Ignore parse error
    }
    return false;
  });

  const [username, setUsername] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.username) return parsed.username;
      }
    } catch {
      // Ignore
    }
    return '';
  });

  const [role, setRole] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role) return parsed.role;
      }
    } catch {
      // Ignore
    }
    return 'ADMIN';
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user) return parsed.user;
        const matched = DEMO_ACCOUNTS.find((a) => a.username === parsed.username);
        if (matched) return matched.user;
      }
    } catch {
      // Ignore
    }
    return INITIAL_USERS[0];
  });

  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Auto-dismiss access denied alert after 5 seconds
  useEffect(() => {
    if (!accessDeniedMessage) return;
    const timer = setTimeout(() => {
      setAccessDeniedMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [accessDeniedMessage]);

  const clearAccessDeniedMessage = useCallback(() => {
    setAccessDeniedMessage(null);
  }, []);

  const login = useCallback(
    (userStr: string, passStr: string): { success: boolean; error?: string } => {
      const trimmedUser = userStr.trim().toLowerCase();
      const trimmedPass = passStr.trim();

      const account = DEMO_ACCOUNTS.find(
        (acc) =>
          acc.username.toLowerCase() === trimmedUser &&
          acc.password === trimmedPass
      );

      if (!account) {
        return {
          success: false,
          error: 'Invalid credentials. Please enter a valid username and password (e.g. admin / admin123).',
        };
      }

      // Successful authentication
      setIsAuthenticated(true);
      setUsername(account.username);
      setRole(account.role);
      setCurrentUserState(account.user);
      setAccessDeniedMessage(null);

      // Persist in localStorage
      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            username: account.username,
            role: account.role,
            user: account.user,
            loginAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.error('Failed to persist auth session to localStorage:', e);
      }

      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove auth session from localStorage:', e);
    }

    setIsAuthenticated(false);
    setUsername('');
    setRole('ADMIN');
    setCurrentUserState(INITIAL_USERS[0]);
    setAccessDeniedMessage(null);

    // Prevent immediate browser-back traversal
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState(null, '', window.location.href);
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === newRole);
    const targetUser = account ? account.user : INITIAL_USERS.find((u) => u.role === newRole) || INITIAL_USERS[0];
    const newUsername = account ? account.username : targetUser.username || targetUser.name.toLowerCase().replace(/[^a-z]/g, '');

    setRole(newRole);
    setUsername(newUsername);
    setCurrentUserState(targetUser);

    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          username: newUsername,
          role: newRole,
          user: targetUser,
          loginAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error('Failed to update auth session on role switch:', e);
    }
  }, []);

  const setCurrentUser = useCallback(
    (newUser: User) => {
      setCurrentUserState(newUser);
      setRole(newUser.role);
      const newUsername = newUser.username || newUser.name.toLowerCase().replace(/[^a-z]/g, '');
      setUsername(newUsername);

      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            username: newUsername,
            role: newUser.role,
            user: newUser,
            loginAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.error('Failed to update auth session on setCurrentUser:', e);
      }
    },
    []
  );

  const checkPageAccess = useCallback(
    (page: NavigationPage): boolean => {
      if (!isAuthenticated) return false;
      return isPageAllowedForRole(page, role);
    },
    [isAuthenticated, role]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        username,
        role,
        accessDeniedMessage,
        login,
        logout,
        switchRole,
        setCurrentUser,
        setAccessDeniedMessage,
        clearAccessDeniedMessage,
        checkPageAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
