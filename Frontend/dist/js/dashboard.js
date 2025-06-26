import { fetchProjectsByUser } from './project.js';

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

// Mock: fetch recent activity (replace with real API call)
async function fetchRecentActivity(userId) {
  return [
    { text: 'You mentioned <b>@alex</b> in <b>Devchat Platform</b>', time: '2m ago' },
    { text: '<b>API Refactor</b> issue <b>#42</b> assigned to you', time: '10m ago' },
    { text: 'New message in <b>Team Chat</b>', time: '30m ago' }
  ];
}

// Populate dashboard
async function populateDashboard() {
  const user = await fetchCurrentUser();
  document.getElementById('username').textContent = user.username;

  // Projects
  let projects = [];
  try {
    projects = await fetchProjectsByUser(user.id);
  } catch (e) {
    // fallback to empty or mock
    projects = [];
  }
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = '';
  projects.forEach(p => {
    projectsList.innerHTML += `
      <div class="bg-[#18181b]/95 border border-devpurple/15 rounded-xl shadow p-5">
        <h3 class="text-lg font-semibold mb-1">${p.name}</h3>
        <p class="text-gray-400 mb-2">${p.description}</p>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs bg-devpurple/20 text-devpurple px-2 py-1 rounded">${p.role || ''}</span>
          <span class="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">${p.members || 0} members</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-400">${p.openIssues || 0} open issues</span>
          <a href="../pages/projects.html" class="bg-devpurple text-black rounded px-4 py-1 text-sm font-semibold hover:bg-devpurplelight transition">Open</a>
        </div>
      </div>
    `;
  });

  // Activity
  const activity = await fetchRecentActivity(user.id);
  const activityFeed = document.getElementById('activity-feed');
  activityFeed.innerHTML = '';
  activity.forEach(a => {
    activityFeed.innerHTML += `
      <div class="flex items-center gap-3">
        <span class="w-2 h-2 rounded-full bg-devpurple"></span>
        <span class="text-gray-200 text-sm">${a.text}</span>
        <span class="ml-auto text-xs text-gray-400">${a.time}</span>
      </div>
    `;
  });

  // Assigned Issues
  const assignedIssues = await fetchAssignedIssues(user.id);
  const assignedIssuesDiv = document.getElementById('assigned-issues');
  assignedIssuesDiv.innerHTML = '';
  assignedIssues.forEach(issue => {
    assignedIssuesDiv.innerHTML += `
      <div class="bg-[#18181b]/95 border border-devpurple/15 rounded-xl shadow p-4 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm bg-devpurple/20 text-devpurple px-2 py-1 rounded">${issue.type}</span>
          <span class="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">${issue.priority}</span>
          <span class="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">${issue.status}</span>
        </div>
        <div class="font-semibold text-gray-100">${issue.title}</div>
        <div class="text-xs text-gray-400">Project: ${issue.project}</div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">Assigned by ${issue.assignedBy}</span>
          <a href="${issue.link}" class="bg-devpurple text-black rounded px-4 py-1 text-sm font-semibold hover:bg-devpurplelight transition">View</a>
        </div>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', populateDashboard);
