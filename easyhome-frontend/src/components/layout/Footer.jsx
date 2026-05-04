import '../../assets/styles/Footer.css'
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Footer() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };
  const handleRegister = () => {
    navigate('/auth');
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
