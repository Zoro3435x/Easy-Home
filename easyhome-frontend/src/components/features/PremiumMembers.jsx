import React from 'react';
import '../../assets/styles/PremiumMembers.css';
// NOTA: Se eliminó la lógica de fetch y useState/useEffect de aquí,
// ya que Feed.jsx se encarga de llamar a la API y pasar la data.

export default function PremiumMembers({ miembros, isLoading }) {
    
    // Si la carga aún no termina, muestra el estado de carga
    if (isLoading) {
        return (
            <div className="premium-sidebar">
                <h2 className="premium-sidebar-title">Miembros Premium</h2>
                <p>Cargando miembros...</p>
            </div>
        );
    }

    if (!miembros || miembros.length === 0) {
        return (
            <div className="premium-sidebar">
                <h2 className="premium-sidebar-title">Miembros Premium</h2>
                <p>No se encontraron miembros premium.</p>
            </div>
        );
    }
    
    return (
        <div className="premium-sidebar">
            <h2 className="premium-sidebar-title">Miembros Premium</h2>

            <div className="premium-list">
                {miembros.map(miembro => (
                    // Mapeamos los datos del endpoint /publicaciones/miembros-premium
                    <div key={miembro.id_proveedor} className="miembro-card">
                        
                        {/* Avatar */}
                        <img 
                            // Usamos el campo foto_perfil_url del endpoint
                            src={miembro.foto_perfil_url || 'ruta/a/default_avatar.jpg'} 
                            alt={`Avatar de ${miembro.nombre_completo}`} 
                            className="miembro-avatar" 
                        />
                        
                        {/* Info del miembro (alineado a la derecha en el CSS) */}
                        <div className="miembro-info">
                            {/* Nombre del Proveedor */}
                            <span className="miembro-name">{miembro.nombre_completo}</span>
                            
                            {/* Membresía fija */}
                            <span className="miembro-membership">Miembro premium de EayHome</span>
                            
                            {/* Rating y Conteo */}
                            <div className="miembro-rating">
                                
                                {/* El endpoint no devuelve el conteo de reseñas, solo el promedio */}
                                <span className="rating-star">★</span>
                                <span>
                                    {miembro.calificacion_promedio?.toFixed(1) || 0}
                                    ({/* Conteo de reseñas no disponible en el endpoint */})
                                </span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}