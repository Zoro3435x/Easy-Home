import { useState, useEffect } from 'react';
import apiClient from '../config/api';

/**
 * Hook para obtener publicaciones del endpoint, con filtros y manejo de loading/error
 * @param {Object} filtrosActivos - Estado de filtros (categorias, suscriptores, ordenar_por)
 * @returns {Object} { publicaciones, isLoading, error, refetch }
 */
export default function usePublicaciones(filtrosActivos) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refetch manual si se requiere
  const [refetchIndex, setRefetchIndex] = useState(0);
  const refetch = () => setRefetchIndex(i => i + 1);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Construir params para axios
    const params = {};
    if (filtrosActivos.categorias && filtrosActivos.categorias.length > 0) {
      params.categorias = filtrosActivos.categorias;
    }
    if (filtrosActivos.suscriptores) {
      params.suscriptores = true;
    }
    if (filtrosActivos.ordenar_por) {
      params.ordenar_por = filtrosActivos.ordenar_por;
    }

    apiClient.get('/api/v1/publicaciones/', { params })
      .then(response => {
        setPublicaciones(response.data);
      })
      .catch(err => {
        setError(err.response?.data?.detail || err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filtrosActivos, refetchIndex]);

  return { publicaciones, isLoading, error, refetch };
}
