import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const AUTH_USER_STORAGE_KEY = 'easyhome_auth_user';

const getStoredAuthUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para requests - agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar el token de autenticación
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const authUser = getStoredAuthUser();
    const email = authUser?.profile?.email || authUser?.email;
    const groups = authUser?.groups || authUser?.profile?.['cognito:groups'] || [];

    if (email) {
      config.headers['X-User-Email'] = email;
    }

    if (Array.isArray(groups) && groups.length > 0) {
      config.headers['X-User-Roles'] = groups.join(',');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores comunes
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      switch (error.response.status) {
        case 401:
          // No autorizado - redirigir a login
          console.error('No autorizado. Por favor inicia sesión.');
          localStorage.removeItem(AUTH_USER_STORAGE_KEY);
          break;
        case 403:
          console.error('Acceso prohibido.');
          break;
        case 404:
          console.error('Recurso no encontrado.');
          break;
        case 500:
          console.error('Error interno del servidor.');
          break;
        default:
          console.error('Error en la petición:', error.response.data);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('No se recibió respuesta del servidor.');
    } else {
      // Algo pasó al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
