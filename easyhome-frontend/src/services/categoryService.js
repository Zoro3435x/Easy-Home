import apiClient from '../config/api';

/**
 * Servicio para manejar todas las operaciones relacionadas con categorías
 */
const categoryService = {
  /**
   * Obtener todas las categorías
   * @returns {Promise} Promise con el array de categorías
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/v1/categories/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener una categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Promise} Promise con los datos de la categoría
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crear una nueva categoría
   * @param {Object} categoryData - Datos de la categoría a crear
   * @returns {Promise} Promise con la categoría creada
   */
  create: async (categoryData) => {
    try {
      const response = await apiClient.post('/api/v1/categories/', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualizar una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} categoryData - Datos actualizados de la categoría
   * @returns {Promise} Promise con la categoría actualizada
   */
  update: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/api/v1/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Eliminar una categoría
   * @param {number} id - ID de la categoría a eliminar
   * @returns {Promise} Promise con la confirmación de eliminación
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default categoryService;
