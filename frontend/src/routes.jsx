// O import do 'React' não é necessário se você não usa JSX (como <div>)
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/Properties/PropertiesPage';
import PropertyDetailsPage from './pages/Properties/PropertyDetailsPage';
import SafrasPage from './pages/Safras/SafrasPage';
import RecommendationList from './pages/Recommendations/RecommendationList';
import NotificationPage from './pages/Notifications/NotificationPage.jsx';
import NotFoundPage from './pages/NotFoundPage';
import LayoutWrapper from './components/layout/LayoutWrapper';
import { useAuthStore } from './contexts/AuthContext'; // Importar o store de auth

// Componente para rotas privadas
const PrivateRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <LayoutWrapper><Outlet /></LayoutWrapper> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    // O <Router> FOI REMOVIDO DAQUI
    <Routes>
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas Protegidas (Dashboard Layout) */}
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Rotas de Propriedades */}
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:propertyId" element={<PropertyDetailsPage />} />
        <Route path="/properties/:propertyId/safras" element={<SafrasPage />} />

        {/* Rotas de Recomendações */}
        <Route path="/recommendations" element={<RecommendationList />} />
        
        {/* Rotas de Notificações */}
        <Route path="/notifications" element={<NotificationPage />} />
      </Route>

      {/* Rota 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;