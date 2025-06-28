import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      window.showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      window.showToast('Account created!', 'success');
      navigate('/chat');
    } catch (err) {
      window.showToast('Sign up failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-page" className="page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <form id="signup-form" className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input type="text" id="signup-name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input type="email" id="signup-email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input type="password" id="signup-password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input type="password" id="signup-confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <p className="auth-link">
            Already have an account? <button className="btn btn-link" type="button" onClick={() => navigate('/signin')}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 