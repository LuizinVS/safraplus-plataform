// src/contexts/AuthContext.jsx
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('jwt_token') || null,
  user: null,
  isAuthenticated: !!sessionStorage.getItem('jwt_token'),

  setToken: (token) => {
    sessionStorage.setItem('jwt_token', token);
    const decodedUser = jwtDecode(token);
    set({ token, user: decodedUser, isAuthenticated: true });
  },
  clearToken: () => {
    sessionStorage.removeItem('jwt_token');
    set({ token: null, user: null, isAuthenticated: false });
  },
  // Inicializa o usuário se já houver um token
  initializeUser: () => {
    const token = sessionStorage.getItem('jwt_token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        set({ user: decodedUser, isAuthenticated: true });
      } catch (error) {
        console.error("Failed to decode token:", error);
        sessionStorage.removeItem('jwt_token');
        set({ token: null, user: null, isAuthenticated: false });
      }
    }
  }
}));

// A LINHA PROBLEMÁTICA FOI REMOVIDA