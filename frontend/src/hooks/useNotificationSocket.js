// src/hooks/useNotificationSocket.js
import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuthStore } from '../contexts/AuthContext';
import { useNotificationStore } from '../contexts/NotificationContext';

// 1. Lê a URL correta do .env
const WS_URL = import.meta.env.VITE_NOTIFICATION_WS_URL;

export const useNotificationSocket = () => {
    const token = useAuthStore((state) => state.token);
    const addNotification = useNotificationStore((state) => state.addNotification);

    // 2. Constrói a URL com o token como parâmetro de query
    const socketUrl = token ? `${WS_URL}?token=${token}` : null;

    const { lastJsonMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: (closeEvent) => true, // Tenta reconectar sempre
        reconnectInterval: 3000,
        onOpen: () => console.log('Conexão WebSocket aberta!'),
        onClose: (e) => console.warn('Conexão WebSocket fechada:', e),
        onError: (e) => console.error('Erro no WebSocket:', e),
    });

    // 3. Ouve as mensagens que chegam
    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log("Nova notificação recebida:", lastJsonMessage);
            // Adiciona a nova notificação ao store do Zustand
            addNotification(lastJsonMessage);
        }
    }, [lastJsonMessage, addNotification]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Conectando...',
        [ReadyState.OPEN]: 'Conectado',
        [ReadyState.CLOSING]: 'Fechando...',
        [ReadyState.CLOSED]: 'Desconectado',
        [ReadyState.UNINSTANTIATED]: 'Não instanciado',
    }[readyState];

    return { connectionStatus };
};