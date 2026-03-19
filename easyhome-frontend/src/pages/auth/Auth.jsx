import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await auth.signinRedirect();
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
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
      <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
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
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
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
