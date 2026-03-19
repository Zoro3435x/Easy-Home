import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Cuando se complete la autenticación, redirigir al home
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Procesando inicio de sesión...</h2>
      <p>Por favor espera un momento.</p>
    </div>
  );
}

export default Callback;