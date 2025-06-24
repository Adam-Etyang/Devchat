import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnimations } from '../hooks/useAnimations';
import '../styles.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Initialize animations
  useAnimations();

  return (
    <>
      {/* Hero section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Collaborate Seamlessly with Devchat
          </h1>
          <p className="hero-description">
            Devchat is the all-in-one collaboration platform for software engineers. Chat in real time, manage projects with
            ease, and stay aligned with your team—from concept to deployment.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="mouse-icon">
            <div className="mouse-dot"></div>
          </div>
          <p className="scroll-text">Scroll to explore</p>
        </div>
      </section>

      {/* Call to action */}
      <section id="about" className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            Complete Projects <span id="typewriter" className="typewriter">Smarter</span>
          </h2>
          <p className="cta-description">
            Whether you're a startup team or open-source contributors, Devchat streamlines your workflow. Create tasks, track
            progress, and stay connected with built-in messaging and version control integration.
          </p>
          <div className="cta-buttons">
            {!user ? (
              <>
                <button onClick={() => navigate('/register')} className="btn-primary">Sign Up Now</button>
                <button onClick={() => navigate('/login')} className="btn-secondary">Learn More</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/chat')} className="btn-primary">Start Chatting</button>
                <button onClick={() => navigate('/projects')} className="btn-secondary">View Projects</button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sample events */}
      <section id="events" className="events-section">
        <div className="events-container">
          <h2 className="events-title">What can you do with Devchat</h2>
          <div className="events-grid">
            {/* Card 1 */}
            <div className="event-card-link" onClick={() => navigate('/chat')}>
              <div className="event-card">
                <div className="event-content">
                  <h3 className="event-title">Real time messaging</h3>
                  <p className="event-description">Communicate instantly with teammates. Share code snippets, run polls, and
                    organize conversations by topic or project.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="event-card-link" onClick={() => navigate('/projects')}>
              <div className="event-card">
                <div className="event-content">
                  <h3 className="event-title">Project management</h3>
                  <p className="event-description">Create tasks, set deadlines, assign responsibilities, and visualize progress
                    with Kanban-style boards.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="event-card-link">
              <div className="event-card">
                <div className="event-content">
                  <h3 className="event-title">Seamless integration with your current tools</h3>
                  <p className="event-description">Connect with GitHub, GitLab, or Bitbucket. Link commits to tasks and get
                    real-time deployment updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker carousel */}
      <section className="ticker-section">
        <div className="ticker-container">
          <h2 className="ticker-title">Trusted by these companies</h2>
          <div className="ticker-wrapper">
            <div className="ticker-content" id="ticker">
              {/* TODO: add ticker content here */}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <p className="footer-text">© 2025 Devchat. All rights reserved.</p>
          <p className="footer-links">
            Designed with care.
            <a href="#" className="footer-link">Privacy Policy</a> |
            <a href="#" className="footer-link">Terms of Service</a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home; 