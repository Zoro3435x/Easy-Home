import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultRouteByRole } from '../../utils/authUtils';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const loggedUser = await auth.loginWithGoogle();
      const targetRoute = getDefaultRouteByRole(loggedUser);
      navigate(targetRoute);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);

      if (!email || !password) {
        setError('Ingresa email y contraseña.');
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      try {
        let loggedUser;
        if (isLogin) {
          loggedUser = await auth.login(email, password);
        } else {
          loggedUser = await auth.register({ email, password });
        }
        const targetRoute = getDefaultRouteByRole(loggedUser);
        navigate(targetRoute);
      } catch (err) {
        setError('Error al iniciar sesión.');
        console.error(err);
      }
    };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center' }}>
        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>

      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        {isLogin
          ? 'Ingresa a tu cuenta de EasyHome'
          : 'Crea tu cuenta en EasyHome'}
      </p>

      {/* Botón de Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '15px'
        }}
      >
        🔐 Continuar con Google
      </button>

      {/* Separador */}
      <div style={{
        textAlign: 'center',
        margin: '20px 0',
        color: '#999'
      }}>
        ── o ──
      </div>

      {/* Formulario básico (placeholder para el equipo) */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirmar contraseña"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        )}

          {error && (
            <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>
          )}

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>

      {/* Toggle entre Login y Register */}
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          {isLogin ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </p>

      {/* Nota para el equipo de desarrollo */}
      <div style={{
        marginTop: '30px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>📝 Nota del equipo:</strong> Este es un componente básico.
        El equipo de desarrollo implementará la lógica de autenticación completa.
      </div>
    </div>
  );
}

export default Auth;
