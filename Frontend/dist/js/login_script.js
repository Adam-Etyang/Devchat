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
      // Simulate login success
      alert('Login successful!');
      window.location.href = '../src/index.html'; // TODO: Replace with actual redirect logic
    }
  });
});
