import { getProjectById, updateProject, deleteProject } from './project.js';
import { fetchIssuesByProject, createIssue, updateIssue, deleteIssue } from './issue.js';

// Get project ID from URL parameters
function getProjectIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'Not set';
  
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Get status color class
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

// Get issue status color class
function getIssueStatusColor(status) {
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

// Get issue priority color class
function getIssuePriorityColor(priority) {
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

// Get issue type color class
function getIssueTypeColor(type) {
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

// Display project details
function displayProjectDetails(project) {
  const projectDetailsContainer = document.getElementById('project-details');
  if (!projectDetailsContainer) return;

  const statusColor = getStatusColor(project.status);

  projectDetailsContainer.innerHTML = `
    <!-- Project Header -->
    <section class="bg-[#18181b]/95 border border-devpurple/20 rounded-xl shadow p-6">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl md:text-3xl font-bold text-devpurple">${project.name}</h1>
            <span class="text-sm ${statusColor} px-3 py-1 rounded-full">${project.status || 'ACTIVE'}</span>
          </div>
          <p class="text-gray-300 text-lg">${project.description || 'No description provided'}</p>
        </div>
        <div class="flex gap-3">
          <button id="create-issue-btn" class="bg-green-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-green-700 transition">Create Issue</button>
          <button id="edit-project-btn" class="bg-devpurple text-black font-semibold rounded-lg px-4 py-2 hover:bg-devpurplelight transition">Edit Project</button>
          <button id="delete-project-btn" class="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-red-700 transition">Delete Project</button>
        </div>
      </div>
    </section>

    <!-- Project Information -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Basic Information -->
      <div class="bg-[#18181b]/95 border border-devpurple/20 rounded-xl shadow p-6">
        <h2 class="text-xl font-bold text-devpurple mb-4">Project Information</h2>
        <div class="space-y-3">
          <div>
            <span class="text-gray-400 text-sm">Project ID:</span>
            <p class="text-gray-100">${project.id}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Manager:</span>
            <p class="text-gray-100">${project.managerId || 'Not assigned'}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Created By:</span>
            <p class="text-gray-100">${project.createdById || 'Unknown'}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Created At:</span>
            <p class="text-gray-100">${formatDate(project.createdAt)}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Last Updated:</span>
            <p class="text-gray-100">${formatDate(project.updatedAt)}</p>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="bg-[#18181b]/95 border border-devpurple/20 rounded-xl shadow p-6">
        <h2 class="text-xl font-bold text-devpurple mb-4">Timeline</h2>
        <div class="space-y-3">
          <div>
            <span class="text-gray-400 text-sm">Start Date:</span>
            <p class="text-gray-100">${formatDate(project.startDate)}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">End Date:</span>
            <p class="text-gray-100">${formatDate(project.endDate)}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Duration:</span>
            <p class="text-gray-100">${calculateDuration(project.startDate, project.endDate)}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Members -->
    <section class="bg-[#18181b]/95 border border-devpurple/20 rounded-xl shadow p-6">
      <h2 class="text-xl font-bold text-devpurple mb-4">Project Members</h2>
      <div id="project-members">
        ${project.members && project.members.length > 0 ? 
          project.members.map(member => `
            <div class="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-devpurple/10 mb-2">
              <div>
                <p class="text-gray-100 font-semibold">${member.userId || 'Unknown User'}</p>
                <p class="text-gray-400 text-sm">${member.role || 'Member'}</p>
              </div>
            </div>
          `).join('') : 
          '<p class="text-gray-400">No members assigned to this project</p>'
        }
      </div>
    </section>

    <!-- Project Issues -->
    <section class="bg-[#18181b]/95 border border-devpurple/20 rounded-xl shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-devpurple">Project Issues</h2>
        <div class="flex gap-2">
          <button id="view-all-issues-btn" class="text-devpurple hover:text-devpurplelight text-sm">View All Issues</button>
        </div>
      </div>
      <div id="project-issues">
        <div class="text-center text-gray-400 py-8">
          <p>Loading issues...</p>
        </div>
      </div>
    </section>
  `;

  // Add event listeners
  const editBtn = document.getElementById('edit-project-btn');
  const deleteBtn = document.getElementById('delete-project-btn');
  const createIssueBtn = document.getElementById('create-issue-btn');
  const viewAllIssuesBtn = document.getElementById('view-all-issues-btn');

  if (editBtn) {
    editBtn.addEventListener('click', () => openEditModal(project.id));
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => confirmDeleteProject(project.id, project.name));
  }

  if (createIssueBtn) {
    createIssueBtn.addEventListener('click', () => openCreateIssueModal(project.id));
  }

  if (viewAllIssuesBtn) {
    viewAllIssuesBtn.addEventListener('click', () => {
      window.location.href = `project-issues.html?projectId=${project.id}`;
    });
  }

  // Load project issues
  loadProjectIssues(project.id);
}

// Load and display project issues
async function loadProjectIssues(projectId) {
  try {
    const issues = await fetchIssuesByProject(projectId);
    displayProjectIssues(issues);
  } catch (error) {
    console.error('Error loading project issues:', error);
    const issuesContainer = document.getElementById('project-issues');
    if (issuesContainer) {
      issuesContainer.innerHTML = `
        <div class="text-red-400">Error loading issues: ${error.message}</div>
      `;
    }
  }
}

// Display project issues
function displayProjectIssues(issues) {
  const issuesContainer = document.getElementById('project-issues');
  if (!issuesContainer) return;

  if (issues.length === 0) {
    issuesContainer.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        <p>No issues found for this project</p>
        <button id="create-first-issue-btn" class="mt-4 bg-green-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-green-700 transition">Create First Issue</button>
      </div>
    `;
    
    const createFirstBtn = document.getElementById('create-first-issue-btn');
    if (createFirstBtn) {
      createFirstBtn.addEventListener('click', () => {
        const projectId = getProjectIdFromUrl();
        if (projectId) {
          openCreateIssueModal(projectId);
        }
      });
    }
    return;
  }

  // Show only the 5 most recent issues
  const recentIssues = issues.slice(0, 5);
  
  issuesContainer.innerHTML = `
    <div class="space-y-3">
      ${recentIssues.map(issue => `
        <div class="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-devpurple/10">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="text-gray-100 font-semibold text-sm">${issue.title}</h4>
              <span class="text-xs ${getIssueStatusColor(issue.status)} px-2 py-1 rounded-full">${issue.status}</span>
              <span class="text-xs ${getIssuePriorityColor(issue.priority)} px-2 py-1 rounded-full">${issue.priority}</span>
              <span class="text-xs ${getIssueTypeColor(issue.type)} px-2 py-1 rounded-full">${issue.type}</span>
            </div>
            <p class="text-gray-400 text-xs">${issue.description ? issue.description.substring(0, 100) + '...' : 'No description'}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400">${issue.assignedToName || 'Unassigned'}</span>
            <button class="text-devpurple hover:text-devpurplelight text-xs" onclick="viewIssueDetails(${issue.id})">View</button>
          </div>
        </div>
      `).join('')}
    </div>
    ${issues.length > 5 ? `
      <div class="text-center mt-4">
        <a href="project-issues.html?projectId=${getProjectIdFromUrl()}" class="text-devpurple hover:text-devpurplelight text-sm">View all ${issues.length} issues</a>
      </div>
    ` : ''}
  `;
}

// Open create issue modal
function openCreateIssueModal(projectId) {
  const modal = document.getElementById('create-issue-modal');
  if (modal) {
    modal.classList.remove('hidden');
    loadCreateIssueModalData(projectId);
  }
}

function closeCreateIssueModal() {
  const modal = document.getElementById('create-issue-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.getElementById('create-issue-form').reset();
  }
}

// Load data for create issue modal
async function loadCreateIssueModalData(projectId) {
  try {
    const users = await fetch('http://localhost:8080/api/auth/all').then(res => res.json());
    
    // Set the project ID
    const projectIdInput = document.getElementById('issue-project-id');
    if (projectIdInput) {
      projectIdInput.value = projectId;
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
    console.error('Error loading create issue modal data:', error);
    showNotification('Error loading form data', 'error');
  }
}

// Calculate project duration
function calculateDuration(startDate, endDate) {
  if (!startDate) return 'Not started';
  if (!endDate) return 'Ongoing';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (end < now) {
    // Project completed
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days (Completed)`;
  } else {
    // Project ongoing
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days (Ongoing)`;
  }
}

// Open edit modal
function openEditModal(projectId) {
  const modal = document.getElementById('edit-project-modal');
  if (modal) {
    modal.classList.remove('hidden');
    loadProjectForEdit(projectId);
  }
}

function closeEditModal() {
  const modal = document.getElementById('edit-project-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.getElementById('edit-project-form').reset();
  }
}

// Load project data for editing
async function loadProjectForEdit(projectId) {
  try {
    const project = await getProjectById(projectId);
    
    // Populate form fields
    const form = document.getElementById('edit-project-form');
    if (form) {
      form.querySelector('[name="name"]').value = project.name || '';
      form.querySelector('[name="description"]').value = project.description || '';
      form.querySelector('[name="status"]').value = project.status || '';
      form.querySelector('[name="managerId"]').value = project.managerId || '';
      
      // Format dates for datetime-local input
      if (project.startDate) {
        const startDate = new Date(project.startDate);
        form.querySelector('[name="startDate"]').value = startDate.toISOString().slice(0, 16);
      }
      if (project.endDate) {
        const endDate = new Date(project.endDate);
        form.querySelector('[name="endDate"]').value = endDate.toISOString().slice(0, 16);
      }
      
      // Store project ID for form submission
      form.setAttribute('data-project-id', projectId);
    }
    
  } catch (error) {
    console.error('Error loading project for edit:', error);
    showNotification('Error loading project data', 'error');
  }
}

// Confirm project deletion
function confirmDeleteProject(projectId, projectName) {
  if (confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
    deleteProject(projectId)
      .then(() => {
        showNotification('Project deleted successfully!', 'success');
        // Redirect back to projects list
        setTimeout(() => {
          window.location.href = 'project.html';
        }, 1500);
      })
      .catch(error => {
        console.error('Error deleting project:', error);
        showNotification(`Error: ${error.message}`, 'error');
      });
  }
}

// Load project details
async function loadProjectDetails() {
  const projectId = getProjectIdFromUrl();
  
  if (!projectId) {
    const projectDetailsContainer = document.getElementById('project-details');
    if (projectDetailsContainer) {
      projectDetailsContainer.innerHTML = `
        <div class="text-center text-red-400 py-8">
          <p>No project ID provided</p>
          <a href="project.html" class="text-devpurple hover:text-devpurplelight">Back to Projects</a>
        </div>
      `;
    }
    return;
  }

  try {
    const project = await getProjectById(projectId);
    displayProjectDetails(project);
  } catch (error) {
    console.error('Error loading project details:', error);
    const projectDetailsContainer = document.getElementById('project-details');
    if (projectDetailsContainer) {
      projectDetailsContainer.innerHTML = `
        <div class="text-center text-red-400 py-8">
          <p>Error loading project: ${error.message}</p>
          <a href="project.html" class="text-devpurple hover:text-devpurplelight">Back to Projects</a>
        </div>
      `;
    }
  }
}

// Global function for viewing issue details
window.viewIssueDetails = function(issueId) {
  // TODO: Navigate to issue details page
  console.log('View issue details:', issueId);
  showNotification('Issue details page coming soon!', 'info');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load project details
  loadProjectDetails();
  
  // Set up edit modal handlers
  const closeEditModalBtn = document.getElementById('close-edit-project-modal');
  const cancelEditProjectBtn = document.getElementById('cancel-edit-project');
  const editProjectForm = document.getElementById('edit-project-form');
  
  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', closeEditModal);
  }
  
  if (cancelEditProjectBtn) {
    cancelEditProjectBtn.addEventListener('click', closeEditModal);
  }
  
  // Set up form submission for edit
  if (editProjectForm) {
    editProjectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const projectId = editProjectForm.getAttribute('data-project-id');
      const formData = new FormData(editProjectForm);
      const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        status: formData.get('status'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate') || null,
        managerId: formData.get('managerId')
      };
      
      try {
        await updateProject(projectId, projectData);
        closeEditModal();
        showNotification('Project updated successfully!', 'success');
        // Reload project details
        loadProjectDetails();
      } catch (error) {
        console.error('Error updating project:', error);
        showNotification(`Error: ${error.message}`, 'error');
      }
    });
  }
  
  // Set up create issue modal handlers
  const closeCreateIssueModalBtn = document.getElementById('close-create-issue-modal');
  const cancelCreateIssueBtn = document.getElementById('cancel-create-issue');
  const createIssueForm = document.getElementById('create-issue-form');
  
  if (closeCreateIssueModalBtn) {
    closeCreateIssueModalBtn.addEventListener('click', closeCreateIssueModal);
  }
  
  if (cancelCreateIssueBtn) {
    cancelCreateIssueBtn.addEventListener('click', closeCreateIssueModal);
  }
  
  // Set up form submission for create issue
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
        closeCreateIssueModal();
        showNotification('Issue created successfully!', 'success');
        // Reload project issues
        const projectId = getProjectIdFromUrl();
        if (projectId) {
          loadProjectIssues(projectId);
        }
      } catch (error) {
        console.error('Error creating issue:', error);
        showNotification(`Error: ${error.message}`, 'error');
      }
    });
  }
}); 