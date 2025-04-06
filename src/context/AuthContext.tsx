
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string) => {
    // Check if admin
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-1',
        username: ADMIN_USERNAME,
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    // Check if regular user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: { username: string; password: string }) => 
      u.username === username && u.password === password
    );

    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        isAdmin: false,
      };
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      return true;
    }

    return false;
  };

  const register = (username: string, password: string) => {
    // Cannot register with admin username
    if (username === ADMIN_USERNAME) {
      return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some((u: { username: string }) => u.username === username)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      password,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const loggedInUser: User = {
      id: newUser.id,
      username: newUser.username,
      isAdmin: false,
    };
    
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
