import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div id="index-page" className="page active">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Code Together, Build Better</h1>
          <p className="hero-subtitle">A collaborative platform for developers to share, discuss, and iterate on code in real time</p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/chat')}>Start Collaborating</button>
          </div>
        </div>
        <div className="hero-image">
          <i className="fas fa-robot"></i>
        </div>
      </div>
      <div className="features-section">
        <h2>Everything you need to collaborate</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-bolt"></i>
            <h3>Lightning Fast</h3>
            <p>Get instant responses to your programming questions</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-code"></i>
            <h3>Code Generation</h3>
            <p>Generate code snippets and complete functions</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-bug"></i>
            <h3>Debug Help</h3>
            <p>Get help debugging and fixing your code</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 