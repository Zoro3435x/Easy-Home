import { Link } from 'react-router-dom';
import '../../assets/styles/AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">
        <header className="dashboard-header">
          <h1>Panel de Administración</h1>
          <p className="dashboard-subtitle">Gestiona todos los aspectos de EasyHome</p>
        </header>

        <div className="dashboard-grid">
          {/* Card de Categorías */}
          <Link to="/admin/categories" className="dashboard-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Categorías</h3>
              <p className="card-description">
                Gestiona las categorías de servicios disponibles en la plataforma
              </p>
            </div>
            <div className="card-arrow">→</div>
          </Link>

          {/* Card de Solicitudes de Proveedor */}
          <Link to="/admin/solicitudes" className="dashboard-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Solicitudes de Proveedor</h3>
              <p className="card-description">
                Revisa, aprueba o rechaza solicitudes de trabajadores
              </p>
            </div>
            <div className="card-arrow">→</div>
          </Link>

          {/* Card de Usuarios - Próximamente */}
          <div className="dashboard-card dashboard-card-disabled">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Usuarios</h3>
              <p className="card-description">
                Administra usuarios, roles y permisos
              </p>
              <span className="card-badge">Próximamente</span>
            </div>
          </div>

          {/* Card de Publicaciones - Próximamente */}
          <div className="dashboard-card dashboard-card-disabled">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Publicaciones</h3>
              <p className="card-description">
                Modera y gestiona las publicaciones de servicios
              </p>
              <span className="card-badge">Próximamente</span>
            </div>
          </div>

          {/* Card de Reportes - Próximamente */}
          <div className="dashboard-card dashboard-card-disabled">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Reportes</h3>
              <p className="card-description">
                Visualiza estadísticas y reportes del sistema
              </p>
              <span className="card-badge">Próximamente</span>
            </div>
          </div>

          {/* Card de Suscripciones - Próximamente */}
          <div className="dashboard-card dashboard-card-disabled">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Suscripciones</h3>
              <p className="card-description">
                Gestiona planes y suscripciones premium
              </p>
              <span className="card-badge">Próximamente</span>
            </div>
          </div>

          {/* Card de Configuración - Próximamente */}
          <div className="dashboard-card dashboard-card-disabled">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m6-12h-6m-6 0h6m6 6h-6m-6 0h6"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Configuración</h3>
              <p className="card-description">
                Configura parámetros generales del sistema
              </p>
              <span className="card-badge">Próximamente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
