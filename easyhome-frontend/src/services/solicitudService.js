import apiClient from '../config/api';

const solicitudService = {
  /**
   * Obtener todas las solicitudes de proveedor (Admin)
   */
  obtenerSolicitudes: async () => {
    const response = await apiClient.get('/api/v1/solicitudes/admin');
    return response.data;
  },

  /**
   * Aprobar o rechazar una solicitud (Admin)
   * @param {number} idProveedor - ID del proveedor/solicitud
   * @param {string} estado - 'aprobado' o 'rechazado'
   */
  actualizarEstado: async (idProveedor, estado) => {
    const formData = new FormData();
    formData.append('estado', estado);
    
    const response = await apiClient.put(`/api/v1/solicitudes/admin/${idProveedor}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Obtener fotos de trabajo de un proveedor
   * @param {number} idProveedor - ID del proveedor
   * @param {number} expiration - Tiempo de expiración de las URLs en segundos (default: 3600)
   */
  obtenerFotosProveedor: async (idProveedor, expiration = 3600) => {
    const response = await apiClient.get(`/api/v1/solicitudes/${idProveedor}/fotos`, {
      params: { expiration }
    });
    return response.data;
  }
};

export default solicitudService;
