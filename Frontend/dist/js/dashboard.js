import realtimeManager from './realtime.js';
import { fetchAllProjects, createProject } from './project.js';
import { fetchAllIssues } from './issue.js';

// Mock: get current user info (replace with real API call when available)
async function fetchCurrentUser() {
  // Replace with real API call
  return {
    id: localStorage.getItem('userId') || 1,
    username: localStorage.getItem('username') || 'DemoUser'
  };
}

// Mock: fetch assigned issues (replace with real API call)
async function fetchAssignedIssues(userId) {
  return [
    {
      type: 'Bug',
      priority: 'High Priority',
      status: 'Open',
      title: 'Login fails with OAuth on Safari',
      project: 'Devchat Platform',
      assignedBy: '@alex',
      link: '../pages/issues.html'
    },
    {
      type: 'Feature',
      priority: 'Medium Priority',
      status: 'In Progress',
      title: 'Add code snippet formatting to chat',
      project: 'API Refactor',
      assignedBy: '@sara',
      link: '../pages/issues.html'
    }
  ];
}

// Fetch all users for manager dropdown
async function fetchAllUsers() {
  const res = await fetch('http://localhost:8080/api/auth/all');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// Modal management
function openCreateModal() {
  const modal = document.getElementById('create-project-modal');
  if (modal) {
    modal.classList.remove('hidden');
    loadModalData();
  }
}

function closeCreateModal() {
  const modal = document.getElementById('create-project-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.getElementById('create-project-form').reset();
  }
}

// Load users for manager dropdown
async function loadModalData() {
  try {
    const users = await fetchAllUsers();

    // Populate manager dropdown
    const managerSelect = document.getElementById('project-manager');
    if (managerSelect) {
      managerSelect.innerHTML = '<option value="">Select manager</option>';
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.username;
        managerSelect.appendChild(option);
      });
    }

    // Set default start date
    const startDateInput = document.getElementById('project-start-date');
    if (startDateInput) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      startDateInput.value = defaultDateTime;
    }
  } catch (error) {
    console.error('Error loading modal data:', error);
    showNotification('Error loading form data', 'error');
  }
}

// Load and display recent projects
async function loadRecentProjects() {
  try {
    const projects = await fetchAllProjects();
    const recentProjectsContainer = document.getElementById('recent-projects');
    
    if (!recentProjectsContainer) return;
    
    if (projects.length === 0) {
      recentProjectsContainer.innerHTML = `
        <div class="text-gray-400 text-sm">No projects yet</div>
      `;
      return;
    }
    
    // Show only the 3 most recent projects
    const recentProjects = projects.slice(0, 3);
    
    recentProjectsContainer.innerHTML = recentProjects.map(project => `
      <div class="flex items-center justify-between p-3 bg-[#18181b]/50 rounded-lg border border-devpurple/10">
        <div class="flex-1">
          <h4 class="font-semibold text-gray-100 text-sm">${project.name}</h4>
          <p class="text-xs text-gray-400">${formatDate(project.createdAt)}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs ${getStatusColor(project.status)} px-2 py-1 rounded-full">${project.status || 'ACTIVE'}</span>
          <a href="project/project.html" class="text-devpurple hover:text-devpurplelight text-xs">View</a>
        </div>
      </div>
    `).join('');
    
    // Add "View All" link if there are more projects
    if (projects.length > 3) {
      const viewAllLink = document.createElement('div');
      viewAllLink.innerHTML = `
        <a href="project/project.html" class="text-devpurple hover:text-devpurplelight text-sm">View all ${projects.length} projects</a>
      `;
      recentProjectsContainer.appendChild(viewAllLink);
    }
    
  } catch (error) {
    console.error('Error loading recent projects:', error);
    const recentProjectsContainer = document.getElementById('recent-projects');
    if (recentProjectsContainer) {
      recentProjectsContainer.innerHTML = `
        <div class="text-red-400 text-sm">Error loading projects</div>
      `;
    }
  }
}

// Load and display recent issues
async function loadRecentIssues() {
  try {
    const issues = await fetchAllIssues();
    const recentIssuesContainer = document.getElementById('recent-issues');
    
    if (!recentIssuesContainer) return;
    
    if (issues.length === 0) {
      recentIssuesContainer.innerHTML = `
        <div class="text-gray-400 text-sm">No issues found</div>
      `;
      return;
    }
    
    // Show only the 3 most recent issues
    const recentIssues = issues.slice(0, 3);
    
    recentIssuesContainer.innerHTML = recentIssues.map(issue => `
      <div class="flex items-center justify-between p-3 bg-[#18181b]/50 rounded-lg border border-devpurple/10">
        <div class="flex-1">
          <h4 class="font-semibold text-gray-100 text-sm">${issue.title}</h4>
          <p class="text-xs text-gray-400">${formatDate(issue.createdAt)}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs ${getIssueStatusColor(issue.status)} px-2 py-1 rounded-full">${issue.status || 'OPEN'}</span>
          <a href="issue.html" class="text-devpurple hover:text-devpurplelight text-xs">View</a>
        </div>
      </div>
    `).join('');
    
    // Add "View All" link if there are more issues
    if (issues.length > 3) {
      const viewAllLink = document.createElement('div');
      viewAllLink.innerHTML = `
        <a href="issue.html" class="text-devpurple hover:text-devpurplelight text-sm">View all ${issues.length} issues</a>
      `;
      recentIssuesContainer.appendChild(viewAllLink);
    }
    
  } catch (error) {
    console.error('Error loading recent issues:', error);
    const recentIssuesContainer = document.getElementById('recent-issues');
    if (recentIssuesContainer) {
      recentIssuesContainer.innerHTML = `
        <div class="text-red-400 text-sm">Error loading issues</div>
      `;
    }
  }
}

// Load and display recent activity
async function loadRecentActivity() {
  try {
    const response = await fetch('http://localhost:8080/api/updates/recent');
    
    if (!response.ok) {
      console.warn('Recent activity endpoint returned status:', response.status);
      const activityContainer = document.getElementById('recent-activity');
      if (activityContainer) {
        activityContainer.innerHTML = `
          <div class="text-gray-400 text-sm">No recent activity</div>
        `;
      }
      return;
    }
    
    const updates = await response.json();
    
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;
    
    if (updates.length === 0) {
      activityContainer.innerHTML = `
        <div class="text-gray-400 text-sm">No recent activity</div>
      `;
      return;
    }
    
    // Show only the 5 most recent updates
    const recentUpdates = updates.slice(0, 5);
    
    activityContainer.innerHTML = recentUpdates.map(update => `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-devpurple"></span>
        <span class="text-gray-200 text-sm">
          ${update.action} ${update.type}: ${update.entityName}
        </span>
        <span class="ml-auto text-xs text-gray-400">${formatDate(update.createdAt)}</span>
      </div>
    `).join('');
    
  } catch (error) {
    console.warn('Error loading recent activity (this is normal if the backend is not running):', error.message);
    const activityContainer = document.getElementById('recent-activity');
    if (activityContainer) {
      activityContainer.innerHTML = `
        <div class="text-gray-400 text-sm">No recent activity</div>
      `;
    }
  }
}

// Get status color class for projects
function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500/20 text-green-400';
    case 'PLANNING':
      return 'bg-blue-500/20 text-blue-400';
    case 'COMPLETED':
      return 'bg-gray-500/20 text-gray-400';
    case 'ON_HOLD':
      return 'bg-yellow-500/20 text-yellow-400';
    default:
      return 'bg-devpurple/20 text-devpurple';
  }
}

// Get status color class for issues
function getIssueStatusColor(status) {
  switch (status) {
    case 'OPEN':
      return 'bg-red-500/20 text-red-400';
    case 'IN_PROGRESS':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'RESOLVED':
      return 'bg-green-500/20 text-green-400';
    case 'CLOSED':
      return 'bg-gray-500/20 text-gray-400';
    default:
      return 'bg-devpurple/20 text-devpurple';
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}

// Initialize real-time updates
function initializeRealtimeUpdates() {
  // Subscribe to project updates
  realtimeManager.subscribe('projects', (data) => {
    console.log('Project update received on dashboard:', data);
    
    if (data.action === 'created' || data.action === 'updated' || data.action === 'deleted') {
      // Refresh the projects list
      loadRecentProjects();
      // Refresh activity
      loadRecentActivity();
      
      // Show notification for new projects
      if (data.action === 'created') {
        showNotification(`New project "${data.project.name}" created!`, 'success');
      }
    }
  });

  // Subscribe to issue updates
  realtimeManager.subscribe('issues', (data) => {
    console.log('Issue update received on dashboard:', data);
    
    if (data.action === 'created' || data.action === 'updated' || data.action === 'deleted') {
      // Refresh the issues list
      loadRecentIssues();
      // Refresh activity
      loadRecentActivity();
      
      // Show notification for new issues
      if (data.action === 'created') {
        showNotification(`New issue "${data.issue.title}" created!`, 'success');
      }
    }
  });
}

// Show notification
function showNotification(message, type = 'info') {
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

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Dashboard initializing...');
  
  // Load all dashboard data
  await Promise.all([
    loadRecentProjects(),
    loadRecentIssues(),
    loadRecentActivity()
  ]);
  
  // Initialize real-time updates
  initializeRealtimeUpdates();
  
  // Set up modal handlers
  const createProjectBtn = document.getElementById('create-project-btn');
  const closeModalBtn = document.getElementById('close-project-modal');
  const cancelProjectBtn = document.getElementById('cancel-project');
  const createProjectForm = document.getElementById('create-project-form');
  
  if (createProjectBtn) {
    createProjectBtn.addEventListener('click', openCreateModal);
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCreateModal);
  }
  
  if (cancelProjectBtn) {
    cancelProjectBtn.addEventListener('click', closeCreateModal);
  }
  
  // Set up form submission
  if (createProjectForm) {
    createProjectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(createProjectForm);
      const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        status: formData.get('status'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || null,
        managerId: parseInt(formData.get('managerId'))
      };
      
      try {
        await createProject(projectData);
        closeCreateModal();
        showNotification('Project created successfully!', 'success');
      } catch (error) {
        console.error('Error creating project:', error);
        showNotification(`Error: ${error.message}`, 'error');
      }
    });
  }
  
  console.log('Dashboard initialized successfully');
});
