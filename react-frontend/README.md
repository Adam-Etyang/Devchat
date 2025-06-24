# DevChat React Frontend

A modern React frontend for the DevChat application, built with Vite, Material-UI, and React Router.

## Features

- 🎨 Modern UI with Material-UI components
- 🔐 Authentication system with JWT
- 📱 Responsive design
- 🚀 Fast development with Vite
- 🛣️ Client-side routing with React Router

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Running Spring Boot backend on port 8080

## Installation

1. Navigate to the frontend directory:

   ```bash
   cd react-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.jsx      # Navigation bar
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Chat.jsx        # Chat page
│   └── Projects.jsx    # Projects page
├── services/           # API services (to be implemented)
└── App.jsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Integration

The frontend is configured to communicate with the Spring Boot backend running on `http://localhost:8080`. Make sure your backend is running before testing the frontend.

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests.

## Contributing

1. Make sure your backend is running
2. Start the development server
3. Make your changes
4. Test thoroughly
5. Build and test the production version
