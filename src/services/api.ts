// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
fetch(`${API_URL}/api/endpoint`)