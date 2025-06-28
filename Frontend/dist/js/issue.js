import realtimeManager from './realtime.js';
import { fetchAllProjects } from './project.js';

// Fetch all issues
export async function fetchAllIssues() {
  const res = await fetch('http://localhost:8080/api/issues');
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
}

// Fetch issues for a specific project
export async function fetchIssuesByProject(projectId) {
  const res = await fetch(`http://localhost:8080/api/issues/project/${projectId}`);
  if (!res.ok) throw new Error('Failed to fetch project issues');
  return res.json();
}

// Create a new issue
export async function createIssue(issueData) {
  const response = await fetch('http://localhost:8080/api/issues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issueData)
  });
  if (!response.ok) throw new Error('Failed to create issue');
  const newIssue = await response.json();
  
  // Trigger immediate update
  realtimeManager.triggerUpdate('issues', { action: 'created', issue: newIssue });
  
  return newIssue;
}

// Update an issue
export async function updateIssue(issueId, issueData) {
  const response = await fetch(`http://localhost:8080/api/issues/${issueId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issueData)
  });
  if (!response.ok) throw new Error('Failed to update issue');
  const updatedIssue = await response.json();
  
  // Trigger immediate update
  realtimeManager.triggerUpdate('issues', { action: 'updated', issue: updatedIssue });
  
  return updatedIssue;
}

// Delete an issue
export async function deleteIssue(issueId) {
  const response = await fetch(`http://localhost:8080/api/issues/${issueId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete issue');
  
  // Trigger immediate update
  realtimeManager.triggerUpdate('issues', { action: 'deleted', issueId });
}

// Fetch all users for assignee dropdown
async function fetchAllUsers() {
  const res = await fetch('http://localhost:8080/api/auth/all');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// Update issues list display
function updateIssuesList(issues) {
  const issuesList = document.getElementById('issues-list');
  const issuesCount = document.getElementById('issues-count');
  
  if (!issuesList) return;

  // Update count
  if (issuesCount) {
    issuesCount.textContent = `${issues.length} issue${issues.length !== 1 ? 's' : ''}`;
  }

  // Clear existing content
  issuesList.innerHTML = '';

  if (issues.length === 0) {
    issuesList.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        <p>No issues found</p>
        <button id="create-first-issue" class="mt-4 bg-devpurple text-black font-semibold rounded-lg px-4 py-2 hover:bg-devpurplelight transition">Create Your First Issue</button>
      </div>
    `;
    
    // Add event listener for create first issue button
    const createFirstBtn = document.getElementById('create-first-issue');
    if (createFirstBtn) {
      createFirstBtn.addEventListener('click', () => openCreateModal());
    }
    return;
  }

  // Add each issue
  issues.forEach(issue => {
    const issueCard = createIssueCard(issue);
    issuesList.appendChild(issueCard);
  });
}

// Create an issue card element
function createIssueCard(issue) {
  const card = document.createElement('div');
  card.className = 'bg-[#18181b]/95 border border-devpurple/15 rounded-xl shadow p-6 flex flex-col gap-4';
  card.setAttribute('data-issue-id', issue.id);
  
  const statusColor = getStatusColor(issue.status);
  const priorityColor = getPriorityColor(issue.priority);
  const typeColor = getTypeColor(issue.type);
  
  card.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-100 text-lg mb-2">${issue.title}</h3>
        <p class="text-sm text-gray-400 mb-3">${issue.description || 'No description'}</p>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-xs ${statusColor} px-2 py-1 rounded-full">${issue.status || 'OPEN'}</span>
        <span class="text-xs ${priorityColor} px-2 py-1 rounded-full">${issue.priority || 'MEDIUM'}</span>
        <span class="text-xs ${typeColor} px-2 py-1 rounded-full">${issue.type || 'TASK'}</span>
      </div>
    </div>
    
    <div class="flex items-center justify-between text-xs text-gray-400">
      <div class="flex items-center gap-4">
        <span>Project: ${issue.projectName || 'Unknown'}</span>
        <span>Created ${formatDate(issue.createdAt)}</span>
      </div>
      <span>Assigned to: ${issue.assignedToName || 'Unassigned'}</span>
    </div>
    
    <div class="flex gap-2 mt-2">
      <button class="flex-1 bg-devpurple text-black rounded px-3 py-2 text-sm font-semibold hover:bg-devpurplelight transition" onclick="viewIssue(${issue.id})">View Details</button>
      <button class="bg-[#18181b] text-devpurple border border-devpurple rounded px-3 py-2 text-sm font-semibold hover:bg-devpurple/10 transition" onclick="editIssue(${issue.id})">Edit</button>
      <button class="bg-red-500/20 text-red-400 border border-red-500/30 rounded px-3 py-2 text-sm font-semibold hover:bg-red-500/30 transition" onclick="deleteIssue(${issue.id})">Delete</button>
    </div>
  `;
  return card;
}

// Get status color class
function getStatusColor(status) {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-500/20 text-blue-400';
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

// Get priority color class
function getPriorityColor(priority) {
  switch (priority) {
    case 'LOW':
      return 'bg-green-500/20 text-green-400';
    case 'MEDIUM':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'HIGH':
      return 'bg-orange-500/20 text-orange-400';
    case 'CRITICAL':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-devpurple/20 text-devpurple';
  }
}

// Get type color class
function getTypeColor(type) {
  switch (type) {
    case 'BUG':
      return 'bg-red-500/20 text-red-400';
    case 'FEATURE':
      return 'bg-blue-500/20 text-blue-400';
    case 'TASK':
      return 'bg-purple-500/20 text-purple-400';
    case 'IMPROVEMENT':
      return 'bg-green-500/20 text-green-400';
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

// Filter and sort issues
function filterAndSortIssues(issues) {
  const searchTerm = document.getElementById('search-issues')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('status-filter')?.value || '';
  const priorityFilter = document.getElementById('priority-filter')?.value || '';
  const typeFilter = document.getElementById('type-filter')?.value || '';
  const sortBy = document.getElementById('sort-issues')?.value || 'created-desc';

  // Filter issues
  let filteredIssues = issues.filter(issue => {
    const matchesSearch = !searchTerm || 
      issue.title.toLowerCase().includes(searchTerm) ||
      (issue.description && issue.description.toLowerCase().includes(searchTerm));
    
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
    const matchesType = !typeFilter || issue.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Sort issues
  filteredIssues.sort((a, b) => {
    switch (sortBy) {
      case 'created-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'created-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'priority-desc':
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      case 'priority-asc':
        return getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return filteredIssues;
}

// Get priority weight for sorting
function getPriorityWeight(priority) {
  switch (priority) {
    case 'CRITICAL': return 4;
    case 'HIGH': return 3;
    case 'MEDIUM': return 2;
    case 'LOW': return 1;
    default: return 0;
  }
}

// Modal management
function openCreateModal() {
  const modal = document.getElementById('create-issue-modal');
  if (modal) {
    modal.classList.remove('hidden');
    loadModalData();
  }
}

function closeCreateModal() {
  const modal = document.getElementById('create-issue-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.getElementById('create-issue-form').reset();
  }
}

// Load projects and users for modal dropdowns
async function loadModalData() {
  try {
    const [projects, users] = await Promise.all([
      fetchAllProjects(),
      fetchAllUsers()
    ]);

    // Populate project dropdown
    const projectSelect = document.getElementById('issue-project');
    if (projectSelect) {
      projectSelect.innerHTML = '<option value="">Select project</option>';
      projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectSelect.appendChild(option);
      });
    }

    // Populate assignee dropdown
    const assigneeSelect = document.getElementById('issue-assignee');
    if (assigneeSelect) {
      assigneeSelect.innerHTML = '<option value="">Unassigned</option>';
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.username;
        assigneeSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading modal data:', error);
    showNotification('Error loading form data', 'error');
  }
}

// Initialize real-time updates for issues
function initializeRealtimeUpdates() {
  // Subscribe to issue updates
  realtimeManager.subscribe('issues', (data) => {
    console.log('Issue update received:', data);
    
    if (data.action === 'created') {
      // Refresh the entire list
      loadIssues();
      showNotification(`New issue "${data.issue.title}" created!`);
    } else if (data.action === 'updated') {
      // Refresh the entire list
      loadIssues();
      showNotification(`Issue "${data.issue.title}" updated`);
    } else if (data.action === 'deleted') {
      // Refresh the entire list
      loadIssues();
      showNotification('Issue deleted');
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

// Load issues and display them
async function loadIssues() {
  try {
    const issues = await fetchAllIssues();
    const filteredIssues = filterAndSortIssues(issues);
    updateIssuesList(filteredIssues);
  } catch (error) {
    console.error('Error loading issues:', error);
    const issuesList = document.getElementById('issues-list');
    if (issuesList) {
      issuesList.innerHTML = `
        <div class="text-center text-red-400 py-8">
          <p>Error loading issues: ${error.message}</p>
        </div>
      `;
    }
  }
}

// Global functions for issue actions
window.viewIssue = function(issueId) {
  // TODO: Navigate to issue details page
  console.log('View issue:', issueId);
  showNotification('Issue details page coming soon!', 'info');
};

window.editIssue = function(issueId) {
  // TODO: Open edit modal
  console.log('Edit issue:', issueId);
  showNotification('Edit functionality coming soon!', 'info');
};

window.deleteIssue = async function(issueId) {
  const confirmed = confirm('Are you sure you want to delete this issue? This action cannot be undone.');
  if (!confirmed) return;
  
  try {
    await deleteIssue(issueId);
    showNotification('Issue deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting issue:', error);
    showNotification('Error deleting issue', 'error');
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load initial issues
  loadIssues();
  
  // Initialize real-time updates
  initializeRealtimeUpdates();
  
  // Set up modal handlers
  const createIssueBtn = document.getElementById('create-issue-btn');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelIssueBtn = document.getElementById('cancel-issue');
  const createIssueForm = document.getElementById('create-issue-form');
  
  if (createIssueBtn) {
    createIssueBtn.addEventListener('click', openCreateModal);
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCreateModal);
  }
  
  if (cancelIssueBtn) {
    cancelIssueBtn.addEventListener('click', closeCreateModal);
  }
  
  // Set up form submission
  if (createIssueForm) {
    createIssueForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(createIssueForm);
      const issueData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        priority: formData.get('priority'),
        status: formData.get('status'),
        projectId: parseInt(formData.get('projectId')),
        assignedToId: formData.get('assignedToId') ? parseInt(formData.get('assignedToId')) : null
      };
      
      try {
        await createIssue(issueData);
        closeCreateModal();
        showNotification('Issue created successfully!', 'success');
      } catch (error) {
        console.error('Error creating issue:', error);
        showNotification(`Error: ${error.message}`, 'error');
      }
    });
  }
  
  // Set up filter and search handlers
  const searchInput = document.getElementById('search-issues');
  const statusFilter = document.getElementById('status-filter');
  const priorityFilter = document.getElementById('priority-filter');
  const typeFilter = document.getElementById('type-filter');
  const sortSelect = document.getElementById('sort-issues');
  
  [searchInput, statusFilter, priorityFilter, typeFilter, sortSelect].forEach(element => {
    if (element) {
      element.addEventListener('change', loadIssues);
      if (element === searchInput) {
        element.addEventListener('input', debounce(loadIssues, 300));
      }
    }
  });
});

// Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
