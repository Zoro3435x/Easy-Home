// El contexto exporta tanto el hook useAuth como el componente AuthProvider — patrón estándar en React.
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'easyhome_auth_user';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AuthContext = createContext(null);

const normalizeStoredUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== 'object') return null;

  const profile = rawUser.profile || {
    email: rawUser.email,
    name: rawUser.name,
    sub: rawUser.sub,
    phone_number: rawUser.phone_number,
    'cognito:groups': rawUser.groups || [],
  };

  if (!profile?.email) return null;

  const groups = rawUser.groups || profile['cognito:groups'] || ['Clientes'];
  const normalizedProfile = {
    ...profile,
    sub: profile.sub || `local-${profile.email}`,
    name: profile.name || profile.email.split('@')[0],
    phone_number: profile.phone_number || '',
    'cognito:groups': groups,
  };

  return {
    profile: normalizedProfile,
    groups,
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = normalizeStoredUser(parsed);
        if (normalized) {
          setUser(normalized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        }
      }
      setError(null);
      setLoading(false);
    } catch (err) {
      setUser(null);
      setError(err);
      setLoading(false);
    }
  };

  // Crea o actualiza el usuario en la BD del backend.
  // Es no-fatal: si el backend no está disponible la sesión frontend sigue funcionando,
  // pero las rutas que requieren el header X-User-Email fallarán hasta que el backend responda.
  const syncUserWithBackend = async (profile, groups) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/sync-cognito-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          cognito_sub: profile.sub || `local-${profile.email}`,
          name: profile.name || profile.email.split('@')[0],
          phone: profile.phone_number || null,
          cognito_groups: groups,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.warn(`Sync usuario backend falló (${response.status}): ${detail}`);
      }
    } catch (err) {
      console.warn('No se pudo sincronizar el usuario con el backend:', err);
    }
  };

  const mapTipoUsuarioToGroup = (tipoUsuario) => {
    switch (tipoUsuario) {
      case 'administrador':
        return 'Admin';
      case 'proveedor':
        return 'Trabajadores';
      case 'cliente':
      default:
        return 'Clientes';
    }
  };

  const resolveGroupsFromBackend = async (profile) => {
    try {
      const email = profile?.email;
      if (!email) return profile?.['cognito:groups'] || ['Clientes'];

      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(`${API_URL}/api/v1/auth/user-info/${encodedEmail}`);

      if (!response.ok) {
        return profile?.['cognito:groups'] || ['Clientes'];
      }

      const dbUser = await response.json();
      const groupFromDb = mapTipoUsuarioToGroup(dbUser?.tipo_usuario);
      return [groupFromDb];
    } catch (err) {
      console.error('No se pudo validar rol con backend:', err);
      return profile?.['cognito:groups'] || ['Clientes'];
    }
  };

  const createUserObject = (profile, groups) => ({
    profile,
    groups: groups || profile['cognito:groups'] || [],
  });

  const login = async (email, _password) => {
    try {
      const profile = {
        email,
        name: email.split('@')[0],
        sub: `local-${email}`,
        phone_number: '',
        'cognito:groups': ['Clientes'],
      };

      const groups = await resolveGroupsFromBackend(profile);
      const profileWithRole = { ...profile, 'cognito:groups': groups };
      const userObj = createUserObject(profileWithRole, groups);
      setUser(userObj);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      setError(null);
      // Crear/actualizar el usuario en la BD para que X-User-Email sea válido
      await syncUserWithBackend(profileWithRole, groups);
      return userObj;
    } catch (err) {
      console.error('Error en login:', err);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const email = 'user@example.com';
      const profile = {
        email,
        name: 'Usuario Google',
        sub: `google-${email}`,
        phone_number: '',
        'cognito:groups': ['Clientes'],
      };

      const groups = await resolveGroupsFromBackend(profile);
      const profileWithRole = { ...profile, 'cognito:groups': groups };
      const userObj = createUserObject(profileWithRole, groups);
      setUser(userObj);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      setError(null);
      // Crear/actualizar el usuario en la BD para que X-User-Email sea válido
      await syncUserWithBackend(profileWithRole, groups);
      return userObj;
    } catch (err) {
      console.error('Error en login con Google:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error en logout:', err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      return await login(userData.email, userData.password);
    } catch (err) {
      console.error('Error en registro:', err);
      throw err;
    }
  };

  const hasRole = (role) => {
    if (!user || !user.groups) return false;
    return user.groups.includes(role);
  };

  const getUserRole = () => {
    if (!user || !user.groups) return null;

    if (user.groups.includes('Admin')) return 'Admin';
    if (user.groups.includes('Trabajadores')) return 'Trabajadores';
    if (user.groups.includes('Clientes')) return 'Clientes';

    return null;
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    register,
    hasRole,
    getUserRole,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
