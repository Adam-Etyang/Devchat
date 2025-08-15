// Settings page functionality
class SettingsManager {
  constructor() {
    this.currentTab = 'profile';
    this.init();
  }

  init() {
    this.setupTabSwitching();
    this.setupFormHandlers();
    this.loadUserProfile();
    this.setupAvatarUpload();
  }

  // Setup tab switching functionality
  setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.settings-tab');
    const tabContents = document.querySelectorAll('.settings-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });
  }

  // Switch between different settings tabs
  switchTab(tabName) {
    // Update tab button styles
    document.querySelectorAll('.settings-tab').forEach(button => {
      button.classList.remove('text-devpurple', 'bg-devpurple/10', 'font-semibold');
      button.classList.add('text-gray-300', 'hover:bg-devpurple/10', 'hover:text-devpurple', 'transition');
    });

    // Highlight active tab
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
      activeButton.classList.remove('text-gray-300', 'hover:bg-devpurple/10', 'hover:text-devpurple', 'transition');
      activeButton.classList.add('text-devpurple', 'bg-devpurple/10', 'font-semibold');
    }

    // Hide all tab contents
    document.querySelectorAll('.settings-content').forEach(content => {
      content.classList.add('hidden');
    });

    // Show active tab content
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
      activeContent.classList.remove('hidden');
    }

    this.currentTab = tabName;
  }

  // Setup form handlers
  setupFormHandlers() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }

    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => this.handlePasswordUpdate(e));
    }

    // Notification preferences
    const notificationButtons = document.querySelectorAll('#notifications button');
    notificationButtons.forEach(button => {
      if (button.textContent === 'Save Preferences') {
        button.addEventListener('click', () => this.handleNotificationPreferences());
      }
    });

    // General preferences
    const preferenceButtons = document.querySelectorAll('#preferences button');
    preferenceButtons.forEach(button => {
      if (button.textContent === 'Save Preferences') {
        button.addEventListener('click', () => this.handleGeneralPreferences());
      }
    });

    // Integration buttons
    const integrationButtons = document.querySelectorAll('#integrations button');
    integrationButtons.forEach(button => {
      if (button.textContent === 'Connect') {
        button.addEventListener('click', (e) => this.handleIntegrationConnect(e));
      }
    });

    // Account deletion
    const deleteAccountButton = document.querySelector('#account button.bg-red-500');
    if (deleteAccountButton) {
      deleteAccountButton.addEventListener('click', () => this.handleAccountDeletion());
    }
  }

  // Load user profile data
  async loadUserProfile() {
    try {
      // Get user ID from localStorage (or wherever it's stored)
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('No user ID found');
        return;
      }

      // Fetch user profile from backend
      const response = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userProfile = await response.json();
      this.populateProfileForm(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.showNotification('Error loading profile data', 'error');
    }
  }

  // Populate profile form with user data
  populateProfileForm(userProfile) {
    const fields = {
      'fullName': userProfile.fullName || '',
      'username': userProfile.username || '',
      'email': userProfile.email || '',
      'phone': userProfile.phone || '',
      'bio': userProfile.bio || '',
      'location': userProfile.location || ''
    };

    Object.entries(fields).forEach(([fieldName, value]) => {
      const field = document.getElementById(fieldName);
      if (field) {
        field.value = value;
      }
    });

    // Update profile display
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    
    if (profileName) {
      profileName.textContent = userProfile.fullName || userProfile.username || 'User';
    }
    if (profileEmail) {
      profileEmail.textContent = userProfile.email || '';
    }
  }

  // Handle profile form submission
  async handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const profileData = {
      fullName: formData.get('fullName'),
      username: formData.get('username'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      bio: formData.get('bio'),
      location: formData.get('location')
    };

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      this.showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showNotification('Error updating profile', 'error');
    }
  }

  // Handle password update
  async handlePasswordUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const passwordData = {
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword')
    };

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      this.showNotification('New passwords do not match', 'error');
      return;
    }

    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      this.showNotification('Password must be at least 8 characters long', 'error');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      this.showNotification('Password updated successfully!', 'success');
      e.target.reset();
    } catch (error) {
      console.error('Error updating password:', error);
      this.showNotification('Error updating password', 'error');
    }
  }

  // Handle notification preferences
  async handleNotificationPreferences() {
    const emailNotifications = {
      projectUpdates: document.querySelector('#notifications input[type="checkbox"]:nth-child(1)').checked,
      issueUpdates: document.querySelector('#notifications input[type="checkbox"]:nth-child(2)').checked,
      chatMessages: document.querySelector('#notifications input[type="checkbox"]:nth-child(3)').checked,
      securityAlerts: document.querySelector('#notifications input[type="checkbox"]:nth-child(4)').checked
    };

    const pushNotifications = {
      realTimeUpdates: document.querySelector('#notifications input[type="checkbox"]:nth-child(5)').checked,
      issueMentions: document.querySelector('#notifications input[type="checkbox"]:nth-child(6)').checked,
      chatMessages: document.querySelector('#notifications input[type="checkbox"]:nth-child(7)').checked
    };

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${userId}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailNotifications,
          pushNotifications
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      this.showNotification('Notification preferences saved!', 'success');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      this.showNotification('Error saving notification preferences', 'error');
    }
  }

  // Handle general preferences
  async handleGeneralPreferences() {
    const theme = document.querySelector('input[name="theme"]:checked')?.value || 'dark';
    const language = document.querySelector('#preferences select:nth-child(1)').value;
    const timezone = document.querySelector('#preferences select:nth-child(2)').value;
    const dateFormat = document.querySelector('#preferences select:nth-child(3)').value;

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          language,
          timezone,
          dateFormat
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      this.showNotification('Preferences saved!', 'success');
      
      // Apply theme immediately
      this.applyTheme(theme);
    } catch (error) {
      console.error('Error updating preferences:', error);
      this.showNotification('Error saving preferences', 'error');
    }
  }

  // Apply theme to the application
  applyTheme(theme) {
    // Store theme preference
    localStorage.setItem('theme', theme);
    
    // Apply theme classes to body
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    
    // You can add more theme-specific logic here
    console.log(`Theme applied: ${theme}`);
  }

  // Handle integration connections
  async handleIntegrationConnect(e) {
    const integrationName = e.target.closest('.flex').querySelector('h3').textContent;
    
    if (integrationName === 'GitHub') {
      // Redirect to GitHub OAuth
      window.open('https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo', '_blank');
    } else {
      this.showNotification(`${integrationName} integration coming soon!`, 'info');
    }
  }

  // Handle account deletion
  async handleAccountDeletion() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (!confirmed) {
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      this.showNotification('Account deleted successfully', 'success');
      
      // Clear local storage and redirect to login
      setTimeout(() => {
        localStorage.clear();
        window.location.href = 'Login.html';
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      this.showNotification('Error deleting account', 'error');
    }
  }

  // Setup avatar upload functionality
  setupAvatarUpload() {
    const avatarButton = document.querySelector('#profile-avatar + button');
    if (avatarButton) {
      avatarButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => this.handleAvatarUpload(e.target.files[0]);
        input.click();
      });
    }
  }

  // Handle avatar upload
  async handleAvatarUpload(file) {
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      this.showNotification('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      this.showNotification('Image size must be less than 5MB', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/${userId}/avatar`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const result = await response.json();
      
      // Update avatar display
      const avatarImg = document.getElementById('profile-avatar');
      if (avatarImg) {
        avatarImg.src = result.avatarUrl;
      }

      this.showNotification('Avatar updated successfully!', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      this.showNotification('Error uploading avatar', 'error');
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
    
    // Set color based on type
    switch (type) {
      case 'success':
        notification.classList.add('bg-green-500', 'text-white');
        break;
      case 'error':
        notification.classList.add('bg-red-500', 'text-white');
        break;
      case 'warning':
        notification.classList.add('bg-yellow-500', 'text-black');
        break;
      default:
        notification.classList.add('bg-devpurple', 'text-black');
    }
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SettingsManager();
}); 