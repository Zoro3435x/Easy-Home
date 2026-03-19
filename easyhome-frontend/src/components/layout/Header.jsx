import '../../assets/styles/Header.css'
import { useAuth } from "react-oidc-context";
import { Link } from 'react-router-dom';
import { isAdmin } from '../../utils/authUtils';

function Header() {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const handleLogout = () => {
    const clientId = "478qnp7vk39jamq13sl8k4sp7t";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = "https://us-east-1gbsgbtrls.auth.us-east-1.amazoncognito.com";
    
    // Primero remover el usuario localmente
    auth.removeUser();
    
    // Luego redirigir al logout de Cognito para cerrar la sesión completamente
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <header className="app-header">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="home-link">
            <span className="icon-hone">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-home">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
              </svg>
            </span>
            <span className="text-home">Home</span>
          </Link>
        </div>
        <ul className="nav-right">
          <li><a href="/cliente/feed">Publicaciones</a></li>
          
          {auth.isAuthenticated ? (
            <>
              {isAdmin(auth.user) && (
                <li>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
              )}
              <li>
                <Link to="/perfil">
                  👤 Perfil
                </Link>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  Cerrar Sesión
                </a>
              </li>
            </>
          ) : (
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogin(); }}>
                Iniciar Sesión
              </a>
            </li>
          )}
          
          <li><Link to="/subscriptions">Suscripciones</Link></li>
          <li><Link to="/advertise">Anúnciate</Link></li>    
        </ul>
      </nav>
    </header>
  )
}

export default Header