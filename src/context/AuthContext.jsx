
import React, { createContext, useContext, useEffect, useState } from 'react';

// Admin credentials
const ADMIN_USERNAME = 'momlogin';
const ADMIN_PASSWORD = 'stayStrong';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    // Check if admin
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser = {
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
    const foundUser = users.find((u) => 
      u.username === username && u.password === password
    );

    if (foundUser) {
      const loggedInUser = {
        id: foundUser.id,
        username: foundUser.username,
        isAdmin: false,
        phoneNumber: foundUser.phoneNumber || '',
      };
      setUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      return true;
    }

    return false;
  };

  const register = (username, password, phoneNumber) => {
    // Cannot register with admin username
    if (username === ADMIN_USERNAME) {
      return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some((u) => u.username === username)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      password,
      phoneNumber,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const loggedInUser = {
      id: newUser.id,
      username: newUser.username,
      isAdmin: false,
      phoneNumber: newUser.phoneNumber || '',
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
