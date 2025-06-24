import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSignupForm } from '../hooks/useSignupForm';
import '../signup_styles.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    passwordStrength,
    loading,
    setLoading,
    handleInputChange,
    nextStep,
    prevStep,
    validateStep,
    getProgressPercentage,
    getStepTitle,
    getStepDescription
  } = useSignupForm();

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === totalSteps) {
      setLoading(true);
      
      const userData = {
        firstName: formData.firstName,
        lastName: '', // You can add a lastName field if needed
        email: formData.email,
        password: formData.password
      };

      const result = await register(userData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        // Handle registration error
        console.error('Registration failed:', result.error);
      }
      
      setLoading(false);
    } else {
      nextStep();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step active">
            <h2>{getStepTitle()}</h2>
            <p>{getStepDescription()}</p>
            <div className="form-group">
              <label htmlFor="firstName">Enter your Name?</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Your name"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && (
                <div className="error-message show">{errors.firstName}</div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step active">
            <h2>{getStepTitle()}</h2>
            <p>{getStepDescription()}</p>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <div className="error-message show">{errors.email}</div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step active">
            <h2>{getStepTitle()}</h2>
            <p>{getStepDescription()}</p>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
              />
              {passwordStrength.show && (
                <div className="password-strength" style={{ display: 'block' }}>
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${(passwordStrength.level / 6) * 100}%`,
                        backgroundColor: passwordStrength.level <= 2 ? '#ff6b6b' : 
                                        passwordStrength.level <= 4 ? '#ffd93d' : '#6bcf7f'
                      }}
                    ></div>
                  </div>
                  <div className="strength-text">{passwordStrength.text}</div>
                </div>
              )}
              {errors.password && (
                <div className="error-message show">{errors.password}</div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step active">
            <h2>{getStepTitle()}</h2>
            <p>{getStepDescription()}</p>
            <div className="form-group">
              <div style={{ background: '#3d3d42', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <p><strong>Name:</strong> {formData.firstName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#b0b0b0' }}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      paddingTop: '6rem' // Account for navbar
    }}>
      <div className="signup-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="step-indicator">Step {currentStep} of {totalSteps}</div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="step-content">
            {renderStep()}
          </div>
          
          <div className="button-group">
            {currentStep > 1 && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 
               currentStep === totalSteps ? 'Create Account' : 'Next'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#cc81ff',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 