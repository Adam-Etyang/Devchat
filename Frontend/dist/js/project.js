import realtimeManager from './realtime.js';

// Fetch all projects
export async function fetchAllProjects() {
  const res = await fetch('http://localhost:8080/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

// Fetch projects for a specific user (update endpoint as needed)
export async function fetchProjectsByUser(userId) {
  // Placeholder endpoint, update as needed
  const res = await fetch(`http://localhost:8080/api/projects?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user projects');
  return res.json();
}

// Create a new project
export async function createProject(projectData) {
  const response = await fetch('http://localhost:8080/api/projects/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!response.ok) throw new Error('Failed to create project');
  const newProject = await response.json();
  
  // Trigger immediate update
  realtimeManager.triggerUpdate('projects', { action: 'created', project: newProject });
  
  return newProject;
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

// Update project display for projects listing page
function updateProjectsGrid(projects) {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  // Clear existing content
  projectsGrid.innerHTML = '';

  if (projects.length === 0) {
    projectsGrid.innerHTML = `
      <div class="col-span-full text-center text-gray-400 py-8">
        <p>No projects found</p>
        <button id="create-first-project" class="mt-4 bg-devpurple text-black font-semibold rounded-lg px-4 py-2 hover:bg-devpurplelight transition">Create Your First Project</button>
      </div>
    `;
    
    // Add event listener for create first project button
    const createFirstBtn = document.getElementById('create-first-project');
    if (createFirstBtn) {
      createFirstBtn.addEventListener('click', () => openCreateModal());
    }
    return;
  }

  // Add each project
  projects.forEach(project => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
}

// Update recent projects for dashboard
function updateRecentProjects(projects) {
  const recentProjectsContainer = document.getElementById('recent-projects');
  if (!recentProjectsContainer) return;

  // Clear existing content
  recentProjectsContainer.innerHTML = '';

  if (projects.length === 0) {
    recentProjectsContainer.innerHTML = `
      <div class="text-gray-400">No projects yet</div>
    `;
    return;
  }

  // Show only the 3 most recent projects
  const recentProjects = projects.slice(0, 3);
  
  recentProjects.forEach(project => {
    const projectItem = createRecentProjectItem(project);
    recentProjectsContainer.appendChild(projectItem);
  });

  // Add "View All" link if there are more projects
  if (projects.length > 3) {
    const viewAllLink = document.createElement('div');
    viewAllLink.innerHTML = `
      <a href="project/project.html" class="text-devpurple hover:text-devpurplelight text-sm">View all ${projects.length} projects</a>
    `;
    recentProjectsContainer.appendChild(viewAllLink);
  }
}

// Create a project card element for projects listing
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'bg-[#18181b]/95 border border-devpurple/15 rounded-xl shadow p-6 flex flex-col gap-4';
  card.setAttribute('data-project-id', project.id);
  
  const statusColor = getStatusColor(project.status);
  
  card.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-100 text-lg mb-2">${project.name}</h3>
        <p class="text-sm text-gray-400 mb-3">${project.description || 'No description'}</p>
      </div>
      <span class="text-xs ${statusColor} px-2 py-1 rounded-full">${project.status || 'ACTIVE'}</span>
    </div>
    
    <div class="flex items-center justify-between text-xs text-gray-400">
      <span>Created ${formatDate(project.createdAt)}</span>
      <span>Manager: ${project.createdById || 'Unknown'}</span>
    </div>
    
    <div class="flex gap-2 mt-2">
      <button class="flex-1 bg-devpurple text-black rounded px-3 py-2 text-sm font-semibold hover:bg-devpurplelight transition">View Details</button>
      <button class="bg-[#18181b] text-devpurple border border-devpurple rounded px-3 py-2 text-sm font-semibold hover:bg-devpurple/10 transition">Edit</button>
    </div>
  `;
  return card;
}

// Create a recent project item for dashboard
function createRecentProjectItem(project) {
  const item = document.createElement('div');
  item.className = 'flex items-center justify-between p-3 bg-[#18181b]/50 rounded-lg border border-devpurple/10';
  
  const statusColor = getStatusColor(project.status);
  
  item.innerHTML = `
    <div class="flex-1">
      <h4 class="font-semibold text-gray-100 text-sm">${project.name}</h4>
      <p class="text-xs text-gray-400">${formatDate(project.createdAt)}</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs ${statusColor} px-2 py-1 rounded-full">${project.status || 'ACTIVE'}</span>
      <a href="project/project.html" class="text-devpurple hover:text-devpurplelight text-xs">View</a>
    </div>
  `;
  return item;
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

// Initialize real-time updates for projects
function initializeRealtimeUpdates() {
  // Subscribe to project updates
  realtimeManager.subscribe('projects', (data) => {
    console.log('Project update received:', data);
    
    if (data.action === 'created') {
      // Add new project to the list
      const projectsGrid = document.getElementById('projects-grid');
      const recentProjectsContainer = document.getElementById('recent-projects');
      
      if (projectsGrid) {
        const newCard = createProjectCard(data.project);
        projectsGrid.insertBefore(newCard, projectsGrid.firstChild);
      }
      
      if (recentProjectsContainer) {
        // Refresh recent projects
        loadRecentProjects();
      }
      
      // Show notification
      showNotification(`New project "${data.project.name}" created!`, 'success');
    } else if (data.action === 'updated') {
      // Refresh the entire list
      loadProjects();
      loadRecentProjects();
    } else if (data.action === 'deleted') {
      // Remove project from list
      const projectElement = document.querySelector(`[data-project-id="${data.projectId}"]`);
      if (projectElement) {
        projectElement.remove();
        showNotification('Project deleted', 'success');
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

// Load projects and display them on projects page
async function loadProjects() {
  try {
    const projects = await fetchAllProjects();
    updateProjectsGrid(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = `
        <div class="col-span-full text-center text-red-400 py-8">
          <p>Error loading projects: ${error.message}</p>
        </div>
      `;
    }
  }
}

// Load recent projects for dashboard
async function loadRecentProjects() {
  try {
    const projects = await fetchAllProjects();
    updateRecentProjects(projects);
  } catch (error) {
    console.error('Error loading recent projects:', error);
    const recentProjectsContainer = document.getElementById('recent-projects');
    if (recentProjectsContainer) {
      recentProjectsContainer.innerHTML = `
        <div class="text-red-400">Error loading projects</div>
      `;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check which page we're on and load appropriate content
  const projectsGrid = document.getElementById('projects-grid');
  const recentProjectsContainer = document.getElementById('recent-projects');
  
  if (projectsGrid) {
    // We're on the projects listing page
    loadProjects();
  }
  
  if (recentProjectsContainer) {
    // We're on the dashboard
    loadRecentProjects();
  }
  
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
  
  // Set up status filter if it exists
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      // TODO: Implement filtering
      console.log('Filter by status:', e.target.value);
    });
  }
});