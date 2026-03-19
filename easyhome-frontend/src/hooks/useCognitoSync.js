// hooks/useCognitoSync.js
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

const API_URL = 'http://localhost:8000';

export const useCognitoSync = () => {
  const auth = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (auth.isAuthenticated && auth.user) {
        try {
          const userData = {
            email: auth.user.profile.email,
            cognito_sub: auth.user.profile.sub,
            name: auth.user.profile.name || auth.user.profile.email.split('@')[0],
            phone: auth.user.profile.phone_number || null,
            cognito_groups: auth.user.profile['cognito:groups'] || []
          };

          const response = await fetch(`${API_URL}/api/v1/auth/sync-cognito-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Usuario sincronizado:', data);
          } else {
            console.error('Error al sincronizar usuario:', response.statusText);
          }
        } catch (error) {
          console.error('Error al sincronizar usuario con la BD:', error);
        }
      }
    };

    syncUser();
  }, [auth.isAuthenticated, auth.user]);

  return null;
};
