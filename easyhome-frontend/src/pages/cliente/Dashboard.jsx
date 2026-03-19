function ClienteDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard del Cliente</h1>
      <p>Bienvenido a tu panel de cliente. Aquí podrás:</p>
      <ul>
        <li>Ver tus servicios contratados</li>
        <li>Solicitar nuevos servicios</li>
        <li>Gestionar tus pagos</li>
        <li>Ver tu historial</li>
      </ul>
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#d1ecf1',
        border: '1px solid #bee5eb',
        borderRadius: '4px'
      }}>
        <strong>📝 En desarrollo:</strong> El equipo implementará las funcionalidades completas.
      </div>
    </div>
  );
}

export default ClienteDashboard;
