import { BrowserRouter } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import Layout from './components/layout/Layout'
import AppRoutes from './components/routes/AppRoutes'
import { useCognitoSync } from './hooks/useCognitoSync'

function App() {
  const auth = useAuth();
  
  // Sincronizar usuario con la base de datos cuando inicie sesión
  useCognitoSync();

  if (auth.isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Error de autenticación</h2>
        <p>{auth.error.message}</p>
        <button onClick={() => window.location.href = '/'}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}

export default App