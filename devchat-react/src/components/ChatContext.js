import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('devchat_projects');
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    const storedSnippets = localStorage.getItem('devchat_snippets');
    if (storedSnippets) setSnippets(JSON.parse(storedSnippets));
  }, []);

  useEffect(() => {
    localStorage.setItem('devchat_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('devchat_snippets', JSON.stringify(snippets));
  }, [snippets]);

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  const setActiveProject = (projectId) => {
    setCurrentProjectId(projectId);
  };

  const addSnippet = (snippet) => {
    setSnippets((prev) => [...prev, snippet]);
  };

  return (
    <ChatContext.Provider value={{ projects, addProject, currentProjectId, setActiveProject, snippets, addSnippet }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
} 