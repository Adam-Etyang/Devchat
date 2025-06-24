import { useState } from 'react';

export const useSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ show: false, level: 0, text: '' });
  const [loading, setLoading] = useState(false);
  const totalSteps = 5;

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1: // Username
        if (!formData.username.trim()) {
          newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username.trim())) {
          newErrors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
        }
        break;
      case 2: // Full Name
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3 || formData.fullName.trim().length > 50) {
          newErrors.fullName = 'Full name must be between 3 and 50 characters';
        }
        break;
      case 3: // Email
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        } else if (formData.email.trim().length > 50) {
          newErrors.email = 'Email must be less than 50 characters';
        }
        break;
      case 4: // Password
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/.test(formData.password)
        ) {
          newErrors.password =
            'Password must be 6-20 chars, include uppercase, lowercase, digit, and special character';
        }
        break;
      case 5: // Confirm Password
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
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
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
      case 1: return 'Choose a Username';
      case 2: return 'Your Full Name';
      case 3: return 'Contact Information';
      case 4: return 'Create a Password';
      case 5: return 'Confirm Password';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Pick a unique username for your account.';
      case 2: return 'Enter your full name.';
      case 3: return 'We need your email address to keep in touch and secure your account.';
      case 4: return 'Choose a strong password to keep your account safe.';
      case 5: return 'Please confirm your password.';
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