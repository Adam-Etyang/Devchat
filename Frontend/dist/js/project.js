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
  const response = await fetch('http://localhost:8080/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}


document.addEventListener('DOMContentLoaded', () => {
  const projectData = {
    name: 'Test Project',
    description: 'This is a test project',
    userId: 1
  };
  createProject(projectData);
});