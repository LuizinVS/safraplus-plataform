// src/components/layout/LayoutWrapper.jsx

// 1. IMPORTAR o 'useState' do React
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';

const LayoutWrapper = () => {
    // 2. ATIVAR O HOOK de notificação
    useNotificationSocket();

    // 3. CRIAR O ESTADO para o menu mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        // (Removemos 'flex h-screen bg-neutral-100' daqui para evitar scroll duplo)
        // O Sidebar agora é 'fixed', então o wrapper principal não precisa ser flex
        <div className="relative min-h-screen bg-neutral-100">
            {/* 4. PASSAR AS PROPS para o Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* A div principal agora precisa de um 'margin-left' no desktop para compensar o Sidebar */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
                {/* 5. PASSAR A PROP para o Topbar */}
                <Topbar
                    toggleSidebar={toggleSidebar}
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// 6. CORRIGIR O EXPORT (remover o .jsx)
export default LayoutWrapper;