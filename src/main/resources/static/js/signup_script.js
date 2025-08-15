// Modern Signup JavaScript
class ModernSignup {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.setupPasswordToggles();
    }

    bindEvents() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        nextBtn.addEventListener('click', () => this.handleNext());
        prevBtn.addEventListener('click', () => this.handlePrevious());
        
        // Enter key navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.currentStep <= this.totalSteps) {
                    this.handleNext();
                }
            }
        });

        // Real-time validation
        document.getElementById('fullName').addEventListener('input', () => this.validateStep(1));
        document.getElementById('email').addEventListener('input', () => this.validateStep(2));
        document.getElementById('password').addEventListener('input', () => {
            this.validateStep(3);
            this.updatePasswordStrength();
        });
        document.getElementById('confirmPassword').addEventListener('input', () => this.validateStep(3));
        document.getElementById('agreeTerms').addEventListener('change', () => this.validateStep(4));

        // Auto-focus current input
        this.focusCurrentInput();
    }

    setupPasswordToggles() {
        const passwordToggle = document.getElementById('passwordToggle');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        passwordToggle.addEventListener('click', () => {
            this.togglePasswordVisibility(passwordInput, passwordToggle);
        });

        confirmPasswordToggle.addEventListener('click', () => {
            this.togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
        });
    }

    togglePasswordVisibility(input, toggle) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        const icon = toggle.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }

    handleNext() {
        console.log('Current step:', this.currentStep);
    
        if (this.validateStep(this.currentStep)) {
            this.saveStepData();
            
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.focusCurrentInput();
                
                // Update button text for final step
                if (this.currentStep === this.totalSteps) {
                    document.getElementById('nextBtn').querySelector('.btn-text').textContent = 'Create Account';
                    this.showReview();
                }
            } else if (this.currentStep === this.totalSteps) {
                this.createAccount();
            }
        }
    }

    handlePrevious() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.focusCurrentInput();
            
            if (this.currentStep < 4) {
                document.getElementById('nextBtn').querySelector('.btn-text').textContent = 'Next';
            }
        }
    }

    validateStep(step) {
        const validators = {
            1: () => this.validateFullName(),
            2: () => this.validateEmail(),
            3: () => this.validatePassword() && this.validateConfirmPassword(),
            4: () => this.validateTerms()
        };

        if (!validators[step]) {
            console.error('Invalid step number:', step);
            return false;
        }

        const isValid = validators[step]();
        console.log(`Step ${step} validation result:`, isValid);
        
        return isValid;
    }

    validateFullName() {
        const input = document.getElementById('fullName');
        const error = document.getElementById('fullNameError');
        const value = input.value.trim();

        if (value.length < 2) {
            this.showError(input, error, 'Full name must be at least 2 characters long');
            return false;
        }

        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            this.showError(input, error, 'Full name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }

        this.clearError(input, error);
        return true;
    }

    validateEmail() {
        const input = document.getElementById('email');
        const error = document.getElementById('emailError');
        const value = input.value.trim();

        if (!value) {
            this.showError(input, error, 'Email is required');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.showError(input, error, 'Please enter a valid email address');
            return false;
        }

        this.clearError(input, error);
        return true;
    }

    validatePassword() {
        const input = document.getElementById('password');
        const error = document.getElementById('passwordError');
        const value = input.value;

        if (!value) {
            this.showError(input, error, 'Password is required');
            return false;
        }

        if (value.length < 8) {
            this.showError(input, error, 'Password must be at least 8 characters long');
            return false;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            this.showError(input, error, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
            return false;
        }

        this.clearError(input, error);
        return true;
    }

    validateConfirmPassword() {
        const input = document.getElementById('confirmPassword');
        const error = document.getElementById('confirmPasswordError');
        const password = document.getElementById('password').value;
        const value = input.value;

        if (!value) {
            this.showError(input, error, 'Please confirm your password');
            return false;
        }

        if (value !== password) {
            this.showError(input, error, 'Passwords do not match');
            return false;
        }

        this.clearError(input, error);
        return true;
    }

    validateTerms() {
        const checkbox = document.getElementById('agreeTerms');
        const error = document.getElementById('termsError');

        if (!checkbox.checked) {
            this.showError(checkbox, error, 'You must agree to the Terms of Service and Privacy Policy');
            return false;
        }

        this.clearError(checkbox, error);
        return true;
    }
    
    showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.classList.remove('show');
    }

    updatePasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthContainer = document.getElementById('passwordStrength');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (password.length === 0) {
            strengthContainer.classList.remove('show');
            return;
        }

        strengthContainer.classList.add('show');

        let strength = 0;
        let strengthLabel = 'Very Weak';
        let strengthColor = '#ef4444';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                strengthLabel = 'Very Weak';
                strengthColor = '#ef4444';
                break;
            case 2:
                strengthLabel = 'Weak';
                strengthColor = '#f97316';
                break;
            case 3:
                strengthLabel = 'Fair';
                strengthColor = '#eab308';
                break;
            case 4:
                strengthLabel = 'Good';
                strengthColor = '#22c55e';
                break;
            case 5:
                strengthLabel = 'Strong';
                strengthColor = '#16a34a';
                break;
        }

        strengthFill.style.width = `${(strength / 5) * 100}%`;
        strengthFill.style.background = strengthColor;
        strengthText.textContent = `Password strength: ${strengthLabel}`;
        strengthText.style.color = strengthColor;
    }

    saveStepData() {
        const stepData = {
            1: () => this.formData.fullName = document.getElementById('fullName').value.trim(),
            2: () => this.formData.email = document.getElementById('email').value.trim(),
            3: () => this.formData.password = document.getElementById('password').value,
        };

        if (stepData[this.currentStep]) {
            stepData[this.currentStep]();
        }
    }

    showStep(step) {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-step="${step}"]`).classList.add('active');

        const prevBtn = document.getElementById('prevBtn');
        const stepIndicator = document.getElementById('stepIndicator');

        prevBtn.style.display = step > 1 ? 'flex' : 'none';
        
        if (step <= this.totalSteps) {
            stepIndicator.textContent = `Step ${step} of ${this.totalSteps}`;
        } else {
            stepIndicator.textContent = 'Complete!';
        }
    }

    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    focusCurrentInput() {
        setTimeout(() => {
            const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
            const input = currentStepElement.querySelector('input');
            if (input) {
                input.focus();
            }
        }, 100);
    }

    showReview() {
        console.log('Showing review step');
    
        const reviewFullName = document.getElementById('reviewFullName');
        const reviewEmail = document.getElementById('reviewEmail');
        
        if (reviewFullName && reviewEmail) {
            reviewFullName.textContent = this.formData.fullName || '';
            reviewEmail.textContent = this.formData.email || '';
        } else {
            console.error('Review elements not found');
        }
    }

    async createAccount() {
        const nextBtn = document.getElementById('nextBtn');
        const originalText = nextBtn.querySelector('.btn-text').textContent;
        
        nextBtn.classList.add('loading');
        nextBtn.disabled = true;

        // Prepare the data according to your RegisterDTO structure
        const userData = {
            username: this.formData.fullName.toLowerCase().replace(/\s+/g, '_'), // Convert full name to username format
            email: this.formData.email,
            fullName: this.formData.fullName,
            password: this.formData.password,
            confirmPassword: this.formData.password,
            profilePicture: "", // Optional
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Show success step
            this.currentStep = 5;
            this.showStep(5);
            document.getElementById('successFullName').textContent = this.formData.fullName;
            document.querySelector('.button-group').style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            
            // Show success toast
            this.showToast('Account created successfully! Welcome to DevChat!', 'success');
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = 'Login.html';
            }, 3000);

        } catch (error) {
            // Handle errors
            nextBtn.classList.remove('loading');
            nextBtn.disabled = false;
            this.showToast('Registration failed: ' + error.message, 'error');
        }
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add toast styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
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
        }
        
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

    getToastIcon(type) {
        switch (type) {
            case 'error': return 'fa-exclamation-circle';
            case 'success': return 'fa-check-circle';
            default: return 'fa-info-circle';
        }
    }
}

// Initialize the modern signup
document.addEventListener('DOMContentLoaded', () => {
    new ModernSignup();
});