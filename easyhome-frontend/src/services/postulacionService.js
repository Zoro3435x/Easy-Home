import apiClient from '../config/api';

/**
 * Servicio para manejar todas las operaciones relacionadas con postulaciones de trabajadores
 */
const postulacionService = {
  /**
   * Crear una nueva postulación
   * @param {FormData} formData - Datos de la postulación en formato FormData
   * @returns {Promise} Promise con la postulación creada
   */
  crear: async (formData) => {
    try {
      const response = await apiClient.post('/api/v1/solicitudes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener todas las postulaciones (solo para admin)
   * @returns {Promise} Promise con el array de postulaciones
   */
  getAll: async () => {
    try {
      // TODO: Implementar cuando el endpoint esté disponible
      // const response = await apiClient.get('/api/v1/postulaciones/');
      // return response.data;
      
      throw new Error('Endpoint no disponible');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener una postulación por ID
   * @param {number} id - ID de la postulación
   * @returns {Promise} Promise con los datos de la postulación
   */
  getById: async (id) => {
    try {
      // TODO: Implementar cuando el endpoint esté disponible
      // const response = await apiClient.get(`/api/v1/postulaciones/${id}`);
      // return response.data;
      
      throw new Error('Endpoint no disponible');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualizar el estado de una postulación (aprobar/rechazar)
   * @param {number} id - ID de la postulación
   * @param {Object} updateData - Datos de actualización
   * @param {string} updateData.estado - Nuevo estado (aprobado/rechazado)
   * @param {string} updateData.comentarios - Comentarios opcionales
   * @returns {Promise} Promise con la postulación actualizada
   */
  actualizarEstado: async (id, updateData) => {
    try {
      // TODO: Implementar cuando el endpoint esté disponible
      // const response = await apiClient.patch(`/api/v1/postulaciones/${id}/estado`, updateData);
      // return response.data;
      
      throw new Error('Endpoint no disponible');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Eliminar una postulación
   * @param {number} id - ID de la postulación
   * @returns {Promise} Promise con la confirmación de eliminación
   */
  eliminar: async (id) => {
    try {
      // TODO: Implementar cuando el endpoint esté disponible
      // const response = await apiClient.delete(`/api/v1/postulaciones/${id}`);
      // return response.data;
      
      throw new Error('Endpoint no disponible');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default postulacionService;
