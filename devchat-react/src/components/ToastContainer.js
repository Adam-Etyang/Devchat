import React, { useState, useImperativeHandle, forwardRef } from 'react';

const ToastContainer = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  useImperativeHandle(ref, () => ({
    showToast(message, type = 'info', duration = 2500) {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
  }));

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>{toast.message}</div>
      ))}
    </div>
  );
});

export default ToastContainer; 