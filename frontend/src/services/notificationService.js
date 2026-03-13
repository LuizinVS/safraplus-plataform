// src/services/notificationService.js

// 1. Importa a 'notificationApi' (porta 8083) do nosso arquivo de API principal
import { notificationApi } from './api';

/**
 * (Para o Dashboard e NotificationPage)
 * Busca a lista de todas as notificações do usuário logado.
 * O useQuery (React Query) chamará esta função.
 */
export const getNotifications = async () => {
  try {
    // 2. Faz a chamada GET para o endpoint de notificações
    // (Assumindo que o endpoint para "minhas" notificações seja /notifications/minhas)
    const response = await notificationApi.get('/notifications/minhas');
    
    // 3. O useQuery espera que você retorne os dados
    return response.data;
  
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    // Re-lança o erro para o useQuery poder pegá-lo (isError = true)
    throw error.response?.data || new Error("Erro desconhecido ao buscar notificações");
  }
};

/**
 * (Para a NotificationPage)
 * Marca uma notificação específica como lida.
 */
export const markNotificationAsRead = async (id) => {
  try {
    // Um endpoint PUT é comum para atualizar o estado de um recurso
    const response = await notificationApi.put(`/notifications/${id}/read`);
    return response.data;
  
  } catch (error) {
    console.error(`Erro ao marcar notificação ${id} como lida:`, error);
    throw error.response?.data || new Error("Erro desconhecido ao marcar notificação");
  }
};

/**
 * (Para a NotificationPage)
 * Marca todas as notificações do usuário como lidas.
 */
export const markAllNotificationsAsRead = async () => {
  try {
    // Um endpoint POST ou PUT é comum para ações em lote
    const response = await notificationApi.post('/notifications/mark-all-read');
    return response.data;
  
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    throw error.response?.data || new Error("Erro desconhecido ao marcar todas como lidas");
  }
};

/**
 * (Opcional, mas útil para a NotificationPage)
 * Deleta uma notificação específica.
 */
export const deleteNotification = async (id) => {
  try {
    const response = await notificationApi.delete(`/notifications/${id}`);
    return response.data;
  
  } catch (error) {
    console.error(`Erro ao deletar notificação ${id}:`, error);
    throw error.response?.data || new Error("Erro desconheciro ao deletar notificação");
  }
};