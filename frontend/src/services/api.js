import axios from 'axios';

// --- Lê as URLs do .env ---
// O '||' fornece um valor padrão caso a variável não esteja definida no .env
const AUTH_URL = import.meta.env.VITE_API_URL_AUTH || 'http://localhost:8081';
const CAPITAL_URL = import.meta.env.VITE_API_URL_CAPITAL || 'http://localhost:8082';
const SCRAPER_URL = import.meta.env.VITE_API_URL_SCRAPER || 'http://localhost:8000';
const NOTIFICATION_URL = import.meta.env.VITE_API_URL_NOTIFICATION || 'http://localhost:8083';


// --- Cria as instâncias usando as variáveis ---
export const authApi = axios.create({ baseURL: AUTH_URL });
export const capitalApi = axios.create({ baseURL: CAPITAL_URL });
export const scraperApi = axios.create({ baseURL: SCRAPER_URL });
export const notificationApi = axios.create({ baseURL: NOTIFICATION_URL });


// --- Interceptador (continua o mesmo) ---
const addAuthTokenInterceptor = (apiInstance) => {
    apiInstance.interceptors.request.use(
        (config) => {
            const token = sessionStorage.getItem('jwt_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    apiInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                sessionStorage.removeItem('jwt_token');
                console.error('Unauthorized: Token expirado ou inválido. Redirecionando para login.');
                // TODO: Chamar logout do useAuthStore que usa navigate (Correção Fase 2)
                window.location.href = '/login'; // Mantido por enquanto
            }
            return Promise.reject(error);
        }
    );
};

// --- Aplica o interceptador (continua o mesmo) ---
addAuthTokenInterceptor(capitalApi);
addAuthTokenInterceptor(scraperApi);
addAuthTokenInterceptor(notificationApi);
