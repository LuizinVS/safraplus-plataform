// src/App.jsx

import React, { useEffect } from 'react';
import AppRoutes from './routes';
// GARANTA que não há import de NotificationProvider aqui
import { useAuthStore } from './contexts/AuthContext';

function App() {
    const initializeUser = useAuthStore((state) => state.initializeUser);

    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    return (
        // CORREÇÃO: Garanta que NÃO há <NotificationProvider> aqui
        <AppRoutes />
    );
}

export default App;