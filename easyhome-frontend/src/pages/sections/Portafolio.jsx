import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../config/api';

function Portafolio({ idProveedor }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  useEffect(() => {
    const fetchPortafolio = async () => {
      if (!idProveedor) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/v1/proveedores/${idProveedor}/portafolio`);
        setImagenes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener portafolio:', err);
        setError('No se pudo cargar el portafolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortafolio();
  }, [idProveedor]);

  const abrirModal = (imagen) => {
    setImagenSeleccionada(imagen);
  };

  const cerrarModal = () => {
    setImagenSeleccionada(null);
  };

  if (!idProveedor) {
    return (
      <div className="portafolio-container">
        <h2>Portafolio</h2>
        <p>Esta sección está disponible solo para proveedores de servicios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="portafolio-container">
        <div className="loading">Cargando portafolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portafolio-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="portafolio-container">
      <div className="header-section">
        <h2>Portafolio</h2>
        <p className="subtitle">Galería de trabajos realizados</p>
      </div>

      {imagenes.length === 0 ? (
        <div className="no-imagenes">
          <p>No hay imágenes en el portafolio aún.</p>
          <p className="hint">Las imágenes de tus servicios aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <>
          <div className="galeria-grid">
            {imagenes.map((imagen) => (
              <div
                key={imagen.id_imagen}
                className="galeria-item"
                onClick={() => abrirModal(imagen)}
              >
                <img
                  src={imagen.url_imagen}
                  alt={`Trabajo ${imagen.id_imagen}`}
                  loading="lazy"
                />
                <div className="overlay">
                  <span className="ver-mas">🔍 Ver más</span>
                </div>
              </div>
            ))}
          </div>

          <div className="galeria-info">
            <p>{imagenes.length} {imagenes.length === 1 ? 'imagen' : 'imágenes'} en total</p>
          </div>
        </>
      )}

      {/* Modal para ver imagen en grande */}
      {imagenSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-cerrar" onClick={cerrarModal}>✕</button>
            <img
              src={imagenSeleccionada.url_imagen}
              alt={`Imagen ${imagenSeleccionada.id_imagen}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

Portafolio.propTypes = {
  idProveedor: PropTypes.number
};

export default Portafolio;
