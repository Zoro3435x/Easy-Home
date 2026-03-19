import '../../assets/styles/Footer.css'
import { useAuth } from "react-oidc-context";
import { Link } from 'react-router-dom';

function Footer() {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };
  const handleRegister = () => {
    // URL completa de registro de Cognito
    const cognitoSignupUrl = 'https://us-east-1gbsgbtrls.auth.us-east-1.amazoncognito.com/signup?client_id=478qnp7vk39jamq13sl8k4sp7t&code_challenge=8MNgRVeZQ4m-jnJljG70KrrwnX2liL7h3m433vYbEH0&code_challenge_method=S256&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code&scope=email+openid+phone&state=95b01a30d90a47cd8d3e72eb405199b5';
    // Redirige el navegador a la URL de registro
    window.location.href = cognitoSignupUrl;
    };

  return (
    
    <footer className="app-footer">
      <div className="contenido-footer">
        <div className = "contacto">
          <h3>Contacto</h3>
              <ul>
                <li>(656) 983-1368</li>
                <li>easyhome@gmail.com</li>
                <li>Sobre nosotros</li>
              </ul>
        </div>

        <div className = "servicios">
          <h3>Servicios</h3>
              <ul>
                <li>Carpintería</li>
                <li>Electricidad</li>
                <li>Plomería</li>
                <li>Limpieza</li>
                <li>Pintura</li>
                <li>Construcción</li>
              </ul>
        </div>

        <div className="mi-cuenta">
            <h3>Mi cuenta</h3>
            <ul>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); handleRegister(); }}>
                  Registrarse
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogin(); }}>
                  Iniciar Sesión
                </a>
              </li>
              <li><Link to="/subscriptions">Ver planes</Link></li>
            </ul>
        </div>
      </div>
      <div className="copyright">
        <p>© 2025 Easy Home. Todos los derechos reservados</p>
      </div>

    </footer>
  )
}

export default Footer
