import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from 'react-oidc-context';
import { hasAnyRole } from '../../utils/authUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useAuth();
  
  // Si está cargando, mostrar loading
  if (auth.isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>;
  }
  
  // Si no está autenticado, redirigir al login
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si se especificaron roles permitidos, verificar
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(auth.user, allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;
