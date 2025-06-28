import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import ToggleSwitch from './ToggleSwitch';
import Cropper from 'react-easy-crop';

const themeOptions = [
  { value: 'purple', label: 'Purple' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
];

const SettingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    displayName: '',
    email: '',
    bio: '',
    avatar: 'https://via.placeholder.com/80',
  });
  const [settings, setSettings] = useState({
    darkMode: true,
    themeColor: 'purple',
    notifications: true,
    soundNotifications: false,
    desktopNotifications: false,
  });
  const avatarInputRef = useRef();

  // Cropping state
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        displayName: user.displayName || user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || 'https://via.placeholder.com/80',
      });
    }
    const saved = JSON.parse(localStorage.getItem('devchat_settings') || '{}');
    setSettings((s) => ({ ...s, ...saved }));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('devchat_settings', JSON.stringify(settings));
    const root = document.documentElement;
    const themes = {
      purple: { primary: '#8B5CF6', hover: '#7C3AED' },
      blue: { primary: '#3B82F6', hover: '#2563EB' },
      green: { primary: '#10B981', hover: '#059669' },
      red: { primary: '#EF4444', hover: '#DC2626' },
    };
    const colors = themes[settings.themeColor] || themes.purple;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--primary-hover', colors.hover);
  }, [settings]);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfile((p) => ({ ...p, [id.replace('profile-', '')]: value }));
  };

  // Avatar upload and cropping
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.showToast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.showToast('Image size must be less than 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCroppedImage(event.target.result);
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    // TODO: Implement actual cropping logic and setProfile avatar
    setProfile((p) => ({ ...p, avatar: croppedImage }));
    setCropping(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...profile };
    localStorage.setItem('devchat_user', JSON.stringify(updatedUser));
    window.showToast('Profile updated successfully', 'success');
  };

  const handleSettingChange = (e) => {
    const { id, type, checked, value } = e.target;
    setSettings((s) => ({ ...s, [id]: type === 'checkbox' ? checked : value }));
    window.showToast(`${id} updated`, 'info');
  };

  if (!isAuthenticated) {
    return (
      <div className="settings-modern-wrapper">
        <div className="welcome-message">
          <h2>Please sign in to access settings.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-modern-wrapper">
      <div className="settings-container">
        <div className="settings-header">
          <h2>User Settings</h2>
          <p>Manage your account and preferences</p>
        </div>
        <div className="settings-content">
          {/* Profile Section */}
          <div className="settings-section">
            <h3>My Account</h3>
            <div className="profile-section">
              <div className="profile-avatar-section">
                <div className="profile-avatar" onClick={() => avatarInputRef.current.click()} style={{ cursor: 'pointer' }}>
                  <img id="profile-avatar-img" src={profile.avatar} alt="Profile" />
                  <div className="avatar-overlay">
                    <i className="fas fa-camera"></i>
                  </div>
                </div>
                <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} ref={avatarInputRef} onChange={handleAvatarUpload} />
                <button className="btn btn-secondary" id="change-avatar-btn" onClick={() => avatarInputRef.current.click()}>Change Avatar</button>
                {cropping && (
                  <div className="modal-overlay">
                    <div className="modal">
                      <Cropper
                        image={croppedImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                      <button className="btn btn-primary" onClick={handleCropSave}>Save</button>
                      <button className="btn btn-secondary" onClick={() => setCropping(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleProfileSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profile-username">Username</label>
                    <input type="text" id="profile-username" value={profile.username} onChange={handleProfileChange} placeholder="Enter username" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-display-name">Display Name</label>
                    <input type="text" id="profile-display-name" value={profile.displayName} onChange={handleProfileChange} placeholder="Enter display name" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="profile-email">Email</label>
                  <input type="email" id="profile-email" value={profile.email} onChange={handleProfileChange} placeholder="Enter email" />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-bio">Bio</label>
                  <textarea id="profile-bio" value={profile.bio} onChange={handleProfileChange} placeholder="Tell us about yourself..." rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
          {/* Appearance Section */}
          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="settings-form">
              <label className="toggle-label">
                <span>Dark Mode</span>
                <ToggleSwitch checked={settings.darkMode} onChange={() => {
                  setSettings(s => ({ ...s, darkMode: !s.darkMode }));
                  document.body.classList.toggle('dark-mode', !settings.darkMode);
                  window.showToast('Dark mode ' + (!settings.darkMode ? 'enabled' : 'disabled'), 'info');
                }} />
              </label>
              <label className="toggle-label">
                <span>Theme</span>
                <select id="themeColor" value={settings.themeColor} onChange={handleSettingChange}>
                  {themeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </label>
            </div>
          </div>
          {/* Notifications Section */}
          <div className="settings-section">
            <h3>Notifications</h3>
            <div className="settings-form">
              <label className="toggle-label">
                <span>Enable Notifications</span>
                <ToggleSwitch checked={settings.notifications} onChange={() => {
                  setSettings(s => ({ ...s, notifications: !s.notifications }));
                  window.showToast('Notifications ' + (!settings.notifications ? 'enabled' : 'disabled'), 'info');
                }} />
              </label>
              <label className="toggle-label">
                <span>Sound Notifications</span>
                <ToggleSwitch checked={settings.soundNotifications} onChange={() => {
                  setSettings(s => ({ ...s, soundNotifications: !s.soundNotifications }));
                  window.showToast('Sound notifications ' + (!settings.soundNotifications ? 'enabled' : 'disabled'), 'info');
                }} />
              </label>
              <label className="toggle-label">
                <span>Desktop Notifications</span>
                <ToggleSwitch checked={settings.desktopNotifications} onChange={() => {
                  setSettings(s => ({ ...s, desktopNotifications: !s.desktopNotifications }));
                  if (!settings.desktopNotifications && 'Notification' in window) {
                    Notification.requestPermission().then(permission => {
                      if (permission === 'granted') {
                        new Notification('Desktop notifications enabled!');
                      }
                    });
                  }
                  window.showToast('Desktop notifications ' + (!settings.desktopNotifications ? 'enabled' : 'disabled'), 'info');
                }} />
              </label>
            </div>
          </div>
          {/* Privacy Section */}
          <div className="settings-section">
            <h3>Privacy & Security</h3>
            <div className="settings-form">
              <button className="btn btn-secondary" id="change-email-btn" onClick={() => window.showToast('Change Email clicked', 'info')}>Change Email</button>
              <button className="btn btn-secondary" id="change-password-btn" onClick={() => window.showToast('Change Password clicked', 'info')}>Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 