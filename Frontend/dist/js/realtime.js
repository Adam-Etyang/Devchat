// Real-time update system for Devchat
class RealtimeManager {
  constructor() {
    this.pollingInterval = 5000; // 5 seconds
    this.pollingTimer = null;
    this.lastUpdateTime = Date.now();
    this.subscribers = new Map();
    this.isConnected = false;
  }

  // Start polling for updates
  startPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
    
    this.pollingTimer = setInterval(() => {
      this.checkForUpdates();
    }, this.pollingInterval);
    
    console.log('Real-time polling started');
  }

  // Stop polling
  stopPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    console.log('Real-time polling stopped');
  }

  // Check for updates from the server
  async checkForUpdates() {
    try {
      // Get the last update timestamp
      const response = await fetch(`http://localhost:8080/api/updates?since=${this.lastUpdateTime}`);
      
      if (response.ok) {
        const updates = await response.json();
        
        if (updates.length > 0) {
          this.lastUpdateTime = Date.now();
          this.notifySubscribers(updates);
        }
      } else {
        console.warn('Updates endpoint returned status:', response.status);
      }
    } catch (error) {
      console.warn('Error checking for updates (this is normal if the backend is not running):', error.message);
      // Don't throw the error - just log it as a warning
      // This prevents the real-time system from breaking the entire application
    }
  }

  // Subscribe to updates for a specific type (projects, issues, etc.)
  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type).push(callback);
  }

  // Unsubscribe from updates
  unsubscribe(type, callback) {
    if (this.subscribers.has(type)) {
      const callbacks = this.subscribers.get(type);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify all subscribers of updates
  notifySubscribers(updates) {
    updates.forEach(update => {
      const callbacks = this.subscribers.get(update.type);
      if (callbacks) {
        callbacks.forEach(callback => {
          try {
            callback(update.data);
          } catch (error) {
            console.error('Error in update callback:', error);
          }
        });
      }
    });
  }

  // Manually trigger an update (for immediate feedback)
  triggerUpdate(type, data) {
    this.notifySubscribers([{ type, data }]);
  }
}

// Global instance
const realtimeManager = new RealtimeManager();

// Auto-start polling when the module is loaded
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    realtimeManager.startPolling();
  });
  
  window.addEventListener('beforeunload', () => {
    realtimeManager.stopPolling();
  });
}

export default realtimeManager; 