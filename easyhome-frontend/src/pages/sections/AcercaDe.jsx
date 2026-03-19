import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';

function AcercaDe({ idProveedor }) {
  const [proveedorData, setProveedorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProveedorData = async () => {
      if (!idProveedor) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/v1/proveedores/${idProveedor}/perfil-about`);
        setProveedorData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener datos del proveedor:', err);
        setError('No se pudo cargar la información del proveedor');
      } finally {
        setLoading(false);
      }
    };

    fetchProveedorData();
  }, [idProveedor]);

  if (!idProveedor) {
    return (
      <div className="acerca-de-container">
        <h2>Acerca de</h2>
        <p>Esta sección está disponible solo para proveedores de servicios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="acerca-de-container">
        <div className="loading">Cargando información...</div>
      </div>
    );
  }

  if (error || !proveedorData) {
    return (
      <div className="acerca-de-container">
        <div className="error">{error || 'Error al cargar la información'}</div>
      </div>
    );
  }

  return (
    <div className="acerca-de-container">
      <h2>Acerca de mí</h2>
      
      {/* Biografía */}
      <section className="bio-section">
        <h3>Descripción Profesional</h3>
        <p>{proveedorData.biografia || 'No hay biografía disponible.'}</p>
      </section>

      {/* Especialidades */}
      <section className="especialidades-section">
        <h3>Especialidades</h3>
        <div className="tags">
          {proveedorData.especializaciones ? (
            proveedorData.especializaciones.split(',').map((esp, index) => (
              <span key={index} className="tag">
                {esp.trim()}
              </span>
            ))
          ) : (
            <p>No hay especialidades registradas.</p>
          )}
        </div>
      </section>

      {/* Estadísticas */}
      <section className="estadisticas-section">
        <h3>Estadísticas</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{proveedorData.cantidad_trabajos_realizados}</span>
            <span className="stat-label">Trabajos realizados</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {proveedorData.calificacion_promedio ? 
                Number(proveedorData.calificacion_promedio).toFixed(1) : 'N/A'}
            </span>
            <span className="stat-label">Calificación promedio</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{proveedorData.total_reseñas}</span>
            <span className="stat-label">Reseñas</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{proveedorData.años_activo}</span>
            <span className="stat-label">Años activo</span>
          </div>
        </div>
      </section>

      {/* Información de ubicación */}
      {proveedorData.direccion && (
        <section className="direccion-section">
          <h3>Ubicación</h3>
          <p>{proveedorData.direccion}</p>
        </section>
      )}
    </div>
  );
}

AcercaDe.propTypes = {
  idProveedor: PropTypes.number
};

export default AcercaDe;
