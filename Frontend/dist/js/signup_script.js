// Procedural Signup JavaScript Code
// This code implements a multi-step signup form with real-time validation, password strength indicator, and procedural navigation.
//the class ProceduralSignup handles the signup process, including form validation, step navigation, and account creation.

class ProceduralSignup {
    // This class handles the procedural signup process
    // It includes methods for initializing the form, handling step navigation, validating inputs, and creating an account.
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        
        this.init();
    }
// Initializes the signup process
// Binds event listeners for navigation buttons and input validation
    init() {
        this.bindEvents();
        this.updateProgress();
    }
// Binds event listeners for the next and previous buttons, input validation, and keyboard navigation
// It also sets up real-time validation for the input fields and auto-focuses the current input field.
    bindEvents() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const form = document.getElementById('signupForm');

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
        document.getElementById('orgName').addEventListener('input', () => this.validateStep(1));
        document.getElementById('email').addEventListener('input', () => this.validateStep(2));
        document.getElementById('password').addEventListener('input', () => {
            this.validateStep(3);
            this.updatePasswordStrength();
        });


        // Auto-focus current input
        this.focusCurrentInput();
    }

   // Handles the next button click event
    // Validates the current step, saves the data, and navigates to the next step or creates the account if on the last step

    handleNext() {
        console.log('Current step:', this.currentStep); // Add debug logging
    
        if (this.validateStep(this.currentStep)) {
            this.saveStepData();
            
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.focusCurrentInput();
                
                // Update button text for final step
                if (this.currentStep === this.totalSteps) {
                    document.getElementById('nextBtn').textContent = 'Create Account';
                    this.showReview();
                }
            } else if (this.currentStep === this.totalSteps) {
                this.createAccount();
            }
        }
    }
// Handles the previous button click event
    // Navigates back to the previous step, updates the progress, and focuses the current input field
    // It also updates the button text if necessary.


    handlePrevious() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.focusCurrentInput();
            
            if (this.currentStep < 4) {
                document.getElementById('nextBtn').textContent = 'Next';
            }
        }
    }

    validateStep(step) {
        const validators = {
            1: () => this.validateOrgName(),
            2: () => this.validateEmail(),
            3: () => this.validatePassword(),
            4: () => true // Review step should always return true
        };

        if (!validators[step]) {
            console.error('Invalid step number:', step);
            return false;
        }

        const isValid = validators[step]();
        
        // Debug logging
        console.log(`Step ${step} validation result:`, isValid);
        
        return isValid;
    }
// Validates the organization name input
// Checks if the name is at least 2 characters long and contains only valid characters
    // Displays error messages if validation fails and clears them if validation passes
    validateOrgName() {
        const input = document.getElementById('orgName');
        const error = document.getElementById('orgNameError');
        const value = input.value.trim();

        if (value.length < 2) {
            this.showError(input, error, 'Organization name must be at least 2 characters long');
            return false;
        }

        if (!/^[a-zA-Z0-9\s'-]+$/.test(value)) {
            this.showError(input, error, 'Organization name can only contain letters, numbers, spaces, hyphens, and apostrophes');
            return false;
        }

        this.clearError(input, error);
        return true;
    }
// Validates the email input
// Checks if the email format is valid using a regular expression
    // Displays error messages if validation fails and clears them if validation passes
    validateEmail() {
        const input = document.getElementById('email');
        const error = document.getElementById('emailError');
        const value = input.value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.showError(input, error, 'Please enter a valid email address');
            return false;
        }

        this.clearError(input, error);
        return true;
    }
// Validates the password input
// Checks if the password is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number
    // Displays error messages if validation fails and clears them if validation passes
    validatePassword() {
        const input = document.getElementById('password');
        const error = document.getElementById('passwordError');
        const value = input.value;

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
    
// Displays an error message for the input field
// Adds an error class to the input and shows the error message in the specified error element
    // Clears the error message if validation passes
showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
// Clears the error message for the input field
// Removes the error class from the input and hides the error message in the specified error element
    // This method is called when the input passes validation
    clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.classList.remove('show');
    }
// Updates the password strength indicator based on the current password input
// It calculates the strength based on length, character variety, and displays the strength level with a color-coded bar
    updatePasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthContainer = document.getElementById('passwordStrength');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (password.length === 0) {
            strengthContainer.style.display = 'none';
            return;
        }

        strengthContainer.style.display = 'block';

        let strength = 0;
        let strengthLabel = 'Very Weak';
        let strengthColor = '#dc2626';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                strengthLabel = 'Very Weak';
                strengthColor = '#dc2626';
                break;
            case 2:
                strengthLabel = 'Weak';
                strengthColor = '#ea580c';
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
            1: () => this.formData.orgName = document.getElementById('orgName').value.trim(),
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

        prevBtn.style.display = step > 1 ? 'block' : 'none';
        
        if (step <= this.totalSteps) {
            stepIndicator.textContent = `Step ${step} of ${this.totalSteps}`;
        } else {
            stepIndicator.textContent = 'Complete!';
        }
    }

    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
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
        // Add console.log to verify this is being called
    console.log('Showing review step');
    
    const reviewOrgName = document.getElementById('reviewOrgName');
    const reviewEmail = document.getElementById('reviewEmail');
    
    if (reviewOrgName && reviewEmail) {
        reviewOrgName.textContent = this.formData.orgName || '';
        reviewEmail.textContent = this.formData.email || '';
    } else {
        console.error('Review elements not found');
    }
    }

    async createAccount() {
        const nextBtn = document.getElementById('nextBtn');
        const originalText = nextBtn.textContent;
        
        nextBtn.textContent = 'Creating Account...';
        nextBtn.disabled = true;

        // Prepare the data according to your RegisterDTO structure
        const userData = {
            username: this.formData.orgName.toLowerCase().replace(/\s+/g, '_'), // Convert org name to username format
            email: this.formData.email,
            fullName: this.formData.orgName,
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
                throw new Error(data.message || 'Registration failed');
            }

            // Show success step
            this.currentStep = 5;
            this.showStep(5);
            document.getElementById('successOrgName').textContent = this.formData.orgName;
            document.querySelector('.button-group').style.display = 'none';
            document.querySelector('.progress-bar').style.display = 'none';
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            // Handle errors
            nextBtn.textContent = originalText;
            nextBtn.disabled = false;
            alert('Registration failed: ' + error.message);
        }
    }
}

// Initialize the procedural signup
document.addEventListener('DOMContentLoaded', () => {
    new ProceduralSignup();
    
});