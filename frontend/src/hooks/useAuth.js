import { useAuthStore } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { token, user, isAuthenticated, setToken, clearToken } = useAuthStore();
  const navigate = useNavigate();

  const login = (jwtToken) => {
    setToken(jwtToken);
    navigate('/dashboard');
  };

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return { token, user, isAuthenticated, login, logout };
};