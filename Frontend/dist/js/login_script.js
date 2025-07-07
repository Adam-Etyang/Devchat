document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const passwordToggle = document.getElementById('passwordToggle');
  const passwordInput = document.getElementById('loginPassword');
  const emailInput = document.getElementById('loginEmail');

  // Password toggle functionality
  passwordToggle.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = passwordToggle.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  });

  // Real-time validation
  emailInput.addEventListener('input', () => validateEmail());
  passwordInput.addEventListener('input', () => validatePassword());

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoadingState(true);

    try {
      const loginData = {
        emailOrUsername: emailInput.value.trim(),
        password: passwordInput.value
      };

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

              if (!response.ok) {
          throw new Error(data.error || 'Login failed. Please check your credentials.');
        }

      // Store user data
      localStorage.setItem('userId', data.userProfile.id);
      localStorage.setItem('username', data.userProfile.username);
      localStorage.setItem('email', data.userProfile.email);
      localStorage.setItem('fullName', data.userProfile.fullName);
      localStorage.setItem('token', data.token || '');
      
      // Store remember me preference
      const rememberMe = document.getElementById('rememberMe').checked;
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // Show success state
      showSuccessState();
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);

    } catch (error) {
      showErrorState(error.message);
      console.error('Login error:', error);
    } finally {
      setLoadingState(false);
    }
  });

  // Validation functions
  function validateForm() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    return isEmailValid && isPasswordValid;
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const emailError = document.getElementById('loginEmailError');
    
    if (!email) {
      showFieldError(emailInput, emailError, 'Email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(emailInput, emailError, 'Please enter a valid email address');
      return false;
    }
    
    clearFieldError(emailInput, emailError);
    return true;
  }

  function validatePassword() {
    const password = passwordInput.value;
    const passwordError = document.getElementById('loginPasswordError');
    
    if (!password) {
      showFieldError(passwordInput, passwordError, 'Password is required');
      return false;
    }
    
    if (password.length < 6) {
      showFieldError(passwordInput, passwordError, 'Password must be at least 6 characters long');
      return false;
    }
    
    clearFieldError(passwordInput, passwordError);
    return true;
  }

  function showFieldError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  function clearFieldError(input, errorElement) {
    input.classList.remove('error');
    errorElement.classList.remove('show');
  }

  // UI state management
  function setLoadingState(loading) {
    if (loading) {
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;
    } else {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
    }
  }

  function showSuccessState() {
    loginBtn.classList.remove('error');
    loginBtn.classList.add('success');
    loginBtn.querySelector('.btn-text').textContent = 'Welcome!';
  }

  function showErrorState(message) {
    loginBtn.classList.remove('success');
    loginBtn.classList.add('error');
    loginBtn.querySelector('.btn-text').textContent = 'Try Again';
    
    // Show error toast
    showToast(message, 'error');
  }

  // Toast notification system
  function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas ${getToastIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #667eea;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
      }
      
      .toast-error {
        border-left-color: #ef4444;
      }
      
      .toast-success {
        border-left-color: #10b981;
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }
      
      .toast-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.3s ease;
      }
      
      .toast-close:hover {
        color: #6b7280;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);

    // Close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });
  }

  function getToastIcon(type) {
    switch (type) {
      case 'error': return 'fa-exclamation-circle';
      case 'success': return 'fa-check-circle';
      default: return 'fa-info-circle';
    }
  }

  // Check for remembered login
  function checkRememberedLogin() {
    const remembered = localStorage.getItem('rememberMe');
    if (remembered === 'true') {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('rememberMe').checked = true;
      }
    }
  }

  // Initialize
  checkRememberedLogin();
  
  // Focus on email input on page load
  emailInput.focus();
});
