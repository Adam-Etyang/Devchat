# DevChat - Collaborative Code Editor & Chat Platform

A modern, real-time collaborative coding platform with integrated chat, file sharing, and team management features. Built with React and designed for developers to work together seamlessly.

## ✨ Features

### 🚀 **Core Features**
- **Real-time Chat**: Instant messaging with code snippet support
- **Project Management**: Create and manage multiple coding projects
- **Dark Theme**: Beautiful dark UI with purple accents
- **Responsive Design**: Works perfectly on desktop and mobile

### 👥 **Team Collaboration**
- **Add Team Members**: Invite colleagues to work on projects
- **Email Invitations**: Send invitations via email
- **Invite Links**: Generate shareable invite links
- **Team Management**: View, add, and remove team members
- **Project Roles**: Assign project leaders and manage permissions
- **Real-time Notifications**: System messages for team changes

### 💻 **Code Collaboration**
- **File Upload**: Upload and share code files
- **Code Snippets**: Beautiful syntax-highlighted code blocks
- **Real-time Editing**: Collaborative code editing with version control
- **Edit Locking**: Prevent conflicts with edit indicators
- **Active Collaborators**: See who's currently editing
- **Version History**: Track changes and revert if needed

### 📁 **File Management**
- **Multiple File Types**: Support for JS, TS, Python, Java, C++, HTML, CSS, JSON, etc.
- **File Preview**: Preview uploaded files in chat
- **Download Files**: Download shared code files
- **File Organization**: Organize files by project

### 🎨 **Enhanced UI/UX**
- **Code Snippet Styling**: Beautiful, syntax-highlighted code blocks
- **Copy to Clipboard**: One-click code copying
- **Language Detection**: Automatic language detection and highlighting
- **Smooth Animations**: Polished interactions and transitions
- **Toast Notifications**: User-friendly feedback messages

## 🛠️ **Team Management Features**

### Adding Colleagues
1. **Quick Add**: Click the "Add Member" button in the project header
2. **Email Invitation**: Send invitations via email
3. **Invite Links**: Generate and share invite links
4. **Team View**: See all team members in a dedicated modal

### Team Management Actions
- **Add Members**: Add new team members by name or email
- **Remove Members**: Remove team members from projects
- **View Team**: See all current team members and their roles
- **Project Leader**: Assign and change project leaders
- **Team Notifications**: Automatic notifications for team changes

### Collaboration Workflow
1. **Create Project**: Start a new coding project
2. **Add Team**: Invite colleagues to join
3. **Share Code**: Upload files or paste code snippets
4. **Collaborate**: Real-time editing and chat
5. **Track Changes**: Monitor version history and updates

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd devchat-react

# Install dependencies
npm install

# Start the development server
npm start
```

### Usage
1. **Sign In**: Use Google or GitHub authentication
2. **Create Project**: Start a new coding project
3. **Add Team**: Invite colleagues to collaborate
4. **Share Code**: Upload files or paste code snippets
5. **Collaborate**: Chat and edit code together

## 📱 **Mobile Support**
- Fully responsive design
- Touch-friendly interface
- Optimized for mobile collaboration
- Swipe gestures and mobile-specific interactions

## 🎯 **Backend Integration Ready**
This frontend is designed to work with a backend API. Key integration points:

### API Endpoints Needed
- **Authentication**: `/auth/login`, `/auth/logout`
- **Projects**: `/projects`, `/projects/:id`
- **Messages**: `/projects/:id/messages`
- **Files**: `/projects/:id/files`
- **Team**: `/projects/:id/team`
- **Real-time**: WebSocket connections for live updates

### Data Models
- **User**: id, name, email, avatar
- **Project**: id, name, description, members, leader
- **Message**: id, content, sender, timestamp, type
- **File**: id, name, content, language, uploader
- **Team Member**: id, name, role, joined_at

## 🔧 **Development**

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── contexts/           # React contexts for state management
├── styles/             # CSS and styling files
└── utils/              # Utility functions
```

### Key Components
- **ChatPage**: Main chat and collaboration interface
- **Navbar**: Navigation and user management
- **AuthContext**: Authentication state management
- **ChatContext**: Real-time chat functionality

### Styling
- **CSS Variables**: Consistent theming system
- **Dark Theme**: Beautiful dark UI with purple accents
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and interactions

## 📄 **License**
This project is licensed under the MIT License.

## 🤝 **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 **Support**
For support and questions, please open an issue in the repository.

---

**Ready for Backend Integration**: This frontend is complete and ready for your backend team to integrate with their API endpoints and real-time functionality.
