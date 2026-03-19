import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

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

  useEffect(() => {
    // TODO: Implementar verificación de sesión con AWS Amplify
    // Verificar si hay un usuario autenticado al cargar la app
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Usar Amplify Auth.currentAuthenticatedUser()
      // const currentUser = await Auth.currentAuthenticatedUser();
      // const userGroups = currentUser.signInUserSession.accessToken.payload['cognito:groups'];
      // setUser({ ...currentUser, groups: userGroups });
      
      setLoading(false);
    } catch (error) {
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // TODO: Implementar login con Amplify
      // const user = await Auth.signIn(email, password);
      // await checkAuthStatus();
      console.log('Login:', email, password);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // TODO: Implementar login con Google usando Amplify
      // await Auth.federatedSignIn({ provider: 'Google' });
      // Los usuarios de Google serán asignados al grupo "Clientes"
      console.log('Login with Google');
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // TODO: Implementar logout con Amplify
      // await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // TODO: Implementar registro con Amplify
      // await Auth.signUp({ ...userData });
      console.log('Register:', userData);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const hasRole = (role) => {
    if (!user || !user.groups) return false;
    return user.groups.includes(role);
  };

  const getUserRole = () => {
    if (!user || !user.groups) return null;
    
    // Prioridad de roles según la imagen:
    // 1. Clientes (incluye usuarios de Google)
    // 2. Trabajadores
    // Admin no tiene prioridad especificada
    
    if (user.groups.includes('Clientes')) return 'Clientes';
    if (user.groups.includes('Trabajadores')) return 'Trabajadores';
    if (user.groups.includes('Admin')) return 'Admin';
    
    return null;
  };

  const value = {
    user,
    loading,
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
