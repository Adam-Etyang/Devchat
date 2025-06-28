import React, { useState, useRef, useEffect } from 'react';

const initialUser = {
  id: 'user1',
  name: 'Test User',
  avatar: '',
  signedIn: false,
};

const initialProjects = [
  { id: '1', name: 'Demo Project', desc: 'A sample project', messages: [
    { id: 'm1', sender: 'user', username: 'Test User', content: 'Hello world!', time: '16:22:37' },
    { id: 'm2', sender: 'user', username: 'Test User', content: '```js\nconsole.log(123)```', time: '16:22:38' },
  ], colleagues: [], leader: 'user1' }
];

// Enhanced code snippet structure
const createCodeSnippet = (code, language, filename, author) => ({
  id: Date.now().toString(),
  code,
  language,
  filename,
  author,
  createdAt: new Date(),
  versions: [{ version: 1, code, author, timestamp: new Date() }],
  currentVersion: 1,
  collaborators: [author],
  isEditing: false,
  lastEdited: new Date()
});

function renderMessageContent(content) {
  // Check if this is a code snippet message
  const isCodeSnippet = content.includes('```') && content.split('```').length > 2;
  
  if (isCodeSnippet) {
    // Extract code blocks and render them specially
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="code-snippet-message">
        {parts.map((part, i) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const match = part.match(/```(\w*)\n([\s\S]*?)```/);
            const lang = match ? match[1] : '';
            const code = match ? match[2] : part.slice(3, -3);
            
            return (
              <div key={i} className="code-block-container">
                <div className="code-block-header">
                  <div className="code-language">
                    <i className="fas fa-code"></i>
                    {lang || 'text'}
                  </div>
                  <button 
                    className="copy-code-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      window.showToast('Code copied to clipboard!', 'success');
                    }}
                    title="Copy code"
                  >
                    <i className="fas fa-copy"></i>
                    Copy
                  </button>
                </div>
                <pre className="code-block">
                  <code className={`language-${lang}`}>{code}</code>
                </pre>
              </div>
            );
          }
          return <span key={i} className="text-content">{part}</span>;
        })}
      </div>
    );
  }
  
  // Regular message content with inline code support
  return content.split(/(```[\s\S]*?```)/g).map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const lang = match ? match[1] : '';
      const code = match ? match[2] : part.slice(3, -3);
      return (
        <div key={i} className="code-block-container">
          <div className="code-block-header">
            <div className="code-language">
              <i className="fas fa-code"></i>
              {lang || 'text'}
            </div>
            <button 
              className="copy-code-btn"
              onClick={() => {
                navigator.clipboard.writeText(code);
                window.showToast('Code copied to clipboard!', 'success');
              }}
              title="Copy code"
            >
              <i className="fas fa-copy"></i>
              Copy
            </button>
          </div>
          <pre className="code-block">
            <code className={`language-${lang}`}>{code}</code>
          </pre>
        </div>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Extract code snippets from all messages
function extractCodeSnippets(messages) {
  const snippets = [];
  messages.forEach((msg, idx) => {
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(msg.content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2];
      snippets.push({
        id: `${msg.id}_${snippets.length}`,
        code,
        language,
        preview: code.length > 80 ? code.substring(0, 80) + '...' : code,
        msgId: msg.id,
        filename: `snippet_${msg.id}_${snippets.length}.${language}`,
        author: msg.username,
        createdAt: new Date(),
        versions: [{ version: 1, code, author: msg.username, timestamp: new Date() }],
        currentVersion: 1,
        collaborators: [msg.username],
        isEditing: false
      });
    }
  });
  return snippets;
}

const ChatPage = () => {
  // --- State ---
  const [user, setUser] = useState(initialUser);
  const [projects, setProjects] = useState(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState(initialProjects[0].id);
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingMsgValue, setEditingMsgValue] = useState('');
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  
  // New state for collaborative code editing
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [activeCollaborators, setActiveCollaborators] = useState(new Set());
  
  // Colleague management state
  const [showAddColleagueModal, setShowAddColleagueModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newColleagueName, setNewColleagueName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showColleaguesList, setShowColleaguesList] = useState(false);

  const chatMessagesRef = useRef();
  const leftSidebarRef = useRef();
  const rightSidebarRef = useRef();
  const fileInputRef = useRef();

  // --- Derived ---
  const currentProject = projects.find(p => p.id === currentProjectId) || initialProjects[0];
  const extractedSnippets = extractCodeSnippets(currentProject?.messages || []);

  // --- Auth logic ---
  function signInWithGoogle() {
    setUser({ ...user, signedIn: true, name: 'Google User', avatar: '', id: 'user1' });
  }
  function signInWithGitHub() {
    setUser({ ...user, signedIn: true, name: 'GitHub User', avatar: '', id: 'user1' });
  }
  function signOut() {
    setUser({ ...initialUser });
  }

  // --- Project management ---
  function addProject(name, desc) {
    const id = Date.now().toString();
    setProjects(ps => [...ps, { id, name, desc, messages: [], colleagues: [], leader: user.id }]);
    setCurrentProjectId(id);
    setAddProjectOpen(false);
  }
  function selectProject(projectId) {
    setCurrentProjectId(projectId);
  }
  function editProject(id, name, desc) {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, name, desc } : p));
    setEditProjectOpen(false);
    setProjectToEdit(null);
  }
  function deleteProject(id) {
    setProjects(ps => ps.filter(p => p.id !== id));
    if (currentProjectId === id && projects.length > 1) setCurrentProjectId(projects[0].id);
    setProjectMenuOpen(false);
  }
  
  // --- Collaboration ---
  function addColleagueToProject(projectId, colleagueName) {
    if (!colleagueName.trim()) {
      window.showToast('Please enter a colleague name', 'error');
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (project.colleagues.includes(colleagueName)) {
      window.showToast(`${colleagueName} is already a member of this project`, 'warning');
      return;
    }
    
    setProjects(ps => ps.map(p => p.id === projectId ? { ...p, colleagues: [...p.colleagues, colleagueName] } : p));
    setCollaborators(prev => [...prev, { name: colleagueName, id: Date.now().toString() }]);
    
    // Send notification message
    const notificationMsg = {
      id: Date.now().toString(),
      sender: 'system',
      username: 'System',
      content: `👥 **${colleagueName}** has been added to the project by ${user.name}`,
      time: new Date().toLocaleTimeString(),
      type: 'notification'
    };
    
    setProjects(ps => ps.map(p => 
      p.id === projectId 
        ? { ...p, messages: [...p.messages, notificationMsg] } 
        : p
    ));
    
    window.showToast(`${colleagueName} added to project successfully!`, 'success');
    setProjectMenuOpen(false);
  }
  
  function removeColleagueFromProject(projectId, colleagueName) {
    setProjects(ps => ps.map(p => 
      p.id === projectId 
        ? { ...p, colleagues: p.colleagues.filter(c => c !== colleagueName) } 
        : p
    ));
    
    // Send notification message
    const notificationMsg = {
      id: Date.now().toString(),
      sender: 'system',
      username: 'System',
      content: `👋 **${colleagueName}** has been removed from the project by ${user.name}`,
      time: new Date().toLocaleTimeString(),
      type: 'notification'
    };
    
    setProjects(ps => ps.map(p => 
      p.id === projectId 
        ? { ...p, messages: [...p.messages, notificationMsg] } 
        : p
    ));
    
    window.showToast(`${colleagueName} removed from project`, 'info');
  }
  
  function setProjectLeader(projectId, userId) {
    setProjects(ps => ps.map(p => p.id === projectId ? { ...p, leader: userId } : p));
    
    const newLeader = projects.find(p => p.id === projectId)?.colleagues.find(c => c.id === userId)?.name || 'Unknown';
    
    // Send notification message
    const notificationMsg = {
      id: Date.now().toString(),
      sender: 'system',
      username: 'System',
      content: `👑 **${newLeader}** is now the project leader`,
      time: new Date().toLocaleTimeString(),
      type: 'notification'
    };
    
    setProjects(ps => ps.map(p => 
      p.id === projectId 
        ? { ...p, messages: [...p.messages, notificationMsg] } 
        : p
    ));
    
    window.showToast(`Project leader changed to ${newLeader}`, 'success');
    setProjectMenuOpen(false);
  }
  
  function inviteColleagueByEmail(projectId, email) {
    if (!email.trim() || !email.includes('@')) {
      window.showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Simulate sending invitation
    window.showToast(`Invitation sent to ${email}`, 'success');
    
    // Send notification message
    const notificationMsg = {
      id: Date.now().toString(),
      sender: 'system',
      username: 'System',
      content: `📧 Invitation sent to **${email}**`,
      time: new Date().toLocaleTimeString(),
      type: 'notification'
    };
    
    setProjects(ps => ps.map(p => 
      p.id === projectId 
        ? { ...p, messages: [...p.messages, notificationMsg] } 
        : p
    ));
    
    setProjectMenuOpen(false);
  }
  
  function generateInviteLink(projectId) {
    const project = projects.find(p => p.id === projectId);
    const inviteLink = `${window.location.origin}/invite/${projectId}`;
    
    navigator.clipboard.writeText(inviteLink);
    window.showToast('Invite link copied to clipboard!', 'success');
    
    // Send notification message
    const notificationMsg = {
      id: Date.now().toString(),
      sender: 'system',
      username: 'System',
      content: `🔗 Invite link generated and copied to clipboard`,
      time: new Date().toLocaleTimeString(),
      type: 'notification'
    };
    
    setProjects(ps => ps.map(p => 
      p.id === projectId 
        ? { ...p, messages: [...p.messages, notificationMsg] } 
        : p
    ));
  }
  
  // --- Profile ---
  function updateProfilePicture() {
    setUser(u => ({ ...u, avatar: u.avatar ? '' : 'https://i.pravatar.cc/100?u=' + u.id }));
    setProfileMenuOpen(false);
  }
  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    setProfileMenuOpen(false);
  }

  // --- File Upload and Code Sharing ---
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const language = getLanguageFromFilename(file.name);
      const snippet = createCodeSnippet(content, language, file.name, user.name);
      
      setCodeSnippets(prev => [...prev, snippet]);
      
      // Send file as message
      const fileMessage = {
        id: Date.now().toString(),
        sender: 'user',
        username: user.name || 'Test User',
        content: `📁 **${file.name}** uploaded\n\`\`\`${language}\n${content}\n\`\`\``,
        time: new Date().toLocaleTimeString(),
        type: 'file',
        file: { name: file.name, size: file.size, type: file.type }
      };
      
      setProjects(ps => ps.map(p => 
        p.id === currentProjectId 
          ? { ...p, messages: [...p.messages, fileMessage] } 
          : p
      ));
      
      window.showToast(`File ${file.name} uploaded successfully!`, 'success');
    };
    reader.readAsText(file);
  };

  const getLanguageFromFilename = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'txt': 'text'
    };
    return languageMap[ext] || 'text';
  };

  // --- Collaborative Code Editing ---
  const startCodeEdit = (snippet) => {
    if (snippet.isEditing && snippet.currentEditor !== user.name) {
      window.showToast(`${snippet.currentEditor} is currently editing this file`, 'warning');
      return;
    }
    
    setEditingSnippet({
      ...snippet,
      isEditing: true,
      currentEditor: user.name,
      lastEdited: new Date()
    });
    setShowCodeEditor(true);
    
    // Notify other collaborators
    setActiveCollaborators(prev => new Set([...prev, user.name]));
  };

  const saveCodeEdit = (snippet, newCode) => {
    const newVersion = {
      version: snippet.currentVersion + 1,
      code: newCode,
      author: user.name,
      timestamp: new Date()
    };

    const updatedSnippet = {
      ...snippet,
      code: newCode,
      currentVersion: newVersion.version,
      versions: [...snippet.versions, newVersion],
      isEditing: false,
      currentEditor: null,
      lastEdited: new Date()
    };

    setCodeSnippets(prev => prev.map(s => s.id === snippet.id ? updatedSnippet : s));
    setShowCodeEditor(false);
    setEditingSnippet(null);
    setActiveCollaborators(prev => {
      const newSet = new Set(prev);
      newSet.delete(user.name);
      return newSet;
    });

    // Send update message
    const updateMessage = {
      id: Date.now().toString(),
      sender: 'user',
      username: user.name || 'Test User',
      content: `📝 **${snippet.filename}** updated by ${user.name}\n\`\`\`${snippet.language}\n${newCode}\n\`\`\``,
      time: new Date().toLocaleTimeString(),
      type: 'code-update',
      snippetId: snippet.id
    };

    setProjects(ps => ps.map(p => 
      p.id === currentProjectId 
        ? { ...p, messages: [...p.messages, updateMessage] } 
        : p
    ));

    window.showToast(`Code saved successfully!`, 'success');
  };

  const cancelCodeEdit = () => {
    setShowCodeEditor(false);
    setEditingSnippet(null);
    setActiveCollaborators(prev => {
      const newSet = new Set(prev);
      newSet.delete(user.name);
      return newSet;
    });
  };

  // --- Chat logic (fixed) ---
  const handleSend = () => {
    if (!message.trim()) return;
    
    try {
      const now = new Date();
      
      // Detect if message contains code snippets
      const hasCodeSnippets = message.includes('```') && message.split('```').length > 2;
      const messageType = hasCodeSnippets ? 'code-snippet' : 'text';
      
      const msg = {
        id: Date.now().toString(),
        sender: 'user',
        username: user.name || 'Test User',
        content: message,
        time: now.toLocaleTimeString(),
        type: messageType
      };
      
      console.log('Sending message:', msg);
      console.log('Current project ID:', currentProjectId);
      console.log('Current projects:', projects);
      
      setProjects(ps => {
        const updatedProjects = ps.map(p => 
          p.id === currentProjectId 
            ? { ...p, messages: [...p.messages, msg] } 
            : p
        );
        console.log('Updated projects:', updatedProjects);
        return updatedProjects;
      });
      
      setMessage('');
      setReplyTo(null);
      
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 100);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          username: 'AI Assistant',
          content: `Thanks for your message! I'm here to help with your coding questions.${message.includes('```') ? '\n\nI see you\'ve shared some code. Let me take a look at that for you.' : ''}`,
          time: new Date().toLocaleTimeString(),
          type: message.includes('```') ? 'code-snippet' : 'text'
        };
        
        setProjects(ps => ps.map(p => 
          p.id === currentProjectId 
            ? { ...p, messages: [...p.messages, aiResponse] } 
            : p
        ));
        
        setTimeout(() => {
          if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          }
        }, 100);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      window.showToast('Error sending message', 'error');
    }
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
    setMessage(`@${msg.username} `);
  };

  const startEdit = (msg) => {
    setEditingMsgId(msg.id);
    setEditingMsgValue(msg.content);
  };
  
  const saveEdit = (msg) => {
    try {
      setProjects(ps => ps.map(p => 
        p.id === currentProjectId 
          ? {
              ...p,
              messages: p.messages.map(m => 
                m.id === msg.id 
                  ? { ...m, content: editingMsgValue } 
                  : m
              )
            }
          : p
      ));
      setEditingMsgId(null);
      setEditingMsgValue('');
    } catch (error) {
      console.error('Error saving edit:', error);
      window.showToast('Error saving message', 'error');
    }
  };
  
  const cancelEdit = () => {
    setEditingMsgId(null);
    setEditingMsgValue('');
  };
  
  const deleteMsg = (msg) => {
    try {
      setProjects(ps => ps.map(p => 
        p.id === currentProjectId 
          ? {
              ...p,
              messages: p.messages.filter(m => m.id !== msg.id)
            }
          : p
      ));
    } catch (error) {
      console.error('Error deleting message:', error);
      window.showToast('Error deleting message', 'error');
    }
  };

  // Snippet actions
  const editSnippet = (snippet) => {
    startCodeEdit(snippet);
  };
  
  const deleteSnippet = (snippet) => {
    setCodeSnippets(prev => prev.filter(s => s.id !== snippet.id));
    window.showToast('Code snippet deleted', 'info');
  };
  
  const replyToSnippet = (snippet) => {
    setReplyTo(snippet);
    setMessage(`@snippet ${snippet.filename} `);
  };
  
  const sendSnippetToChat = (snippet) => {
    setMessage('```' + snippet.language + '\n' + snippet.code + '```');
  };

  const downloadSnippet = (snippet) => {
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = snippet.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.showToast(`Downloaded ${snippet.filename}`, 'success');
  };

  // Resizable sidebars
  useEffect(() => {
    const makeResizable = (ref, direction) => {
      if (!ref.current) return;
      let isResizing = false;
      let startX, startWidth;
      const handle = document.createElement('div');
      handle.className = 'resize-handle';
      handle.style.position = 'absolute';
      handle.style[direction] = 0;
      handle.style.top = 0;
      handle.style.width = '6px';
      handle.style.height = '100%';
      handle.style.background = 'transparent';
      handle.style.cursor = 'col-resize';
      handle.style.zIndex = 1000;
      ref.current.appendChild(handle);
      handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = ref.current.offsetWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        let deltaX = direction === 'right' ? e.clientX - startX : startX - e.clientX;
        const newWidth = Math.max(180, Math.min(400, startWidth + deltaX));
        ref.current.style.width = newWidth + 'px';
      });
      document.addEventListener('mouseup', () => {
        if (isResizing) {
          isResizing = false;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
        }
      });
    };
    makeResizable(leftSidebarRef, 'right');
    makeResizable(rightSidebarRef, 'left');
  }, []);

  // --- UI ---
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', background: '#181a20', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', margin: 0, padding: 0, zIndex: 0 }}>
      {/* Sidebar */}
      <aside ref={leftSidebarRef} style={{ width: 72, minWidth: 72, maxWidth: 72, background: '#20222b', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', position: 'relative', height: '100vh', borderRight: '1px solid #23262f', boxShadow: '2px 0 8px 0 rgba(0,0,0,0.10)' }}>
        {/* Projects icons */}
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {projects.map(p => (
            <div key={p.id} onClick={() => selectProject(p.id)} style={{ width: 44, height: 44, borderRadius: 12, background: p.id === currentProjectId ? '#8B5CF6' : 'transparent', color: p.id === currentProjectId ? '#fff' : '#b0b3c6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, cursor: 'pointer', marginBottom: 4, position: 'relative', transition: 'background 0.15s' }}>
              <i className="fas fa-code"></i>
              {p.id === currentProjectId && (
                <button onClick={e => { e.stopPropagation(); setProjectMenuOpen(v => !v); setProjectToEdit(p); }} style={{ position: 'absolute', top: 2, right: 2, background: 'none', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', padding: 2 }} title="Project Actions">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              )}
            </div>
          ))}
          <button onClick={() => setAddProjectOpen(true)} style={{ width: 44, height: 44, borderRadius: 12, background: '#23273a', color: '#8B5CF6', border: 'none', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8, cursor: 'pointer' }} title="Add Project">
            <i className="fas fa-plus"></i>
          </button>
        </div>
        {/* Profile card at bottom */}
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 8, cursor: 'pointer', position: 'relative' }} onClick={() => setProfileMenuOpen(v => !v)}>
          {user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%' }} /> : user.name[0]}
          {profileMenuOpen && (
            <div style={{ position: 'absolute', left: 56, bottom: 0, background: '#23273a', borderRadius: 10, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)', zIndex: 10, minWidth: 180, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, padding: '0 18px 8px 18px' }}>{user.name}</div>
              <button onClick={() => { updateProfilePicture(); setProfileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#8B5CF6', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fas fa-user-circle" style={{ marginRight: 8 }}></i>Update Avatar</button>
              <button onClick={() => { toggleTheme(); setProfileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#8B5CF6', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fas fa-moon" style={{ marginRight: 8 }}></i>Toggle Theme</button>
              {!user.signedIn && <button onClick={() => { signInWithGoogle(); setProfileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#ea4335', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fab fa-google" style={{ marginRight: 8 }}></i>Sign in with Google</button>}
              {!user.signedIn && <button onClick={() => { signInWithGitHub(); setProfileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%', background: '#24292e' }}><i className="fab fa-github" style={{ marginRight: 8 }}></i>Sign in with GitHub</button>}
              {user.signedIn && <button onClick={() => { signOut(); setProfileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#ff6b6b', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>Sign Out</button>}
            </div>
          )}
        </div>
      </aside>
      {/* Main Chat Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', background: '#181a20' }}>
        {/* Header */}
        <div style={{ background: '#23273a', padding: '16px 32px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>
              <i className="fas fa-code"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 600 }}>{currentProject.name}</h3>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: 14 }}>{currentProject.desc}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Team Management Buttons */}
            <button 
              className="btn btn-small btn-secondary"
              onClick={() => setShowColleaguesList(true)}
              title="View team members"
            >
              <i className="fas fa-users"></i>
              <span style={{ marginLeft: 6 }}>{currentProject.colleagues.length + 1}</span>
            </button>
            
            <button 
              className="btn btn-small btn-primary"
              onClick={() => setShowAddColleagueModal(true)}
              title="Add team member"
            >
              <i className="fas fa-user-plus"></i>
            </button>
            
            <button 
              className="btn btn-small btn-secondary"
              onClick={() => setShowInviteModal(true)}
              title="Invite by email"
            >
              <i className="fas fa-envelope"></i>
            </button>
            
            <button 
              className="btn btn-small btn-secondary"
              onClick={() => generateInviteLink(currentProjectId)}
              title="Generate invite link"
            >
              <i className="fas fa-link"></i>
            </button>
            
            {/* Project Menu */}
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-small btn-secondary"
                onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                title="Project options"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              
              {projectMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, background: '#23273a', border: '1px solid #374151', borderRadius: 8, padding: 8, minWidth: 200, zIndex: 1000, marginTop: 4 }}>
                  <button 
                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 4 }}
                    onClick={() => { setEditProjectOpen(true); setProjectToEdit(currentProject); setProjectMenuOpen(false); }}
                  >
                    <i className="fas fa-edit" style={{ marginRight: 8 }}></i>
                    Edit Project
                  </button>
                  <button 
                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: 4 }}
                    onClick={() => { deleteProject(currentProject.id); setProjectMenuOpen(false); }}
                  >
                    <i className="fas fa-trash" style={{ marginRight: 8 }}></i>
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Messages */}
        <div ref={chatMessagesRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 24, minHeight: 0, background: '#181a20' }}>
          {currentProject.messages.map(msg => {
            const isUser = msg.sender === 'user';
            const isEditing = editingMsgId === msg.id;
            const messageType = msg.type || 'text';
            
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 16, padding: '0 48px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#23273a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20 }}>
                  <i className="fas fa-user"></i>
                </div>
                <div 
                  className={`message ${isUser ? 'user-message' : 'ai-message'}`}
                  data-type={messageType}
                  style={{ 
                    background: isUser ? '#8B5CF6' : '#23273a', 
                    color: '#fff', 
                    borderRadius: 16, 
                    padding: '16px 22px', 
                    minWidth: 120, 
                    maxWidth: 420, 
                    fontSize: 17, 
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', 
                    position: 'relative', 
                    transition: 'box-shadow 0.15s', 
                    wordBreak: 'break-word' 
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, color: isUser ? '#fff' : '#8B5CF6', marginBottom: 2 }}>
                    {msg.username} 
                    <span style={{ fontWeight: 400, fontSize: 13, color: '#b0b3c6', marginLeft: 8 }}>{msg.time}</span>
                  </div>
                  {isEditing ? (
                    <>
                      <textarea value={editingMsgValue} onChange={e => setEditingMsgValue(e.target.value)} style={{ width: '100%', minHeight: 60, borderRadius: 8, marginBottom: 8, background: '#181a20', color: '#fff', border: 'none', fontSize: 16, padding: 8 }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-small btn-primary" onClick={() => saveEdit(msg)}>Save</button>
                        <button className="btn btn-small btn-secondary" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>{renderMessageContent(msg.content)}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, opacity: 0.7 }}>
                        <button style={{ background: 'none', border: 'none', color: '#b0b3c6', cursor: 'pointer', fontSize: 16 }} onClick={() => handleReply(msg)} title="Reply"><i className="fas fa-reply"></i></button>
                        <button style={{ background: 'none', border: 'none', color: '#b0b3c6', cursor: 'pointer', fontSize: 16 }} onClick={() => startEdit(msg)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button style={{ background: 'none', border: 'none', color: '#b0b3c6', cursor: 'pointer', fontSize: 16 }} onClick={() => deleteMsg(msg)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Input */}
        <div style={{ padding: 24, borderTop: '1px solid var(--border-color)', background: '#23273a', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.10)' }}>
          <input 
            ref={fileInputRef}
            type="file" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload}
            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.md,.txt"
          />
          <button 
            style={{ background: '#374151', color: '#fff', border: 'none', borderRadius: 12, width: 48, height: 48, fontSize: 18, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }} 
            onClick={() => fileInputRef.current?.click()}
            title="Upload File"
          >
            <i className="fas fa-upload"></i>
          </button>
          <input style={{ flex: 1, border: 'none', background: '#181a20', color: '#fff', borderRadius: 12, padding: '14px 18px', fontSize: 17, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }} placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }} />
          <button style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 12, width: 48, height: 48, fontSize: 22, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }} onClick={handleSend}><i className="fas fa-paper-plane"></i></button>
        </div>
      </main>
      {/* Enhanced Snippets Sidebar */}
      <aside ref={rightSidebarRef} style={{ width: 320, minWidth: 180, maxWidth: 400, background: '#23273a', display: 'flex', flexDirection: 'column', padding: 24, position: 'relative', height: '100vh', borderLeft: '1px solid #23262f', boxShadow: '-2px 0 8px 0 rgba(0,0,0,0.10)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: 0.5 }}>Code Files</div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 14, cursor: 'pointer' }}
            title="Upload New File"
          >
            <i className="fas fa-plus" style={{ marginRight: 4 }}></i>Upload
          </button>
        </div>
        
        {/* Active Collaborators */}
        {activeCollaborators.size > 0 && (
          <div style={{ background: '#181a20', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#8B5CF6', marginBottom: 8 }}>Active Editors:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Array.from(activeCollaborators).map(collaborator => (
                <div key={collaborator} style={{ background: '#8B5CF6', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
                  {collaborator}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Files List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {codeSnippets.length === 0 ? (
            <div style={{ color: '#b0b3c6', fontSize: 16, marginTop: 16, textAlign: 'center' }}>
              <i className="fas fa-file-code" style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}></i>
              <div>No code files yet</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>Upload a file to get started</div>
            </div>
          ) : (
            codeSnippets.map(snippet => (
              <div key={snippet.id} style={{ 
                background: snippet.isEditing ? '#2d3748' : '#181a20', 
                borderRadius: 12, 
                padding: '16px 18px', 
                marginBottom: 16, 
                color: '#fff', 
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 6,
                border: snippet.isEditing ? '2px solid #8B5CF6' : '1px solid transparent'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#8B5CF6' }}>{snippet.filename}</div>
                  {snippet.isEditing && (
                    <div style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="fas fa-circle" style={{ fontSize: 8 }}></i>
                      Editing
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
                  {snippet.language} • v{snippet.currentVersion} • {snippet.author}
                </div>
                <pre style={{ background: 'none', color: '#b0b3c6', fontSize: 13, margin: 0, padding: 0, overflowX: 'auto', maxHeight: 60, overflowY: 'hidden' }}>
                  <code>{snippet.preview}</code>
                </pre>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, opacity: 0.7 }}>
                  <button 
                    style={{ 
                      background: snippet.isEditing ? '#374151' : 'none', 
                      border: 'none', 
                      color: snippet.isEditing ? '#9ca3af' : '#b0b3c6', 
                      cursor: snippet.isEditing ? 'not-allowed' : 'pointer', 
                      fontSize: 16,
                      padding: '4px 8px',
                      borderRadius: 4
                    }} 
                    onClick={() => editSnippet(snippet)} 
                    title={snippet.isEditing ? `${snippet.currentEditor} is editing` : "Edit"}
                    disabled={snippet.isEditing}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button style={{ background: 'none', border: 'none', color: '#b0b3c6', cursor: 'pointer', fontSize: 16, padding: '4px 8px', borderRadius: 4 }} onClick={() => replyToSnippet(snippet)} title="Reply"><i className="fas fa-reply"></i></button>
                  <button style={{ background: 'none', border: 'none', color: '#8B5CF6', cursor: 'pointer', fontSize: 16, padding: '4px 8px', borderRadius: 4 }} onClick={() => sendSnippetToChat(snippet)} title="Send to Chat"><i className="fas fa-paper-plane"></i></button>
                  <button style={{ background: 'none', border: 'none', color: '#b0b3c6', cursor: 'pointer', fontSize: 16, padding: '4px 8px', borderRadius: 4 }} onClick={() => downloadSnippet(snippet)} title="Download"><i className="fas fa-download"></i></button>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: '4px 8px', borderRadius: 4 }} onClick={() => deleteSnippet(snippet)} title="Delete"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Collaborative Code Editor Modal */}
      {showCodeEditor && editingSnippet && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.8)', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{ 
            background: '#1a1b26', 
            borderRadius: 12, 
            width: '90%', 
            maxWidth: 800, 
            height: '80%', 
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            {/* Editor Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '16px 24px', 
              borderBottom: '1px solid #374151',
              background: '#23273a'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fas fa-file-code" style={{ color: '#8B5CF6', fontSize: 20 }}></i>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>{editingSnippet.filename}</div>
                  <div style={{ color: '#9ca3af', fontSize: 12 }}>Editing as {user.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => saveCodeEdit(editingSnippet, editingSnippet.code)} 
                  style={{ 
                    background: '#10b981', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '8px 16px', 
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-save" style={{ marginRight: 6 }}></i>Save
                </button>
                <button 
                  onClick={cancelCodeEdit} 
                  style={{ 
                    background: '#374151', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '8px 16px', 
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div style={{ flex: 1, padding: 0, position: 'relative' }}>
              <textarea
                value={editingSnippet.code}
                onChange={(e) => setEditingSnippet({ ...editingSnippet, code: e.target.value })}
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#1a1b26',
                  color: '#a9b1d6',
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  padding: '20px',
                  lineHeight: 1.5,
                  resize: 'none'
                }}
                placeholder="Start coding..."
              />
            </div>

            {/* Editor Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 24px', 
              borderTop: '1px solid #374151',
              background: '#23273a',
              fontSize: 12,
              color: '#9ca3af'
            }}>
              <div>
                Language: {editingSnippet.language} • Version: {editingSnippet.currentVersion} • Author: {editingSnippet.author}
              </div>
              <div>
                Last edited: {editingSnippet.lastEdited.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project actions dropdown and modals remain as before */}
      {projectMenuOpen && projectToEdit && (
        <div style={{ position: 'fixed', left: 96, top: 120, background: '#23273a', borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)', zIndex: 100, minWidth: 180, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <button onClick={() => { setEditProjectOpen(true); setProjectMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fas fa-edit" style={{ marginRight: 8 }}></i>Edit Project</button>
          <button onClick={() => { deleteProject(projectToEdit.id); }} style={{ background: 'none', border: 'none', color: '#ff6b6b', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fas fa-trash" style={{ marginRight: 8 }}></i>Delete Project</button>
          <button onClick={() => { addColleagueToProject(projectToEdit.id, 'Colleague'); }} style={{ background: 'none', border: 'none', color: '#8B5CF6', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fas fa-user-plus" style={{ marginRight: 8 }}></i>Add Colleague</button>
          <button onClick={() => { setProjectLeader(projectToEdit.id, user.id); }} style={{ background: 'none', border: 'none', color: '#8B5CF6', textAlign: 'left', padding: '10px 18px', fontSize: 15, cursor: 'pointer', width: '100%' }}><i className="fas fa-crown" style={{ marginRight: 8 }}></i>Set Leader</button>
        </div>
      )}
      {addProjectOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23273a', borderRadius: 12, padding: 32, minWidth: 320 }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>Add Project</h3>
            <input id="newProjectName" placeholder="Project Name" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: 'none', background: '#181a20', color: '#fff' }} />
            <input id="newProjectDesc" placeholder="Description" style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: 'none', background: '#181a20', color: '#fff' }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setAddProjectOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => addProject(document.getElementById('newProjectName').value, document.getElementById('newProjectDesc').value)} className="btn btn-primary">Add</button>
            </div>
          </div>
        </div>
      )}
      {editProjectOpen && projectToEdit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23273a', borderRadius: 12, padding: 32, minWidth: 320 }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>Edit Project</h3>
            <input id="editProjectName" defaultValue={projectToEdit.name} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: 'none', background: '#181a20', color: '#fff' }} />
            <input id="editProjectDesc" defaultValue={projectToEdit.desc} style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: 'none', background: '#181a20', color: '#fff' }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditProjectOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => editProject(projectToEdit.id, document.getElementById('editProjectName').value, document.getElementById('editProjectDesc').value)} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Colleague Management Modals */}
      {showAddColleagueModal && (
        <div className="modal-overlay" onClick={() => setShowAddColleagueModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Colleague</h3>
              <button onClick={() => setShowAddColleagueModal(false)} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Colleague Name</label>
                <input
                  type="text"
                  value={newColleagueName}
                  onChange={e => setNewColleagueName(e.target.value)}
                  placeholder="Enter colleague name"
                  onKeyPress={e => e.key === 'Enter' && addColleagueToProject(currentProjectId, newColleagueName)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddColleagueModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  addColleagueToProject(currentProjectId, newColleagueName);
                  setNewColleagueName('');
                  setShowAddColleagueModal(false);
                }}
              >
                Add Colleague
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invite by Email</h3>
              <button onClick={() => setShowInviteModal(false)} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  onKeyPress={e => e.key === 'Enter' && inviteColleagueByEmail(currentProjectId, inviteEmail)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  inviteColleagueByEmail(currentProjectId, inviteEmail);
                  setInviteEmail('');
                  setShowInviteModal(false);
                }}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {showColleaguesList && (
        <div className="modal-overlay" onClick={() => setShowColleaguesList(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Project Team</h3>
              <button onClick={() => setShowColleaguesList(false)} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="team-members">
                <div className="team-member">
                  <div className="member-info">
                    <div className="member-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="member-details">
                      <div className="member-name">{user.name}</div>
                      <div className="member-role">Project Owner</div>
                    </div>
                  </div>
                </div>
                
                {currentProject.colleagues.map((colleague, index) => (
                  <div key={index} className="team-member">
                    <div className="member-info">
                      <div className="member-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="member-details">
                        <div className="member-name">{colleague}</div>
                        <div className="member-role">Team Member</div>
                      </div>
                    </div>
                    <div className="member-actions">
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => removeColleagueFromProject(currentProjectId, colleague)}
                        title="Remove from project"
                      >
                        <i className="fas fa-user-minus"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowColleaguesList(false)}>
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowColleaguesList(false);
                  setShowAddColleagueModal(true);
                }}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage; 