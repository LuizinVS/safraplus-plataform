// src/contexts/NotificationContext.jsx
import { create } from 'zustand';

const generateTempId = () => `id_${Date.now()}`;

export const useNotificationStore = create((set) => ({
    notifications: [],
    unreadCount: 0,

    // Função que o WebSocket chama
    addNotification: (newNotification) => {
        set((state) => ({
            notifications: [
                { ...newNotification, id: newNotification.id || generateTempId() },
                ...state.notifications
            ],
            unreadCount: state.unreadCount + 1
        }));
    },

    // Ação para limpar a contagem (ex: quando o usuário clica no ícone de sino)
    markAllAsRead: () => {
        set((state) => ({
            unreadCount: 0,
            notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
        // (Aqui você pode adicionar uma chamada à API REST 'notificationApi.post('/notifications/mark-all-read')' se existir)
    },

    // Ação para limpar a lista
    clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
    }
}));