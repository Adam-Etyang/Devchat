import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo on the left */}
          <div className="logo">
            <a href="#home" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Devchat</a>
          </div>

          {/* Navigation links in the center */}
          <div className="nav-links">
            <a href="#about" className="nav-link">
              About
              <span className="nav-underline"></span>
            </a>
            <a href="#events" className="nav-link">
              Features
              <span className="nav-underline"></span>
            </a>
            <a href="#Explore" className="nav-link">
              Explore
              <span className="nav-underline"></span>
            </a>
          </div>

          {/* Auth buttons on the right */}
          <div className="auth-buttons">
            {user ? (
              <>
                <button onClick={() => navigate('/chat')} className="btn-login">Chat</button>
                <button onClick={handleLogout} className="btn-signup">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-login">Login</button>
                <button onClick={() => navigate('/register')} className="btn-signup">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 