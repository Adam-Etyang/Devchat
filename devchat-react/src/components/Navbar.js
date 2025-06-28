import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <i className="fas fa-code"></i>
          <span>DevChat</span>
        </div>
        <div className="nav-menu" id="nav-menu">
          <button className="nav-link" onClick={() => navigate('/')}>Home</button>
          <button className="nav-link" onClick={() => navigate('/chat')}>Chat</button>
          <button className="nav-link" onClick={() => navigate('/settings')}>Settings</button>
          {!isAuthenticated ? (
            <div className="nav-auth" id="nav-auth">
              <button className="nav-link" onClick={() => navigate('/signin')}>Sign In</button>
              <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          ) : (
            <div className="nav-user" id="nav-user">
              <div className="user-profile">
                <img src={user?.avatar || 'https://via.placeholder.com/32'} alt="User" className="user-avatar" />
                <span className="user-name">{user?.displayName || user?.name || 'User'}</span>
              </div>
              <button className="btn btn-secondary" id="logout-btn" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
        <div className="nav-toggle" id="nav-toggle" style={{ display: 'none' }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 