import { Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import ProtectedRoute from './ProtectedRoute';
import Callback from '../../pages/auth/Callback';
import Auth from '../../pages/auth/Auth';
import Unauthorized from '../../pages/auth/Unauthorized';
import Subscriptions from '../../pages/Subscriptions';
import Advertise from '../../pages/Advertise';
import Postulate from '../../pages/Postulate';
import Perfil from '../../pages/Perfil';

// Páginas de Cliente
import ClienteDashboard from '../../pages/cliente/Dashboard';
import ClienteServicios from '../../pages/cliente/Servicios';
import ClienteFeed from '../../pages/cliente/feed';

// Páginas de Trabajador
import TrabajadorDashboard from '../../pages/trabajador/Dashboard';
import TrabajadorServicios from '../../pages/trabajador/Servicios';

// Páginas de Admin
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminCategories from '../../pages/admin/AdminCategories';
import AdminUsuarios from '../../pages/admin/AdminUsuarios';
import AdminReportes from '../../pages/admin/AdminReportes';
import AdminSolicitudes from '../../pages/admin/AdminSolicitudes';
import PublicarServicio from '../../pages/Service_publication_form';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/callback" element={<Callback />} /> 
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/advertise" element={<Advertise />} />
      <Route path="/publicarservicio" element={<PublicarServicio />} />
      
      {/* Ruta de postulación - Solo para clientes autenticados */}
      <Route 
        path="/postulate" 
        element={
          <ProtectedRoute allowedRoles={['Clientes']}>
            <Postulate />
          </ProtectedRoute>
        } 
      />

      {/* Perfil unificado - Todos los autenticados */}
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute allowedRoles={['Clientes', 'Trabajadores', 'Admin']}>
            <Perfil />
          </ProtectedRoute>
        } 
      />

      {/* Rutas de Cliente (prioridad 1 - incluye Google) */}
        <Route 
          path="/cliente/feed"
          element={
            <ProtectedRoute allowedRoles={['Clientes']}>
              <ClienteFeed />
            </ProtectedRoute>
          }
        />
      <Route 
        path="/cliente/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['Clientes']}>
            <ClienteDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cliente/servicios" 
        element={
          <ProtectedRoute allowedRoles={['Clientes']}>
            <ClienteServicios />
          </ProtectedRoute>
        } 
      />

      {/* Rutas de Trabajador (prioridad 2) */}
      <Route 
        path="/trabajador/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['Trabajadores']}>
            <TrabajadorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trabajador/servicios" 
        element={
          <ProtectedRoute allowedRoles={['Trabajadores']}>
            <TrabajadorServicios />
          </ProtectedRoute>
        } 
      />

      {/* Rutas de Admin */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/usuarios" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminUsuarios />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/reportes" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminReportes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/categories" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminCategories />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/solicitudes" 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminSolicitudes />
          </ProtectedRoute>
        } 
      />

      {/* Ruta 404 */}
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;