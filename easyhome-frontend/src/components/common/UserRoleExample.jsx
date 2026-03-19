import { useAuth } from 'react-oidc-context';
import { isAdmin, isWorker, isClient, getUserRole, getUserGroups } from '../utils/authUtils';

/**
 * Componente de ejemplo que muestra cómo usar los roles de Cognito
 */
function UserRoleExample() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <div>Usuario no autenticado</div>;
  }

  const userRole = getUserRole(auth.user);
  const userGroups = getUserGroups(auth.user);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Información del Usuario</h2>
      
      <div>
        <strong>Email:</strong> {auth.user?.profile?.email}
      </div>
      
      <div>
        <strong>Rol Principal:</strong> {userRole || 'Sin rol'}
      </div>
      
      <div>
        <strong>Grupos:</strong> {userGroups.join(', ') || 'Ninguno'}
      </div>

      <hr />

      <h3>Verificaciones de Roles:</h3>
      
      <div>
        <strong>¿Es Admin?</strong> {isAdmin(auth.user) ? 'Sí ✅' : 'No ❌'}
      </div>
      
      <div>
        <strong>¿Es Trabajador?</strong> {isWorker(auth.user) ? 'Sí ✅' : 'No ❌'}
      </div>
      
      <div>
        <strong>¿Es Cliente?</strong> {isClient(auth.user) ? 'Sí ✅' : 'No ❌'}
      </div>

      <hr />

      {/* Ejemplo de renderizado condicional basado en rol */}
      {isAdmin(auth.user) && (
        <div style={{ backgroundColor: '#ffebee', padding: '10px', marginTop: '10px' }}>
          <strong>Panel de Administrador</strong>
          <p>Solo los administradores pueden ver esto</p>
        </div>
      )}

      {isWorker(auth.user) && (
        <div style={{ backgroundColor: '#e3f2fd', padding: '10px', marginTop: '10px' }}>
          <strong>Panel de Trabajador</strong>
          <p>Solo los trabajadores pueden ver esto</p>
        </div>
      )}

      {isClient(auth.user) && (
        <div style={{ backgroundColor: '#e8f5e9', padding: '10px', marginTop: '10px' }}>
          <strong>Panel de Cliente</strong>
          <p>Solo los clientes pueden ver esto</p>
        </div>
      )}
    </div>
  );
}

export default UserRoleExample;
