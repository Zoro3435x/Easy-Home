/**
 * Utilidades para manejo de autenticación y roles con Cognito
 */

/**
 * Extrae los grupos de Cognito del usuario autenticado
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {Array} Array de grupos del usuario
 */
export const getUserGroups = (user) => {
  if (!user || !user.profile) return [];
  
  // Los grupos vienen en el token en el claim 'cognito:groups'
  return user.profile['cognito:groups'] || [];
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {Object} user - Usuario de react-oidc-context
 * @param {string} role - Rol a verificar ('Admin', 'Trabajadores', 'Clientes')
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  const groups = getUserGroups(user);
  return groups.includes(role);
};

/**
 * Verifica si el usuario es administrador
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return hasRole(user, 'Admin');
};

/**
 * Verifica si el usuario es trabajador
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {boolean}
 */
export const isWorker = (user) => {
  return hasRole(user, 'Trabajadores');
};

/**
 * Verifica si el usuario es cliente
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {boolean}
 */
export const isClient = (user) => {
  return hasRole(user, 'Clientes');
};

/**
 * Obtiene el rol principal del usuario según prioridad
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {string|null} - 'Admin', 'Trabajadores', 'Clientes' o null
 */
export const getUserRole = (user) => {
  const groups = getUserGroups(user);
  
  // Prioridad de roles
  if (groups.includes('Admin')) return 'Admin';
  if (groups.includes('Trabajadores')) return 'Trabajadores';
  if (groups.includes('Clientes')) return 'Clientes';
  
  return null;
};

/**
 * Verifica si el usuario tiene al menos uno de los roles especificados
 * @param {Object} user - Usuario de react-oidc-context
 * @param {Array<string>} allowedRoles - Array de roles permitidos
 * @returns {boolean}
 */
export const hasAnyRole = (user, allowedRoles) => {
  const groups = getUserGroups(user);
  return allowedRoles.some(role => groups.includes(role));
};

/**
 * Verifica si el usuario puede crear publicaciones (es trabajador)
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {boolean}
 */
export const canCreatePublication = (user) => {
  return isWorker(user);
};

/**
 * Verifica si el usuario puede ver el panel de trabajador
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {boolean}
 */
export const canAccessWorkerPanel = (user) => {
  return isWorker(user);
};

/**
 * Verifica si el usuario puede editar su perfil de trabajador
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {boolean}
 */
export const canEditWorkerProfile = (user) => {
  return isWorker(user);
};

/**
 * Verifica si el usuario puede contratar servicios
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {boolean}
 */
export const canHireServices = (user) => {
  return isClient(user);
};

/**
 * Obtiene las capacidades/permisos del usuario
 * @param {Object} user - Usuario de react-oidc-context
 * @returns {Object} Objeto con booleanos de capacidades
 */
export const getUserCapabilities = (user) => {
  return {
    canCreatePublication: canCreatePublication(user),
    canAccessWorkerPanel: canAccessWorkerPanel(user),
    canEditWorkerProfile: canEditWorkerProfile(user),
    canHireServices: canHireServices(user),
    isWorker: isWorker(user),
    isClient: isClient(user),
    isAdmin: isAdmin(user),
  };
};
