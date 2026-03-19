import '../../assets/styles/Publicaciones.css';

// 1. Aceptar 'publicacionData' como prop
export default function Publicaciones({ publicacionData }) { 
    
    // Usamos la estructura de la respuesta del endpoint 'listar_publicaciones'
    const {
        id_publicacion,
        id_proveedor,
        descripcion_corta: descripcion, 
        rango_precio_min,
        rango_precio_max,
        url_imagen_portada, 
        
        // Datos del Proveedor
        nombre_proveedor,
        calificacion_proveedor,
        
        total_reseñas_proveedor = publicacionData.total_reseñas_proveedor || 127, 
        etiquetas = publicacionData.etiquetas || ["Confiabilidad", "Mantenimiento", "Alta experiencia"]
        
    } = publicacionData || {}; 

    // 2. Determinar si es Premium
    const esPremium = publicacionData.id_plan_suscripcion !== null && publicacionData.id_plan_suscripcion !== undefined;


    // 3. Helper para formatear el rango de precios
    const rangoPrecioFormateado = `$${rango_precio_min?.toFixed(0) || '?'}-$${rango_precio_max?.toFixed(0) || '?'}`;


    return (
        <section className="service-listings-section">
            <div className="publicacion-card">
                
                <div className="publicacion-header">
                    <div className="publicacion-perfil">
                        
                        {/* Avatar: Usamos la URL pre-firmada */}
                        <img 
                            // Usamos el campo foto_perfil_proveedor del resultado, si está disponible, 
                            // o url_imagen_portada como fallback.
                            src={publicacionData.foto_perfil_proveedor || url_imagen_portada}
                            alt={`Foto de perfil de ${nombre_proveedor}`} 
                            className="perfil-avatar" 
                        />
                        
                        <div>
                            {/* Nombre del Proveedor */}
                            <h3 className="perfil-nombre">{nombre_proveedor}</h3>
                            
                            {/* Rating y opiniones */}
                            <div className="perfil-rating">
                                <span className="rating-estrella">★</span>
                                <span>
                                    {calificacion_proveedor?.toFixed(1) || 0}
                                    ({total_reseñas_proveedor})
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Etiqueta Premium */}
                    {esPremium && (
                        <span className="badge-premium">Premium</span>
                    )}
                </div>

                {/* Resumen */}
                <p className="publicacion-descripcion">{descripcion}</p>

                {/* Contenedor de Etiquetas */}
                <div className="etiquetas-contenedor">
                    {(etiquetas || []).map((tag) => (
                        <span key={tag} className="etiqueta-item">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Imágenes (Galería) - Mapeamos la URL de portada (solo la portada está disponible en el endpoint) */}
                <div className="imagenes-contenedor">
                    {url_imagen_portada ? (
                        <>
                            <img src={url_imagen_portada} alt={`Muestra de ${nombre_proveedor}`} className="imagen-muestra" />
                            <img src={url_imagen_portada} alt={`Muestra de ${nombre_proveedor}`} className="imagen-muestra" />
                        </>
                    ) : (
                        <p>No hay imágenes disponibles.</p>
                    )}
                </div>
                
                {/* Footer (Precio y Botón) */}
                <div className="publicacion-footer">
                    {/* Rango de precio */}
                    <p className="rango-precio">
                        Rango de precio: <strong>{rangoPrecioFormateado}</strong>
                    </p>

                    {/* Botón Ir al perfil: Asumiendo que usas el id_proveedor para la ruta */}
                        <a href={`/proveedor/${publicacionData.id_proveedor}`} className="boton-perfil">
                        Ir al perfil
                    </a> 
                </div>

            </div>
        </section>
    );
}