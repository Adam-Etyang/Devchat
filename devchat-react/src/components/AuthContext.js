import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('devchat_user');
    const token = localStorage.getItem('devchat_token');
    if (userData && token) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise((res) => setTimeout(res, 500));
    const userObj = { id: Date.now(), name: 'Test User', email };
    setUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('devchat_user', JSON.stringify(userObj));
    localStorage.setItem('devchat_token', 'mock_jwt_token');
    return true;
  };

  const signup = async (name, email, password) => {
    // Simulate API call
    await new Promise((res) => setTimeout(res, 500));
    const userObj = { id: Date.now(), name, email };
    setUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem('devchat_user', JSON.stringify(userObj));
    localStorage.setItem('devchat_token', 'mock_jwt_token');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('devchat_user');
    localStorage.removeItem('devchat_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 