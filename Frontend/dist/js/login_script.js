document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');

    let isValid = true;

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('error');
      emailError.textContent = 'Please enter a valid email address';
      emailError.classList.add('show');
      isValid = false;
    } else {
      email.classList.remove('error');
      emailError.classList.remove('show');
    }

    // Password validation
    
    if (password.value.trim().length < 8) {
      password.classList.add('error');
      passwordError.textContent = 'Password must be at least 8 characters long';
      passwordError.classList.add('show');
      isValid = false;
    } else {
      password.classList.remove('error');
      passwordError.classList.remove('show');
    }

    if (isValid) {
      // Make actual login API call
      const loginData = {
        emailOrUsername: email.value.trim(),
        password: password.value
      };

      fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then(data => {
        // Store user data in localStorage
        localStorage.setItem('userId', data.userProfile.id);
        localStorage.setItem('username', data.userProfile.username);
        localStorage.setItem('email', data.userProfile.email);
        localStorage.setItem('fullName', data.userProfile.fullName);
        
        // Show success message
        alert('Login successful! Welcome, ' + data.userProfile.username);
        
        // Redirect to dashboard
        window.location.href = 'index.html';
      })
      .catch(error => {
        alert('Login failed: ' + error.message);
      });
    }
  });
});
