import { useState } from 'react';
import postulacionService from '../services/postulacionService';

/**
 * Hook personalizado para manejar la postulación de trabajadores
 * @returns {Object} Objeto con funciones y estados para manejar postulaciones
 */
const usePostulacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Crear una nueva solicitud de postulación
   * @param {Object} postulacionData - Datos de la postulación
   * @param {string} postulacionData.curp - CURP del solicitante
   * @param {string} postulacionData.direccion - Dirección
   * @param {number} postulacionData.anios_experiencia - Años de experiencia (número)
   * @param {string} postulacionData.descripcion_servicios - Descripción de servicios
   * @param {Array<string>} postulacionData.servicios_ofrece - Nombres de servicios seleccionados
   * @param {Array<File>} postulacionData.fotos - Array de archivos de imagen
   * @param {string} postulacionData.user_email - Email del usuario autenticado
   * @param {string} postulacionData.nombre_completo - Nombre completo del usuario
   * @returns {Promise} Promise con la respuesta de la API
   */
  const crearPostulacion = async (postulacionData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      
      // Agregar campos requeridos por el backend
      formData.append('curp', postulacionData.curp);
      formData.append('direccion', postulacionData.direccion);
      formData.append('años_experiencia', postulacionData.anios_experiencia);
      formData.append('descripcion_servicios', postulacionData.descripcion_servicios || '');
      formData.append('nombre_completo', postulacionData.nombre_completo);
      formData.append('user_email', postulacionData.user_email);
      
      // Agregar array de servicios (nombres)
      if (postulacionData.servicios_ofrece && postulacionData.servicios_ofrece.length > 0) {
        postulacionData.servicios_ofrece.forEach(servicio => {
          formData.append('servicios_ofrece', servicio);
        });
      }
      
      // Agregar archivos de imagen (múltiples)
      if (postulacionData.fotos && postulacionData.fotos.length > 0) {
        postulacionData.fotos.forEach(foto => {
          formData.append('fotos', foto);
        });
      }

      // Llamar al servicio
      const response = await postulacionService.crear(formData);

      setSuccess(true);
      setLoading(false);
      return response;

    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Error al crear la postulación';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Resetear estados
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    crearPostulacion,
    loading,
    error,
    success,
    reset,
  };
};

export default usePostulacion;
