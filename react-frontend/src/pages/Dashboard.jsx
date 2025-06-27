import React, { useState } from 'react';
import { Home, Users, AlertCircle, MessageSquare, Bell, Settings, Plus, Bug } from 'lucide-react';

const Dashboard = () => {
  // Mock data - in a real app, this would come from props or API calls
  const user = { name: 'Username' };
  const projects = [
    {
      id: 1,
      name: 'Devchat Platform',
      description: 'Collaboration tool for developers',
      role: 'Admin',
      members: 5,
      openIssues: 8,
    },
    {
      id: 2,
      name: 'API Refactor',
      description: 'Backend improvements and bugfixes',
      role: 'Contributor',
      members: 3,
      openIssues: 2,
    },
  ];

  const activities = [
    { id: 1, text: 'You mentioned @alex in Devchat Platform', time: '2m ago' },
    { id: 2, text: 'API Refactor issue #42 assigned to you', time: '10m ago' },
    { id: 3, text: 'New message in Team Chat', time: '30m ago' },
    { id: 4, text: 'Project "Mobile App" created successfully', time: '1h ago' },
    { id: 5, text: 'Bug fix merged in Devchat Platform', time: '2h ago' },
  ];

  const assignedIssues = [
    {
      id: 1,
      title: 'Login fails with OAuth on Safari',
      type: 'Bug',
      priority: 'High Priority',
      status: 'Open',
      project: 'Devchat Platform',
      assignedBy: '@alex',
    },
    {
      id: 2,
      title: 'Add code snippet formatting to chat',
      type: 'Feature',
      priority: 'Medium Priority',
      status: 'In Progress',
      project: 'API Refactor',
      assignedBy: '@sara',
    },
    {
      id: 3,
      title: 'Database optimization for large datasets',
      type: 'Enhancement',
      priority: 'Low Priority',
      status: 'Open',
      project: 'API Refactor',
      assignedBy: '@mike',
    },
  ];

  const chatMessages = [
    { id: 1, user: '@alex', text: 'Pushed a fix for the login bug 🚀' },
    { id: 2, user: '@you', text: 'Great! Reviewing now.' },
    { id: 3, user: '@sara', text: 'Can we add code snippet support to chat?' },
  ];

  const NavItem = ({ href, children, active = false }) => (
    <a
      href={href}
      className={`block px-4 py-2 rounded-lg transition ${
        active ? 'text-purple-400 bg-purple-400/10 font-semibold' : 'text-gray-300 hover:bg-purple-400/10 hover:text-purple-400'
      }`}
    >
      {children}
    </a>
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-zinc-800/95 border border-purple-400/15 rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
      <p className="text-gray-400 mb-2">{project.description}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-purple-400/20 text-purple-400 px-2 py-1 rounded">{project.role}</span>
        <span className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded">{project.members} members</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{project.openIssues} open issues</span>
        <button className="bg-purple-400 text-black rounded px-4 py-1 text-sm font-semibold hover:bg-purple-300 transition">
          Open
        </button>
      </div>
    </div>
  );

  const IssueCard = ({ issue }) => (
    <div className="bg-zinc-800/95 border border-purple-400/15 rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm bg-purple-400/20 text-purple-400 px-2 py-1 rounded">{issue.type}</span>
        <span className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded">{issue.priority}</span>
        <span className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded">{issue.status}</span>
      </div>
      <div className="font-semibold text-gray-100">{issue.title}</div>
      <div className="text-xs text-gray-400">Project: {issue.project}</div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Assigned by {issue.assignedBy}</span>
        <button className="bg-purple-400 text-black rounded px-4 py-1 text-sm font-semibold hover:bg-purple-300 transition">
          View
        </button>
      </div>
    </div>
  );

  const TeamChat = () => (
    <section>
      <h2 className="text-purple-400 font-bold text-xl mb-4">Team Chat</h2>
      <div className="bg-zinc-800/95 border border-purple-400/15 rounded-xl shadow p-5 space-y-4">
        {chatMessages.map(message => (
          <div key={message.id} className="text-gray-200 text-sm">
            <strong>{message.user}:</strong> {message.text}
          </div>
        ))}
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 bg-zinc-800 border border-purple-400/15 rounded-lg text-white"
            placeholder="Type a message..."
          />
          <button className="bg-purple-400 text-black rounded px-4 py-1 ml-2 text-sm font-semibold hover:bg-purple-300 transition">
            Send
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur border-b border-purple-400/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="font-bold text-2xl text-purple-400 tracking-tight">Devchat</div>
          <div className="hidden md:flex gap-8">
            <a href="#" className="relative text-gray-300 hover:text-purple-400 font-medium transition">
              Dashboard
            </a>
            <a href="#" className="relative text-gray-300 hover:text-purple-400 font-medium transition">
              Projects
            </a>
            <a href="#" className="relative text-gray-300 hover:text-purple-400 font-medium transition">
              Issues
            </a>
            <a href="#" className="relative text-gray-300 hover:text-purple-400 font-medium transition">
              Messages
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="text-gray-300 hover:text-purple-400">Login</a>
            <a href="#" className="text-gray-300 hover:text-purple-400">Sign Up</a>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex pt-24 max-w-7xl mx-auto min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:block w-60 px-4">
          <nav className="flex flex-col gap-2">
            <NavItem href="#" active={true}>
              <div className="flex items-center gap-2">
                <Home size={18} /> Home
              </div>
            </NavItem>
            <NavItem href="#">
              <div className="flex items-center gap-2">
                <Users size={18} /> My Projects
              </div>
            </NavItem>
            <NavItem href="#">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} /> Assigned Issues
              </div>
            </NavItem>
            <NavItem href="#">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} /> Team Chat
              </div>
            </NavItem>
            <NavItem href="#">
              <div className="flex items-center gap-2">
                <Bell size={18} /> Notifications
              </div>
            </NavItem>
            <NavItem href="#">
              <div className="flex items-center gap-2">
                <Settings size={18} /> Settings
              </div>
            </NavItem>
          </nav>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 px-4 md:px-8 space-y-8">
          {/* Welcome & Quick Actions */}
          <section className="bg-zinc-800/95 border border-purple-400/20 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {user.name}</h1>
              <p className="text-gray-300">Collaborate, manage projects, and chat with your team in one place.</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-purple-400 text-black font-semibold rounded-lg px-5 py-2 hover:bg-purple-300 transition flex items-center gap-2">
                <Plus size={18} /> New Project
              </button>
              <button className="bg-zinc-800 text-purple-400 border border-purple-400 font-semibold rounded-lg px-5 py-2 hover:bg-purple-400/10 hover:text-purple-300 transition flex items-center gap-2">
                <Bug size={18} /> Create Issue
              </button>
            </div>
          </section>

          {/* Project Overview */}
          <section>
            <h2 className="text-purple-400 font-bold text-xl mb-4">Your Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Activity Feed */}
          <section>
            <h2 className="text-purple-400 font-bold text-xl mb-4">Recent Activity</h2>
            <div className="bg-zinc-800/95 border border-purple-400/15 rounded-xl shadow p-5">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 py-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0"></span>
                    <span className="text-gray-200 text-sm flex-1">{activity.text}</span>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Chat */}
          <TeamChat />

          {/* Assigned Issues */}
          <section>
            <h2 className="text-purple-400 font-bold text-xl mb-4">Assigned Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;