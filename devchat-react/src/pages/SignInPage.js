import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      window.showToast('Sign in successful!', 'success');
      navigate('/chat');
    } catch (err) {
      window.showToast('Sign in failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signin-page" className="page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Sign In</h2>
          <form id="signin-form" className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signin-email">Email</label>
              <input type="email" id="signin-email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="signin-password">Password</label>
              <input type="password" id="signin-password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <div className="oauth-section">
            <button className="btn btn-full btn-google" type="button" onClick={() => window.showToast('Google sign-in coming soon', 'info')}>
              <i className="fab fa-google"></i> Sign in with Google
            </button>
            <button className="btn btn-full btn-github" type="button" onClick={() => window.showToast('GitHub sign-in coming soon', 'info')}>
              <i className="fab fa-github"></i> Sign in with GitHub
            </button>
          </div>
          <p className="auth-link">
            Don't have an account? <button className="btn btn-link" type="button" onClick={() => navigate('/signup')}>Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 