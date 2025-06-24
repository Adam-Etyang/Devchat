import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const username = 'Username'; // Replace with actual user data

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur border-b border-[rgba(204,129,255,0.2)] shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="font-bold text-2xl text-[#cc81ff] tracking-tight cursor-pointer" onClick={() => navigate('/')}>Devchat</div>
          <div className="hidden md:flex gap-8">
            <button onClick={() => navigate('/dashboard')} className="relative text-gray-300 hover:text-[#cc81ff] font-medium transition">Dashboard</button>
            <button onClick={() => navigate('/projects')} className="relative text-gray-300 hover:text-[#cc81ff] font-medium transition">Projects</button>
            <button onClick={() => navigate('/issues')} className="relative text-gray-300 hover:text-[#cc81ff] font-medium transition">Issues</button>
            <button onClick={() => navigate('/chat')} className="relative text-gray-300 hover:text-[#cc81ff] font-medium transition">Messages</button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 border-2 border-white/30 rounded-md text-white font-medium hover:bg-[#cc81ff]/10 hover:text-[#cc81ff] hover:border-[#cc81ff] transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-4 py-2 rounded-md bg-[#cc81ff] text-black font-semibold hover:bg-[#e6b3ff] transition">Sign Up</button>
          </div>
        </div>
      </nav>
      {/* Main Layout */}
      <div className="flex pt-24 max-w-7xl mx-auto min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:block w-60 px-4">
          <nav className="flex flex-col gap-2">
            <button onClick={() => navigate('/dashboard')} className="block px-4 py-2 rounded-lg text-[#cc81ff] bg-[#cc81ff]/10 font-semibold">Home</button>
            <button onClick={() => navigate('/projects')} className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-[#cc81ff]/10 hover:text-[#cc81ff] transition">My Projects</button>
            <button onClick={() => navigate('/issues')} className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-[#cc81ff]/10 hover:text-[#cc81ff] transition">Assigned Issues</button>
            <button onClick={() => navigate('/chat')} className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-[#cc81ff]/10 hover:text-[#cc81ff] transition">Team Chat</button>
            <button onClick={() => navigate('/notifications')} className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-[#cc81ff]/10 hover:text-[#cc81ff] transition">Notifications</button>
            <button onClick={() => navigate('/settings')} className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-[#cc81ff]/10 hover:text-[#cc81ff] transition">Settings</button>
          </nav>
        </aside>
        {/* Dashboard Content */}
        <main className="flex-1 px-4 md:px-8 space-y-8">
          {/* Welcome & Quick Actions */}
          <section className="bg-[#18181b]/95 border border-[#cc81ff]/20 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {username}</h1>
              <p className="text-gray-300">Collaborate, manage projects, and chat with your team in one place.</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#cc81ff] text-black font-semibold rounded-lg px-5 py-2 hover:bg-[#e6b3ff] transition">New Project</button>
              <button className="bg-[#18181b] text-[#cc81ff] border border-[#cc81ff] font-semibold rounded-lg px-5 py-2 hover:bg-[#cc81ff]/10 hover:text-[#e6b3ff] transition">Create Issue</button>
            </div>
          </section>
          {/* Project Overview */}
          <section>
            <h2 className="text-[#cc81ff] font-bold text-xl mb-4">Your Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#18181b]/95 border border-[#cc81ff]/15 rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold mb-1">Devchat Platform</h3>
                <p className="text-gray-400 mb-2">Collaboration tool for developers</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-[#cc81ff]/20 text-[#cc81ff] px-2 py-1 rounded">Admin</span>
                  <span className="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">5 members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">8 open issues</span>
                  <button className="bg-[#cc81ff] text-black rounded px-4 py-1 text-sm font-semibold hover:bg-[#e6b3ff] transition">Open</button>
                </div>
              </div>
              <div className="bg-[#18181b]/95 border border-[#cc81ff]/15 rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold mb-1">API Refactor</h3>
                <p className="text-gray-400 mb-2">Backend improvements and bugfixes</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-[#cc81ff]/20 text-[#cc81ff] px-2 py-1 rounded">Contributor</span>
                  <span className="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">3 members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">2 open issues</span>
                  <button className="bg-[#cc81ff] text-black rounded px-4 py-1 text-sm font-semibold hover:bg-[#e6b3ff] transition">Open</button>
                </div>
              </div>
            </div>
          </section>
          {/* Activity Feed & Chat */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Feed */}
            <div className="bg-[#18181b]/95 border border-[#cc81ff]/15 rounded-xl shadow p-5 h-72 flex flex-col">
              <h2 className="text-[#cc81ff] font-bold text-lg mb-3">Recent Activity</h2>
              <div className="flex-1 overflow-y-auto space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#cc81ff]"></span>
                  <span className="text-gray-200 text-sm">You mentioned <b>@alex</b> in <b>Devchat Platform</b></span>
                  <span className="ml-auto text-xs text-gray-400">2m ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#cc81ff]"></span>
                  <span className="text-gray-200 text-sm"><b>API Refactor</b> issue <b>#42</b> assigned to you</span>
                  <span className="ml-auto text-xs text-gray-400">10m ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#cc81ff]"></span>
                  <span className="text-gray-200 text-sm">New message in <b>Team Chat</b></span>
                  <span className="ml-auto text-xs text-gray-400">30m ago</span>
                </div>
              </div>
            </div>
            {/* Team Chat Preview */}
            <div className="bg-[#18181b]/95 border border-[#cc81ff]/15 rounded-xl shadow p-5 h-72 flex flex-col">
              <h2 className="text-[#cc81ff] font-bold text-lg mb-3">Team Chat</h2>
              <div className="flex-1 overflow-y-auto space-y-2">
                <div>
                  <span className="text-[#cc81ff] font-semibold">@alex:</span>
                  <span className="text-gray-200">Pushed a fix for the login bug 🚀</span>
                </div>
                <div>
                  <span className="text-[#cc81ff] font-semibold">@you:</span>
                  <span className="text-gray-200">Great! Reviewing now.</span>
                </div>
                <div>
                  <span className="text-[#cc81ff] font-semibold">@sara:</span>
                  <span className="text-gray-200">Can we add code snippet support to chat?</span>
                </div>
              </div>
              <form className="mt-3 flex gap-2">
                <input type="text" className="flex-1 rounded bg-[#18181b] border border-[#cc81ff]/30 px-3 py-2 text-gray-100 focus:outline-none focus:border-[#cc81ff]" placeholder="Type a message..." />
                <button type="submit" className="bg-[#cc81ff] text-black font-semibold rounded-lg px-4 py-2 hover:bg-[#e6b3ff] transition">Send</button>
              </form>
            </div>
          </section>
          {/* Assigned Issues */}
          <section>
            <h2 className="text-[#cc81ff] font-bold text-xl mb-4">Assigned Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#18181b]/95 border border-[#cc81ff]/15 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-[#cc81ff]/20 text-[#cc81ff] px-2 py-1 rounded">Bug</span>
                  <span className="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">High Priority</span>
                  <span className="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">Open</span>
                </div>
                <div className="font-semibold text-gray-100">Login fails with OAuth on Safari</div>
                <div className="text-xs text-gray-400">Project: Devchat Platform</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Assigned by @alex</span>
                  <button className="bg-[#cc81ff] text-black rounded px-4 py-1 text-sm font-semibold hover:bg-[#e6b3ff] transition">View</button>
                </div>
              </div>
              <div className="bg-[#18181b]/95 border border-[#cc81ff]/15 rounded-xl shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-[#cc81ff]/20 text-[#cc81ff] px-2 py-1 rounded">Feature</span>
                  <span className="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">Medium Priority</span>
                  <span className="text-xs bg-[#18181b] text-gray-300 px-2 py-1 rounded">In Progress</span>
                </div>
                <div className="font-semibold text-gray-100">Add code snippet formatting to chat</div>
                <div className="text-xs text-gray-400">Project: API Refactor</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Assigned by @sara</span>
                  <button className="bg-[#cc81ff] text-black rounded px-4 py-1 text-sm font-semibold hover:bg-[#e6b3ff] transition">View</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 