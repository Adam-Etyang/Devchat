import { useState, useEffect } from 'react';

export const useSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ show: false, level: 0, text: '' });
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (formData.firstName.trim().length < 2) {
          newErrors.firstName = 'Name must be at least 2 characters long';
        }
        if (!/^[a-zA-Z0-9\s'-]+$/.test(formData.firstName.trim())) {
          newErrors.firstName = 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes';
        }
        break;
      case 2:
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 3:
        if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength({ show: false, level: 0, text: '' });
      return;
    }

    let strength = 0;
    let text = '';

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    // Determine strength level and text
    if (strength <= 2) {
      text = 'Weak';
    } else if (strength <= 4) {
      text = 'Fair';
    } else if (strength <= 6) {
      text = 'Good';
    } else {
      text = 'Strong';
    }

    setPasswordStrength({ show: true, level: strength, text });
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update password strength
    if (name === 'password') {
      updatePasswordStrength(value);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Welcome!';
      case 2: return 'Contact Information';
      case 3: return 'Secure Your Account';
      case 4: return 'Almost Done!';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Let's create your account. We'll guide you through each step to make this as easy as possible.";
      case 2: return "We'll need your email address to keep in touch and secure your account.";
      case 3: return "Choose a strong password to keep your account safe.";
      case 4: return "Let's review your information before creating your account.";
      default: return '';
    }
  };

  return {
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
  };
}; 