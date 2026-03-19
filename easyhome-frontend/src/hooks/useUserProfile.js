import { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import api from '../config/api';

/**
 * Hook para obtener y gestionar el perfil del usuario
 */
export const useUserProfile = () => {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.isAuthenticated || !auth.user?.profile?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const email = auth.user.profile.email;
        console.log('Obteniendo datos del usuario con email:', email);
        // Codificar el email para la URL
        const encodedEmail = encodeURIComponent(email);
        console.log('Email codificado:', encodedEmail);
        const response = await api.get(`/api/v1/auth/user-info/${encodedEmail}`);
        console.log('Datos del usuario obtenidos:', response.data);
        setUserData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        console.error('Respuesta del error:', err.response);
        setError(err.response?.data?.detail || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth.isAuthenticated, auth.user]);

  /**
   * Calcula la edad basada en la fecha de nacimiento
   */
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  /**
   * Separa el nombre completo en nombres y apellidos
   */
  const splitName = (fullName) => {
    if (!fullName) return { nombres: '', apellidos: '' };
    
    const parts = fullName.trim().split(' ');
    
    // Asumimos que los primeros 2 son nombres y el resto apellidos
    // Puedes ajustar esta lógica según necesites
    if (parts.length <= 2) {
      return {
        nombres: parts[0] || '',
        apellidos: parts[1] || ''
      };
    }
    
    const nombres = parts.slice(0, 2).join(' ');
    const apellidos = parts.slice(2).join(' ');
    
    return { nombres, apellidos };
  };

  /**
   * Actualiza los datos del usuario
   */
  const updateUserData = async (newData) => {
    try {
      // Este endpoint aún no existe en el backend
      // Por ahora solo actualizamos el estado local
      setUserData(prev => ({ ...prev, ...newData }));
      return { success: true };
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Error al actualizar el perfil' 
      };
    }
  };

  /**
   * Sube una nueva foto de perfil
   */
  const uploadProfilePhoto = async (file) => {
    if (!userData?.id_usuario) {
      return { success: false, error: 'Usuario no identificado' };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put(
        `/api/v1/usuarios/${userData.id_usuario}/foto-perfil`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Actualizar estado local con la nueva URL
      setUserData(prev => ({
        ...prev,
        foto_perfil_url: response.data.foto_perfil_url
      }));

      return { 
        success: true, 
        url: response.data.foto_perfil_url,
        message: response.data.message 
      };
    } catch (err) {
      console.error('Error al subir foto de perfil:', err);
      return {
        success: false,
        error: err.response?.data?.detail || 'Error al subir la foto de perfil'
      };
    }
  };

  /**
   * Obtiene la URL de la foto de perfil
   */
  const getProfilePhotoUrl = async () => {
    if (!userData?.id_usuario) {
      return { success: false, error: 'Usuario no identificado' };
    }

    try {
      const response = await api.get(
        `/api/v1/usuarios/${userData.id_usuario}/foto-perfil`
      );

      return {
        success: true,
        url: response.data.foto_perfil_url
      };
    } catch (err) {
      // Si no hay foto, no es un error crítico
      if (err.response?.status === 404) {
        return { success: false, error: 'No hay foto de perfil' };
      }
      console.error('Error al obtener foto de perfil:', err);
      return {
        success: false,
        error: err.response?.data?.detail || 'Error al obtener la foto de perfil'
      };
    }
  };

  /**
   * Elimina la foto de perfil
   */
  const deleteProfilePhoto = async () => {
    if (!userData?.id_usuario) {
      return { success: false, error: 'Usuario no identificado' };
    }

    try {
      const response = await api.delete(
        `/api/v1/usuarios/${userData.id_usuario}/foto-perfil`
      );

      // Actualizar estado local
      setUserData(prev => ({
        ...prev,
        foto_perfil_url: null
      }));

      return {
        success: true,
        message: response.data.message
      };
    } catch (err) {
      console.error('Error al eliminar foto de perfil:', err);
      return {
        success: false,
        error: err.response?.data?.detail || 'Error al eliminar la foto de perfil'
      };
    }
  };

  return {
    userData,
    loading,
    error,
    calculateAge,
    splitName,
    updateUserData,
    uploadProfilePhoto,
    getProfilePhotoUrl,
    deleteProfilePhoto,
    refetch: () => {
      setLoading(true);
      // Trigger re-fetch
    }
  };
};
