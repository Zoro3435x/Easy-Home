import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';
import PublicarServicio from '../Service_publication_form';

function MisServicios({ idProveedor }) {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchServicios = async () => {
      if (!idProveedor) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/v1/proveedores/${idProveedor}/servicios`);
        setServicios(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener servicios:', err);
        setError('No se pudieron cargar los servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, [idProveedor]);

  if (!idProveedor) {
    return (
      <div className="mis-servicios-container">
        <h2>Mis Servicios</h2>
        <p>Esta sección está disponible solo para proveedores de servicios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mis-servicios-container">
        <div className="loading">Cargando servicios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-servicios-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleServicePublished = () => {
    setShowForm(false);
    // Recargar servicios
    window.location.reload();
  };

  return (
    <div className="mis-servicios-container">
      <div className="header-section">
        <h2>Mis Servicios</h2>
        <button className="btn-nuevo-servicio" onClick={handleOpenForm}>+ Nuevo Servicio</button>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-cerrar-modal" onClick={handleCloseForm}>✕</button>
            <PublicarServicio onClose={handleCloseForm} onSuccess={handleServicePublished} />
          </div>
        </div>
      )}

      {servicios.length === 0 ? (
        <div className="no-servicios">
          <p>No tienes servicios publicados aún.</p>
          <button className="btn-crear-primero" onClick={handleOpenForm}>Crear mi primer servicio</button>
        </div>
      ) : (
        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <div key={servicio.id_publicacion} className="servicio-card">
              {/* Imagen principal */}
              <div className="servicio-imagen">
                {servicio.imagen_publicacion && servicio.imagen_publicacion.length > 0 ? (
                  <img
                    src={servicio.imagen_publicacion[0].url_imagen}
                    alt={servicio.titulo}
                  />
                ) : (
                  <div className="no-imagen">Sin imagen</div>
                )}
                <span className={`estado-badge ${servicio.estado}`}>
                  {servicio.estado}
                </span>
              </div>

              {/* Información del servicio */}
              <div className="servicio-info">
                <h3>{servicio.titulo}</h3>
                <p className="descripcion">{servicio.descripcion}</p>

                <div className="precio-rango">
                  <span className="precio">
                    ${Number(servicio.rango_precio_min).toFixed(2)} -
                    ${Number(servicio.rango_precio_max).toFixed(2)}
                  </span>
                </div>

                <div className="stats">
                  <span className="stat">
                    ⭐ {servicio.calificacion_promedio_publicacion ?
                      Number(servicio.calificacion_promedio_publicacion).toFixed(1) :
                      'Sin calificación'}
                  </span>
                  <span className="stat">
                    💬 {servicio.total_reseñas_publicacion || 0} reseñas
                  </span>
                  <span className="stat">
                    👁️ {servicio.vistas} vistas
                  </span>
                </div>

                <div className="servicio-acciones">
                  <button className="btn-editar">Editar</button>
                  <button className="btn-ver">Ver publicación</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

MisServicios.propTypes = {
  idProveedor: PropTypes.number
};

export default MisServicios;
