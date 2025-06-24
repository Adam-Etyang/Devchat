// js/chat.js
class ChatHandler {
    constructor(app) {
        this.app = app;
        this.currentProjectId = null;
        this.projects = []; // Stores all projects
        this.currentMessages = []; // Messages for the active project

        // DOM Elements
        this.chatContainer = document.getElementById('chat-page');
        this.messagesContainer = document.getElementById('chat-messages-container');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.newProjectBtn = document.getElementById('new-project-btn');
        this.projectsList = document.querySelector('.projects-list');
        this.codeSnippetsContainer = document.querySelector('.code-snippets');
        
        // Project info elements
        this.currentProjectName = document.getElementById('current-project-name');
        this.currentProjectDesc = document.getElementById('current-project-desc');
        this.projectSettingsBtn = document.getElementById('project-settings-btn');
        
        // Toggle buttons
        this.toggleProjectsSidebar = document.getElementById('toggle-projects-sidebar');
        this.toggleCodeSidebar = document.getElementById('toggle-code-sidebar');
        this.chatLayout = document.querySelector('.chat-layout');
        
        // File attachment elements
        this.attachFileBtn = document.getElementById('attach-file-btn');
        this.fileUpload = document.getElementById('file-upload');
        
        // Project icon elements
        this.projectIcon = document.getElementById('project-icon');
        this.projectIconUpload = document.getElementById('project-icon-upload');
        
        // Sidebar states
        this.projectsSidebarVisible = true;
        this.codeSidebarVisible = true;
    }

    init() {
        if (!this.app.auth.isAuthenticated) {
            this.app.showToast('Please sign in to access the chat', 'warning');
            this.app.navigation.navigateToPage('signin');
            return;
        }
        
        this.loadProjectsFromStorage();
        this.setupEventListeners();
        this.setupCodeSnippets();
        
        if (!this.currentProjectId || !this.projects.find(p => p.id === this.currentProjectId)) {
            this.showWelcomeState();
        } else {
            this.loadProject(this.currentProjectId);
        }
        
        this.renderProjects();
    }

    setupEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.newProjectBtn.addEventListener('click', () => this.createNewProject());
        
        // Toggle sidebar buttons
        this.toggleProjectsSidebar.addEventListener('click', () => this.toggleProjectsSidebarView());
        this.toggleCodeSidebar.addEventListener('click', () => this.toggleCodeSidebarView());
        
        // Use event delegation for project items
        this.projectsList.addEventListener('click', (e) => {
            const projectItem = e.target.closest('.project-item');
            if (projectItem && projectItem.dataset.projectId) {
                e.preventDefault();
                this.loadProject(projectItem.dataset.projectId);
            }
        });
        
        // File attachment
        this.attachFileBtn.addEventListener('click', () => this.fileUpload.click());
        this.fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Project icon upload
        this.projectIcon.addEventListener('click', () => this.projectIconUpload.click());
        this.projectIconUpload.addEventListener('change', (e) => this.handleProjectIconUpload(e));
        
        // Setup resizable sidebars
        this.setupResizableSidebars();
    }

    setupResizableSidebars() {
        const projectsSidebar = document.querySelector('.projects-sidebar');
        const codeSidebar = document.querySelector('.code-context-sidebar');
        
        if (projectsSidebar) {
            this.makeResizable(projectsSidebar, 'right');
        }
        
        if (codeSidebar) {
            this.makeResizable(codeSidebar, 'left');
        }
    }
    
    makeResizable(element, direction) {
        let isResizing = false;
        let startX, startWidth;
        
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        handle.style.cssText = `
            position: absolute;
            ${direction}: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: transparent;
            cursor: col-resize;
            z-index: 1000;
        `;
        
        element.appendChild(handle);
        
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = element.offsetWidth;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            let deltaX;
            if (direction === 'right') {
                deltaX = e.clientX - startX;
            } else {
                deltaX = startX - e.clientX;
            }
            
            const newWidth = Math.max(200, Math.min(500, startWidth + deltaX));
            element.style.width = newWidth + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    toggleProjectsSidebarView() {
        this.projectsSidebarVisible = !this.projectsSidebarVisible;
        this.updateLayout();
        
        // Handle mobile sidebar
        const projectsSidebar = document.getElementById('projects-sidebar');
        if (window.innerWidth <= 768) {
            if (this.projectsSidebarVisible) {
                projectsSidebar.classList.add('show');
            } else {
                projectsSidebar.classList.remove('show');
            }
        }
    }

    toggleCodeSidebarView() {
        this.codeSidebarVisible = !this.codeSidebarVisible;
        this.updateLayout();
        
        // Handle mobile sidebar
        const codeSidebar = document.getElementById('code-sidebar');
        if (window.innerWidth <= 768) {
            if (this.codeSidebarVisible) {
                codeSidebar.classList.add('show');
            } else {
                codeSidebar.classList.remove('show');
            }
        }
    }

    updateLayout() {
        this.chatLayout.classList.remove('sidebar-hidden', 'projects-sidebar-hidden', 'code-sidebar-hidden');
        
        if (!this.projectsSidebarVisible && !this.codeSidebarVisible) {
            this.chatLayout.classList.add('sidebar-hidden');
        } else if (!this.projectsSidebarVisible) {
            this.chatLayout.classList.add('projects-sidebar-hidden');
        } else if (!this.codeSidebarVisible) {
            this.chatLayout.classList.add('code-sidebar-hidden');
        }
        
        // Update toggle button icons
        this.updateToggleIcons();
    }

    updateToggleIcons() {
        // Update projects sidebar toggle icons
        const projectsIcon = this.projectsSidebarVisible ? 'fa-chevron-left' : 'fa-chevron-right';
        this.toggleProjectsSidebar.innerHTML = `<i class="fas ${projectsIcon}"></i>`;
        
        // Update code sidebar toggle icons
        const codeIcon = this.codeSidebarVisible ? 'fa-chevron-right' : 'fa-chevron-left';
        this.toggleCodeSidebar.innerHTML = `<i class="fas ${codeIcon}"></i>`;
    }

    setupCodeSnippets() {
        // This will be populated with code from user messages that need fixing
        this.updateCodeSnippets();
    }

    updateCodeSnippets() {
        if (!this.currentProjectId) {
            this.codeSnippetsContainer.innerHTML = '<div class="no-snippets">No project selected</div>';
            return;
        }

        const currentProject = this.projects.find(p => p.id === this.currentProjectId);
        if (!currentProject) return;

        // Extract code blocks from user messages
        const codeSnippets = [];
        currentProject.messages.forEach((message, index) => {
            if (message.sender === 'user' && message.content.includes('```')) {
                const codeMatches = message.content.match(/```(\w*)\n([\s\S]*?)```/g);
                if (codeMatches) {
                    codeMatches.forEach((match, codeIndex) => {
                        const langMatch = match.match(/```(\w*)\n/);
                        const codeMatch = match.match(/```\w*\n([\s\S]*?)```/);
                        if (langMatch && codeMatch) {
                            const language = langMatch[1] || 'text';
                            const code = codeMatch[1];
                            const snippetId = `${index}_${codeIndex}`;
                            
                            // Check if it's a file attachment
                            const isFileAttachment = message.content.includes('📎 **');
                            const fileName = isFileAttachment ? 
                                message.content.match(/📎 \*\*(.*?)\*\*/)?.[1] || 'Unknown file' : 
                                `Code from ${message.username}`;
                            
                            codeSnippets.push({
                                id: snippetId,
                                title: fileName,
                                code: code,
                                language: language,
                                messageIndex: index,
                                timestamp: message.timestamp,
                                username: message.username,
                                isFileAttachment: isFileAttachment
                            });
                        }
                    });
                }
            }
        });

        if (codeSnippets.length === 0) {
            this.codeSnippetsContainer.innerHTML = '<div class="no-snippets">No code snippets found</div>';
            return;
        }

        this.codeSnippetsContainer.innerHTML = codeSnippets.map(snippet => `
            <div class="snippet-item" data-snippet-id="${snippet.id}" data-message-index="${snippet.messageIndex}" data-code="${this.escapeHtml(snippet.code)}" data-language="${snippet.language}">
                <div class="snippet-header">
                    <span class="snippet-title">${snippet.title}</span>
                    <span class="snippet-language">${snippet.language}</span>
                </div>
                <div class="snippet-content">
                    <div class="snippet-display" data-snippet-id="${snippet.id}">
                        <pre><code class="language-${snippet.language}">${this.escapeHtml(snippet.code.substring(0, 100))}${snippet.code.length > 100 ? '...' : ''}</code></pre>
                    </div>
                    <div class="snippet-edit" data-snippet-id="${snippet.id}" style="display: none;">
                        <textarea class="snippet-editor" data-snippet-id="${snippet.id}" rows="8">${this.escapeHtml(snippet.code)}</textarea>
                        <div class="snippet-edit-actions">
                            <button class="btn btn-sm btn-primary save-snippet-btn" data-snippet-id="${snippet.id}">
                                <i class="fas fa-save"></i> Save
                            </button>
                            <button class="btn btn-sm btn-secondary cancel-snippet-btn" data-snippet-id="${snippet.id}">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </div>
                </div>
                <div class="snippet-actions">
                    <button class="btn btn-sm btn-secondary snippet-action-btn" data-action="copy" data-snippet-id="${snippet.id}">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="btn btn-sm btn-primary snippet-action-btn" data-action="reply" data-snippet-id="${snippet.id}">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <button class="btn btn-sm btn-secondary snippet-action-btn" data-action="edit" data-snippet-id="${snippet.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-secondary snippet-action-btn" data-action="fix" data-snippet-id="${snippet.id}">
                        <i class="fas fa-wrench"></i> Fix
                    </button>
                    <button class="btn btn-sm btn-secondary snippet-action-btn" data-action="locate" data-snippet-id="${snippet.id}">
                        <i class="fas fa-search"></i> Locate
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for snippet actions
        const snippetButtons = this.codeSnippetsContainer.querySelectorAll('.snippet-action-btn');
        snippetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = btn.dataset.action;
                const snippetId = btn.dataset.snippetId;
                this.handleSnippetAction(action, snippetId);
            });
        });
        
        // Add event listeners for edit functionality
        const saveButtons = this.codeSnippetsContainer.querySelectorAll('.save-snippet-btn');
        const cancelButtons = this.codeSnippetsContainer.querySelectorAll('.cancel-snippet-btn');
        
        saveButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const snippetId = btn.dataset.snippetId;
                this.saveSnippetEdit(snippetId);
            });
        });
        
        cancelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const snippetId = btn.dataset.snippetId;
                this.cancelSnippetEdit(snippetId);
            });
        });
    }

    handleSnippetAction(action, snippetId) {
        const snippetElement = document.querySelector(`[data-snippet-id="${snippetId}"]`);
        if (!snippetElement) return;

        const code = snippetElement.dataset.code;
        const language = snippetElement.dataset.language;
        const messageIndex = snippetElement.dataset.messageIndex;

        switch (action) {
            case 'copy':
                navigator.clipboard.writeText(code).then(() => {
                    this.app.showToast('Code copied to clipboard!', 'success');
                });
                break;
            case 'reply':
                this.sendCodeSnippet(code, language);
                break;
            case 'edit':
                this.editSnippet(snippetId);
                break;
            case 'fix':
                const fixedCode = this.generateFixedCode(code, language);
                this.sendCodeSnippet(fixedCode, language);
                break;
            case 'locate':
                this.locateSnippetInChat(messageIndex);
                break;
        }
    }
    
    editSnippet(snippetId) {
        const snippetElement = document.querySelector(`[data-snippet-id="${snippetId}"]`);
        if (!snippetElement) return;
        
        // Hide display, show editor
        const displayDiv = snippetElement.querySelector('.snippet-display');
        const editDiv = snippetElement.querySelector('.snippet-edit');
        
        if (displayDiv && editDiv) {
            displayDiv.style.display = 'none';
            editDiv.style.display = 'block';
            
            // Focus on the textarea
            const textarea = editDiv.querySelector('.snippet-editor');
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            }
        }
    }

    locateSnippetInChat(messageIndex) {
        const messages = this.messagesContainer.querySelectorAll('.message');
        if (messages[messageIndex]) {
            // Scroll to the message
            messages[messageIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the message temporarily
            messages[messageIndex].classList.add('highlight');
            setTimeout(() => {
                messages[messageIndex].classList.remove('highlight');
            }, 2000);
            
            this.app.showToast('Message located!', 'info');
        }
    }

    generateFixedCode(code, language) {
        // Simple code fixing examples - in a real app, this would be more sophisticated
        const fixes = {
            javascript: {
                'console.log("hello world")': 'console.log("Hello, World!");',
                'function test() {': 'function test() {\n    // Add your logic here\n}',
                'if (x == y)': 'if (x === y) {',
                'var x = 1': 'const x = 1;'
            },
            python: {
                'print "hello"': 'print("hello")',
                'if x == y:': 'if x == y:\n    pass',
                'def test():': 'def test():\n    pass'
            },
            css: {
                '.class {': '.class {\n    /* Add your styles here */\n}',
                'color: red': 'color: red;',
                'margin: 0': 'margin: 0;'
            }
        };

        let fixedCode = code;
        const languageFixes = fixes[language] || {};
        
        Object.keys(languageFixes).forEach(badCode => {
            if (fixedCode.includes(badCode)) {
                fixedCode = fixedCode.replace(badCode, languageFixes[badCode]);
            }
        });

        return fixedCode;
    }

    sendCodeSnippet(code, language) {
        if (!this.currentProjectId) {
            this.app.showToast('Please select a project first', 'warning');
            return;
        }
        
        const formattedCode = `\`\`\`${language}\n${code}\n\`\`\``;
        this.addMessage('user', formattedCode);
        this.chatInput.value = '';
        this.chatInput.focus(); // Ensure focus is maintained
    }

    sendMessage() {
        const messageText = this.chatInput.value.trim();
        if (!messageText) return;

        if (!this.currentProjectId) {
            this.app.showToast('Please select a project first', 'warning');
            return;
        }

        this.addMessage('user', messageText);
        this.chatInput.value = '';
    }

    addMessage(sender, content) {
        if (!this.currentProjectId) {
            this.app.showToast('Please select a project first', 'warning');
            return;
        }

        const message = {
            id: Date.now(),
            sender: sender,
            content: content,
            timestamp: new Date().toLocaleTimeString(),
            username: this.app.auth.user?.name || 'User'
        };

        // Add to current project
        const currentProject = this.projects.find(p => p.id === this.currentProjectId);
        if (currentProject) {
            currentProject.messages.push(message);
            this.saveProjectsToStorage();
        }

        // Render the message
        const messageElement = this.renderMessage(message);
        this.messagesContainer.appendChild(messageElement);
        
        // Auto-scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Update code snippets
        this.updateCodeSnippets();
    }
    
    renderMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.sender}-message`;
        messageEl.dataset.messageId = message.id;
        
        const avatarIcon = message.sender === 'user' ? 'fa-user' : 'fa-robot';
        
        messageEl.innerHTML = `
            <div class="message-avatar ${message.sender}">
                <i class="fas ${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-username">${message.username}</span>
                    <span class="message-time">${message.timestamp}</span>
                </div>
                <div class="message-text">
                    ${this.formatMessageContent(message.content)}
                </div>
                <div class="message-actions">
                    <button class="btn btn-sm btn-secondary message-action-btn" data-action="reply" data-message-id="${message.id}" title="Reply">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary message-action-btn" data-action="forward" data-message-id="${message.id}" title="Forward">
                        <i class="fas fa-share"></i>
                    </button>
                    ${message.sender === 'user' ? `
                        <button class="btn btn-sm btn-danger message-action-btn" data-action="delete" data-message-id="${message.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add event listeners for message actions
        const actionButtons = messageEl.querySelectorAll('.message-action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = btn.dataset.action;
                const messageId = btn.dataset.messageId;
                this.handleMessageAction(action, messageId);
            });
        });
        
        return messageEl;
    }
    
    handleMessageAction(action, messageId) {
        switch (action) {
            case 'reply':
                this.replyToMessage(messageId);
                break;
            case 'forward':
                this.forwardMessage(messageId);
                break;
            case 'delete':
                this.deleteMessage(messageId);
                break;
        }
    }
    
    createNewProject() {
        const projectName = prompt('Enter project name:');
        if (!projectName) return;

        const projectDesc = prompt('Enter project description (optional):') || '';
        
        const newProject = {
            id: `project_${Date.now()}`,
            name: projectName,
            description: projectDesc,
            messages: [],
            members: [this.app.auth.user?.id || 'anonymous'],
            createdAt: new Date(),
            createdBy: this.app.auth.user?.id || 'anonymous'
        };
        
        this.projects.unshift(newProject);
        this.currentProjectId = newProject.id;
        
        // Update UI immediately
        this.loadProject(newProject.id);
        this.renderProjects();
        this.saveProjectsToStorage();
        
        this.app.showToast(`Project "${projectName}" created!`, 'success');
    }

    loadProject(projectId) {
        this.currentProjectId = projectId;
        const project = this.projects.find(p => p.id === projectId);
        
        if (project) {
            // Update project info
            this.currentProjectName.textContent = project.name;
            this.currentProjectDesc.textContent = project.description;
            
            // Load project icon if exists
            if (project.icon) {
                this.projectIcon.innerHTML = `<img src="${project.icon}" alt="${project.name}">`;
            } else {
                this.projectIcon.innerHTML = '<i class="fas fa-code"></i>';
            }
            
            // Render messages
            this.messagesContainer.innerHTML = '';
            project.messages.forEach(message => {
                const messageElement = this.renderMessage(message);
                this.messagesContainer.appendChild(messageElement);
            });
            
            // Auto-scroll to bottom
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            
            // Update code snippets
            this.updateCodeSnippets();
            
            // Update active project in sidebar
            this.updateActiveProject();
        }
    }
    
    renderProjects() {
        if (this.projects.length === 0) {
            this.projectsList.innerHTML = '<div class="no-projects">No projects yet. Create your first project!</div>';
            return;
        }

        this.projectsList.innerHTML = this.projects.map(project => `
            <div class="project-item" data-project-id="${project.id}">
                <div class="project-icon">
                    ${project.icon ? `<img src="${project.icon}" alt="${project.name}">` : '<i class="fas fa-code"></i>'}
                </div>
                <div class="project-info">
                    <h4>${project.name}</h4>
                    <p>${project.description}</p>
                    <span class="project-meta">${project.messages.length} messages</span>
                </div>
                <div class="project-actions">
                    <button class="btn btn-sm btn-danger project-delete-btn" data-project-id="${project.id}" title="Delete project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for project delete buttons
        const deleteButtons = this.projectsList.querySelectorAll('.project-delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const projectId = btn.dataset.projectId;
                this.deleteProject(projectId);
            });
        });
        
        // Update active project
        this.updateActiveProject();
    }

    updateProjectInfo() {
        const project = this.projects.find(p => p.id === this.currentProjectId);
        if (project) {
            this.currentProjectName.textContent = project.name;
            this.currentProjectDesc.textContent = project.description || 'No description';
        } else {
            this.currentProjectName.textContent = 'Select a Project';
            this.currentProjectDesc.textContent = 'Choose a project to start collaborating';
        }
    }

    showWelcomeState() {
        this.currentProjectId = null;
        this.currentMessages = [];
        this.messagesContainer.innerHTML = '';
        this.renderWelcomeMessage();
        this.updateProjectInfo();
    }

    renderWelcomeMessage() {
        const welcomeEl = document.createElement('div');
        welcomeEl.className = 'message welcome-message';
        welcomeEl.innerHTML = `
            <div class="message-avatar assistant">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <h3>Welcome to DevChat!</h3>
                <p>Create a new project or select an existing one to start collaborating with your team.</p>
            </div>
        `;
        this.messagesContainer.appendChild(welcomeEl);
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    formatMessageContent(content) {
        // Basic markdown for code blocks
        return content.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || ''}">${code.trim()}</code></pre>`;
        }).replace(/\n/g, '<br/>');
    }

    loadProjectsFromStorage() {
        try {
            const projects = JSON.parse(localStorage.getItem('devchat_projects'));
            if (Array.isArray(projects)) {
                this.projects = projects;
                this.currentProjectId = localStorage.getItem('devchat_current_project_id');
            }
        } catch (e) {
            this.projects = [];
        }
    }

    saveProjectsToStorage() {
        localStorage.setItem('devchat_projects', JSON.stringify(this.projects));
        localStorage.setItem('devchat_current_project_id', this.currentProjectId);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!this.currentProjectId) {
            this.app.showToast('Please select a project first', 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const fileName = file.name;
            
            // Create a message with the file content
            const fileMessage = `📎 **${fileName}**\n\`\`\`\n${content}\n\`\`\``;
            
            this.addMessage('user', fileMessage);
            this.chatInput.value = '';
            this.fileUpload.value = '';
            
            // Show success notification
            this.app.showToast(`File "${fileName}" uploaded successfully!`, 'success');
        };
        
        reader.readAsText(file);
    }

    handleProjectIconUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.app.showToast('Please select an image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.onload = () => {
                this.projectIcon.innerHTML = '';
                this.projectIcon.appendChild(img);
                
                // Update current project icon if one is selected
                if (this.currentProjectId) {
                    const project = this.projects.find(p => p.id === this.currentProjectId);
                    if (project) {
                        project.icon = event.target.result;
                        this.saveProjectsToStorage();
                        this.renderProjects();
                    }
                }
                
                this.app.showToast('Project icon updated successfully!', 'success');
            };
        };
        
        reader.readAsDataURL(file);
        this.projectIconUpload.value = '';
    }

    updateActiveProject() {
        // Remove active class from all project items
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current project
        const activeProjectItem = document.querySelector(`[data-project-id="${this.currentProjectId}"]`);
        if (activeProjectItem) {
            activeProjectItem.classList.add('active');
        }
    }

    deleteProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const confirmDelete = confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`);
        if (!confirmDelete) return;
        
        // Remove project from array
        this.projects = this.projects.filter(p => p.id !== projectId);
        
        // If deleted project was current, switch to first available or show welcome
        if (this.currentProjectId === projectId) {
            if (this.projects.length > 0) {
                this.loadProject(this.projects[0].id);
            } else {
                this.showWelcomeState();
                // Clear code snippets when no project is selected
                this.codeSnippetsContainer.innerHTML = '<div class="no-snippets">No project selected</div>';
            }
        }
        
        this.renderProjects();
        this.saveProjectsToStorage();
        
        this.app.showToast(`Project "${project.name}" deleted!`, 'success');
    }

    replyToMessage(messageId) {
        const currentProject = this.projects.find(p => p.id === this.currentProjectId);
        if (!currentProject) return;
        
        const message = currentProject.messages.find(m => m.id == messageId);
        if (!message) return;
        
        this.chatInput.value = `@${message.username} `;
        this.chatInput.focus();
    }
    
    forwardMessage(messageId) {
        const currentProject = this.projects.find(p => p.id === this.currentProjectId);
        if (!currentProject) return;
        
        const message = currentProject.messages.find(m => m.id == messageId);
        if (!message) return;
        
        // Create a forwarded message
        const forwardedContent = `📤 Forwarded from ${message.username}:\n\n${message.content}`;
        this.addMessage('user', forwardedContent);
    }
    
    deleteMessage(messageId) {
        const currentProject = this.projects.find(p => p.id === this.currentProjectId);
        if (!currentProject) return;
        
        const message = currentProject.messages.find(m => m.id == messageId);
        if (!message) return;
        
        const confirmDelete = confirm('Are you sure you want to delete this message?');
        if (!confirmDelete) return;
        
        // Remove message from project
        currentProject.messages = currentProject.messages.filter(m => m.id != messageId);
        
        // Remove from UI
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.remove();
        }
        
        this.saveProjectsToStorage();
        this.updateCodeSnippets();
        
        this.app.showToast('Message deleted!', 'success');
    }

    saveSnippetEdit(snippetId) {
        const snippetElement = document.querySelector(`[data-snippet-id="${snippetId}"]`);
        if (!snippetElement) return;

        const textarea = snippetElement.querySelector('.snippet-editor');
        const newCode = textarea.value;
        const language = snippetElement.dataset.language;
        const messageIndex = parseInt(snippetElement.dataset.messageIndex);

        if (!this.currentProjectId) {
            this.app.showToast('Please select a project first', 'warning');
            return;
        }
        
        const currentProject = this.projects.find(p => p.id === this.currentProjectId);
        if (!currentProject) return;

        const message = currentProject.messages[messageIndex];
        if (!message) return;

        // Update the message content with the new code
        const codeBlock = `\`\`\`${language}\n${newCode}\n\`\`\``;
        
        // If it was a file attachment, preserve the file header
        if (message.content.includes('📎 **')) {
            const fileName = message.content.match(/📎 \*\*(.*?)\*\*/)?.[1] || 'Unknown file';
            message.content = `📎 **${fileName}**\n${codeBlock}`;
        } else {
            message.content = codeBlock;
        }
        
        // Update the snippet element data
        snippetElement.dataset.code = this.escapeHtml(newCode);
        
        // Save to storage
        this.saveProjectsToStorage();
        
        // Exit edit mode
        this.exitSnippetEdit(snippetId);
        
        // Refresh the snippets display
        this.updateCodeSnippets();
        
        // Refresh the message in the chat
        this.loadProject(this.currentProjectId);
        
        this.app.showToast('Snippet updated successfully!', 'success');
    }
    
    cancelSnippetEdit(snippetId) {
        this.exitSnippetEdit(snippetId);
        this.app.showToast('Edit cancelled', 'info');
    }
    
    exitSnippetEdit(snippetId) {
        const snippetElement = document.querySelector(`[data-snippet-id="${snippetId}"]`);
        if (!snippetElement) return;
        
        // Show display, hide editor
        const displayDiv = snippetElement.querySelector('.snippet-display');
        const editDiv = snippetElement.querySelector('.snippet-edit');
        
        if (displayDiv && editDiv) {
            displayDiv.style.display = 'block';
            editDiv.style.display = 'none';
        }
    }
} 