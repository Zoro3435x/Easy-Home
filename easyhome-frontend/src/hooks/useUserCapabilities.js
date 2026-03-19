import { useAuth } from 'react-oidc-context';
import { getUserCapabilities } from '../utils/authUtils';

/**
 * Hook para obtener las capacidades/permisos del usuario actual
 */
export const useUserCapabilities = () => {
  const auth = useAuth();
  
  if (!auth.isAuthenticated || !auth.user) {
    return {
      canCreatePublication: false,
      canAccessWorkerPanel: false,
      canEditWorkerProfile: false,
      canHireServices: false,
      isWorker: false,
      isClient: false,
      isAdmin: false,
    };
  }

  return getUserCapabilities(auth.user);
};
