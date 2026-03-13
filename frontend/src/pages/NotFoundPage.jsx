// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Página Não Encontrada</h1>
            <p>A página que você está procurando não existe.</p>
            <Link to="/">Voltar para o Dashboard</Link>
        </div>
    );
}

export default NotFoundPage;