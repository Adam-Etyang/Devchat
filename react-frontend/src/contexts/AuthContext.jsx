import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Unified authentication action for login and register
  const authAction = async (mode, data) => {
    let url = '';
    let payload = {};
    if (mode === 'login') {
      url = 'http://localhost:8080/api/auth/login';
      payload = {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      };
    } else if (mode === 'register') {
      url = 'http://localhost:8080/api/auth/signup';
      payload = {
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        confirmPassword: data.confirmPassword,
        profilePicture: data.profilePicture || '',
      };
    } else {
      return { success: false, error: 'Invalid auth mode' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // For login/register, expect AuthresponseDTO: { token, tokenType, userProfile, expiresIn }
        const resData = await response.json();
        setToken(resData.token);
        setUser(resData.userProfile);
        localStorage.setItem('token', resData.token);
        return { success: true };
      } else {
        // Try to parse error message
        let errorMsg = 'Unknown error';
        try {
          const error = await response.json();
          errorMsg = error.message || JSON.stringify(error);
        } catch (e) {}
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Convenience wrappers
  const login = (data) => authAction('login', data);
  const register = (data) => authAction('register', data);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 