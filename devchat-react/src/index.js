import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import './components.css';
import './pages.css';
import './index.css';
import App from './App';
import { AuthProvider } from './components/AuthContext';
import { ChatProvider } from './components/ChatContext';
import ToastContainer from './components/ToastContainer';
import reportWebVitals from './reportWebVitals';

const toastRef = React.createRef();
window.showToast = (message, type) => {
  if (toastRef.current) toastRef.current.showToast(message, type);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ChatProvider>
        <App />
        <ToastContainer ref={toastRef} />
      </ChatProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
