import { useState, useEffect } from 'react';
import solicitudService from '../services/solicitudService';

export const useSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarSolicitudes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await solicitudService.obtenerSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar solicitudes');
      console.error('Error cargando solicitudes:', err);
    } finally {
      setLoading(false);
    }
  };

  const aprobarSolicitud = async (idProveedor) => {
    setLoading(true);
    setError(null);
    try {
      await solicitudService.actualizarEstado(idProveedor, 'aprobado');
      // Recargar solicitudes después de aprobar
      await cargarSolicitudes();
      return { success: true, message: 'Solicitud aprobada correctamente' };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al aprobar solicitud';
      setError(errorMsg);
      console.error('Error aprobando solicitud:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const rechazarSolicitud = async (idProveedor) => {
    setLoading(true);
    setError(null);
    try {
      await solicitudService.actualizarEstado(idProveedor, 'rechazado');
      // Recargar solicitudes después de rechazar
      await cargarSolicitudes();
      return { success: true, message: 'Solicitud rechazada correctamente' };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al rechazar solicitud';
      setError(errorMsg);
      console.error('Error rechazando solicitud:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return {
    solicitudes,
    loading,
    error,
    cargarSolicitudes,
    aprobarSolicitud,
    rechazarSolicitud
  };
};
