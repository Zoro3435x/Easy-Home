import { useState } from 'react';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import solicitudService from '../../services/solicitudService';
import '../../assets/styles/AdminSolicitudes.css';

function AdminSolicitudes() {
  const { solicitudes, loading, error, aprobarSolicitud, rechazarSolicitud } = useSolicitudes();
  const [filtro, setFiltro] = useState('todas'); // todas, pendiente, aprobado, rechazado
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [fotosProveedor, setFotosProveedor] = useState([]);
  const [cargandoFotos, setCargandoFotos] = useState(false);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [errorFotos, setErrorFotos] = useState(null);

  const solicitudesFiltradas = solicitudes.filter(sol => {
    if (filtro === 'todas') return true;
    return sol.estado_solicitud === filtro;
  });

  const cargarFotosProveedor = async (idProveedor, mostrarMensaje = false) => {
    setCargandoFotos(true);
    setErrorFotos(null);
    try {
      const fotos = await solicitudService.obtenerFotosProveedor(idProveedor);
      setFotosProveedor(fotos);
      setMostrarGaleria(true);
      if (mostrarMensaje) {
        alert('✅ URLs de fotos regeneradas correctamente');
      }
    } catch (err) {
      console.error('Error cargando fotos:', err);
      setErrorFotos('Error al cargar las fotos del proveedor');
      setFotosProveedor([]);
    } finally {
      setCargandoFotos(false);
    }
  };

  const recargarFotos = () => {
    if (solicitudSeleccionada) {
      cargarFotosProveedor(solicitudSeleccionada.id_proveedor, true);
    }
  };

  const handleVerDetalles = async (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    // Cargar fotos automáticamente al ver detalles
    await cargarFotosProveedor(solicitud.id_proveedor);
  };

  const cerrarModal = () => {
    setSolicitudSeleccionada(null);
    setFotosProveedor([]);
    setMostrarGaleria(false);
    setErrorFotos(null);
  };

  const handleAprobar = async (idProveedor) => {
    if (!confirm('¿Estás seguro de que deseas aprobar esta solicitud? El usuario será movido al grupo de Trabajadores.')) {
      return;
    }
    
    setProcesando(true);
    const result = await aprobarSolicitud(idProveedor);
    setProcesando(false);
    
    if (result.success) {
      alert(result.message);
      cerrarModal();
    } else {
      alert('Error: ' + result.message);
    }
  };

  const handleRechazar = async (idProveedor) => {
    if (!confirm('⚠️ ¿Estás seguro de que deseas rechazar esta solicitud?\n\nEsto eliminará:\n- La solicitud completa\n- Todas las fotos del proveedor\n\nEl usuario podrá crear una nueva solicitud.')) {
      return;
    }
    
    setProcesando(true);
    const result = await rechazarSolicitud(idProveedor);
    setProcesando(false);
    
    if (result.success) {
      alert(result.message);
      cerrarModal();
    } else {
      alert('Error: ' + result.message);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'badge-warning';
      case 'aprobado':
        return 'badge-success';
      case 'rechazado':
        return 'badge-danger';
      default:
        return 'badge-default';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-solicitudes">
      <div className="solicitudes-header">
        <h1>Gestión de Solicitudes de Proveedor</h1>
        <p className="subtitle">Revisa, aprueba o rechaza solicitudes de trabajadores</p>
      </div>

      {/* Filtros */}
      <div className="solicitudes-filters">
        <button 
          className={`filter-btn ${filtro === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          Todas ({solicitudes.length})
        </button>
        <button 
          className={`filter-btn ${filtro === 'pendiente' ? 'active' : ''}`}
          onClick={() => setFiltro('pendiente')}
        >
          Pendientes ({solicitudes.filter(s => s.estado_solicitud === 'pendiente').length})
        </button>
        <button 
          className={`filter-btn ${filtro === 'aprobado' ? 'active' : ''}`}
          onClick={() => setFiltro('aprobado')}
        >
          Aprobadas ({solicitudes.filter(s => s.estado_solicitud === 'aprobado').length})
        </button>
        <button 
          className={`filter-btn ${filtro === 'rechazado' ? 'active' : ''}`}
          onClick={() => setFiltro('rechazado')}
        >
          Rechazadas ({solicitudes.filter(s => s.estado_solicitud === 'rechazado').length})
        </button>
      </div>

      {/* Estado de carga */}
      {loading && !procesando && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando solicitudes...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-state">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Lista de solicitudes */}
      {!loading && !error && solicitudesFiltradas.length === 0 && (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <h3>No hay solicitudes {filtro !== 'todas' ? filtro + 's' : ''}</h3>
          <p>No se encontraron solicitudes que coincidan con el filtro seleccionado.</p>
        </div>
      )}

      {!loading && !error && solicitudesFiltradas.length > 0 && (
        <div className="solicitudes-grid">
          {solicitudesFiltradas.map((solicitud) => (
            <div key={solicitud.id_proveedor} className="solicitud-card">
              <div className="solicitud-header">
                <div>
                  <h3>{solicitud.nombre_completo}</h3>
                  <p className="solicitud-email">{solicitud.email_usuario}</p>
                </div>
                <span className={`badge ${getEstadoBadgeClass(solicitud.estado_solicitud)}`}>
                  {solicitud.estado_solicitud}
                </span>
              </div>

              <div className="solicitud-info">
                <div className="info-row">
                  <span className="info-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-phone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg> Teléfono:</span>
                  <span className="info-value">{solicitud.telefono_usuario || 'No registrado'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-map-pin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg> Dirección:</span>
                  <span className="info-value">{solicitud.direccion}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-id"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 8l2 0" /><path d="M15 12l2 0" /><path d="M7 16l10 0" /></svg> CURP:</span>
                  <span className="info-value">{solicitud.curp}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l3 -2" /><path d="M12 7v5" /></svg> Experiencia:</span>
                  <span className="info-value">{solicitud.años_experiencia} años</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-tool"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" /></svg> Servicios:</span>
                  <span className="info-value">{solicitud.especializaciones}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-week"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M7 14h.013" /><path d="M10.01 14h.005" /><path d="M13.01 14h.005" /><path d="M16.015 14h.005" /><path d="M13.015 17h.005" /><path d="M7.01 17h.005" /><path d="M10.01 17h.005" /></svg> Fecha solicitud:</span>
                  <span className="info-value">{formatearFecha(solicitud.fecha_solicitud)}</span>
                </div>
                {solicitud.fecha_aprobacion && (
                  <div className="info-row">
                    <span className="info-label"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-checks"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 12l5 5l10 -10" /><path d="M2 12l5 5m5 -5l5 -5" /></svg> Fecha aprobación:</span>
                    <span className="info-value">{formatearFecha(solicitud.fecha_aprobacion)}</span>
                  </div>
                )}
              </div>

              <div className="solicitud-actions">
                <button
                  className="btn-details"
                  onClick={() => handleVerDetalles(solicitud)}
                >
                  Ver detalles
                </button>
                
                {solicitud.estado_solicitud === 'pendiente' && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() => handleAprobar(solicitud.id_proveedor)}
                      disabled={procesando}
                    >
                      {procesando ? 'Procesando...' : '✓ Aprobar'}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleRechazar(solicitud.id_proveedor)}
                      disabled={procesando}
                    >
                      {procesando ? 'Procesando...' : '✗ Rechazar'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {solicitudSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de la Solicitud</h2>
              <button className="modal-close" onClick={cerrarModal}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Información Personal</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Nombre completo:</label>
                    <p>{solicitudSeleccionada.nombre_completo}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <p>{solicitudSeleccionada.email_usuario}</p>
                  </div>
                  <div className="detail-item">
                    <label>Teléfono:</label>
                    <p>{solicitudSeleccionada.telefono_usuario || 'No registrado'}</p>
                  </div>
                  <div className="detail-item">
                    <label>CURP:</label>
                    <p>{solicitudSeleccionada.curp}</p>
                  </div>
                  <div className="detail-item">
                    <label>Dirección:</label>
                    <p>{solicitudSeleccionada.direccion}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Información Profesional</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Años de experiencia:</label>
                    <p>{solicitudSeleccionada.años_experiencia} años</p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Servicios que ofrece:</label>
                    <p>{solicitudSeleccionada.especializaciones}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Estado de la Solicitud</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Estado:</label>
                    <span className={`badge ${getEstadoBadgeClass(solicitudSeleccionada.estado_solicitud)}`}>
                      {solicitudSeleccionada.estado_solicitud}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Fecha de solicitud:</label>
                    <p>{formatearFecha(solicitudSeleccionada.fecha_solicitud)}</p>
                  </div>
                  {solicitudSeleccionada.fecha_aprobacion && (
                    <div className="detail-item">
                      <label>Fecha de aprobación:</label>
                      <p>{formatearFecha(solicitudSeleccionada.fecha_aprobacion)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Galería de Fotos */}
              <div className="detail-section">
                <div className="section-header-with-action">
                  <h3><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg> Evidencia Fotográfica</h3>
                  {fotosProveedor.length > 0 && (
                    <button 
                      className="btn-reload-fotos"
                      onClick={recargarFotos}
                      disabled={cargandoFotos}
                      title="Regenerar URLs de fotos (si expiraron)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg> Recargar Fotos
                    </button>
                  )}
                </div>
                
                {cargandoFotos && (
                  <div className="loading-fotos">
                    <div className="spinner-small"></div>
                    <p>Cargando fotos...</p>
                  </div>
                )}

                {errorFotos && (
                  <div className="error-fotos">
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg> {errorFotos}</p>
                    <button onClick={recargarFotos} className="btn-retry">
                      Reintentar
                    </button>
                  </div>
                )}

                {!cargandoFotos && !errorFotos && fotosProveedor.length === 0 && (
                  <div className="no-fotos">
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-mood-sad"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 10l.01 0" /><path d="M15 10l.01 0" /><path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" /></svg> No hay fotos disponibles para esta solicitud</p>
                  </div>
                )}

                {!cargandoFotos && !errorFotos && fotosProveedor.length > 0 && (
                  <div className="fotos-galeria">
                    <div className="fotos-header">
                      <p className="fotos-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg> {fotosProveedor.length} foto{fotosProveedor.length !== 1 ? 's' : ''} de trabajo
                      </p>
                      <p className="fotos-expiracion-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l3 -2" /><path d="M12 7v5" /></svg> URLs válidas por {fotosProveedor[0]?.expira_en || '1 hora'}
                      </p>
                    </div>
                    <div className="fotos-grid">
                      {fotosProveedor.map((foto, index) => (
                        <div key={foto.id_foto} className="foto-item">
                          <img 
                            src={foto.url_temporal} 
                            alt={`Evidencia ${index + 1}`}
                            loading="lazy"
                            onError={(e) => {
                              e.target.parentElement.classList.add('foto-error');
                            }}
                          />
                          <div className="foto-overlay">
                            <span className="foto-numero">#{index + 1}</span>
                            <a 
                              href={foto.url_temporal} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="foto-ver-completa"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg> Ver completa
                            </a>
                          </div>
                          <div className="foto-error-overlay">
                            <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg> URL expirada</p>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                recargarFotos();
                              }}
                              className="btn-regenerar-mini"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg> Regenerar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="fotos-footer">
                      <p className="fotos-aviso">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bulb"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><path d="M9.7 17l4.6 0" /></svg> Si las imágenes no cargan, las URLs pueden haber expirado. 
                        Click en "Recargar Fotos" para generar nuevas URLs temporales.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {solicitudSeleccionada.estado_solicitud === 'pendiente' && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => handleAprobar(solicitudSeleccionada.id_proveedor)}
                    disabled={procesando}
                  >
                    {procesando ? 'Procesando...' : '✓ Aprobar Solicitud'}
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleRechazar(solicitudSeleccionada.id_proveedor)}
                    disabled={procesando}
                  >
                    {procesando ? 'Procesando...' : '✗ Rechazar y Eliminar'}
                  </button>
                </>
              )}
              <button className="btn-secondary" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSolicitudes;
