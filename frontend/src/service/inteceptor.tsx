import axios from 'axios';
import { BASE_URL } from '../utils/requests';

// Configurar o Axios
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para adicionar o token JWT a todas as requisições
api.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Erro no interceptor:', error);
      return Promise.reject(error);
    }
  );
  

export default api;
