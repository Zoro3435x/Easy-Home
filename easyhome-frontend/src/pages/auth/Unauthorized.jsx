function Unauthorized() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>🚫</h1>
      <h2 style={{ color: '#dc3545', marginTop: '20px' }}>Acceso No Autorizado</h2>
      <p style={{ color: '#666', maxWidth: '500px', margin: '20px auto' }}>
        No tienes los permisos necesarios para acceder a esta página.
        Por favor, contacta al administrador si crees que esto es un error.
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Volver al Inicio
      </button>
    </div>
  );
}

export default Unauthorized;
