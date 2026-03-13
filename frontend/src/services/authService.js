// 1. Importa a 'authApi' específica (porta 8081) do nosso arquivo de API corrigido
import { authApi } from './api'; // (ou './api/index.js', verifique o caminho)

export const register = async (userData) => {
  // 2. Usa a 'authApi'
  const response = await authApi.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  // 3. Usa a 'authApi'
  const response = await authApi.post('/auth/login', credentials);
  return response.data;
};