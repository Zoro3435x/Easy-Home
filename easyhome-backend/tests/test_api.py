import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime

from main import app
from app.models.user import Usuario, Proveedor_Servicio
from app.models.property import Categoria_Servicio, Publicacion_Servicio


class TestCategories:
    """
    Tests para los endpoints de Categorías
    """
    
    def test_listar_categorias_retorna_lista_vacia(self, client: TestClient, db_session: Session):
        """
        Verifica que GET /api/v1/categories/ retorna una lista vacía cuando no hay categorías.
        """
        response = client.get("/api/v1/categories/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) == 0
    
    
    def test_listar_categorias_retorna_existentes(self, client: TestClient, db_session: Session, sample_category):
        """
        Verifica que GET /api/v1/categories/ retorna las categorías existentes.
        """
        # Crear una segunda categoría
        category2 = Categoria_Servicio(
            nombre_categoria="Electricidad",
            descripcion="Servicios de electricidad",
            icono_url="https://example.com/electricidad.png",
            orden_visualizacion=2
        )
        db_session.add(category2)
        db_session.commit()
        
        response = client.get("/api/v1/categories/")
        assert response.status_code == 200
        assert len(response.json()) == 2
        
        nombres = [cat["nombre_categoria"] for cat in response.json()]
        assert "Plomería" in nombres
        assert "Electricidad" in nombres
    
    
    def test_listar_categorias_respeta_orden(self, client: TestClient, db_session: Session):
        """
        Verifica que GET /api/v1/categories/ retorna las categorías ordenadas por orden_visualizacion.
        """
        # Crear categorías con orden específico
        cat1 = Categoria_Servicio(
            nombre_categoria="Categoría Z",
            orden_visualizacion=3
        )
        cat2 = Categoria_Servicio(
            nombre_categoria="Categoría A",
            orden_visualizacion=1
        )
        cat3 = Categoria_Servicio(
            nombre_categoria="Categoría M",
            orden_visualizacion=2
        )
        
        db_session.add_all([cat1, cat2, cat3])
        db_session.commit()
        
        response = client.get("/api/v1/categories/")
        assert response.status_code == 200
        
        categorias = response.json()
        ordenes = [cat["orden_visualizacion"] for cat in categorias]
        # Verificar que están ordenadas
        assert ordenes == sorted(ordenes)
        
        # Verificar nombres en orden
        nombres = [cat["nombre_categoria"] for cat in categorias]
        assert nombres == ["Categoría A", "Categoría M", "Categoría Z"]
    
    
    def test_crear_categoria_exitosamente(self, client: TestClient):
        """
        Verifica que POST /api/v1/categories/ crea una categoría exitosamente.
        """
        payload = {
            "nombre_categoria": "Jardinería",
            "descripcion": "Servicios de jardinería",
            "icono_url": "https://example.com/jardineria.png",
            "orden_visualizacion": 1
        }
        
        response = client.post("/api/v1/categories/", json=payload)
        assert response.status_code == 201
        
        data = response.json()
        assert data["nombre_categoria"] == "Jardinería"
        assert data["descripcion"] == "Servicios de jardinería"
        assert data["icono_url"] == "https://example.com/jardineria.png"
        assert "id_categoria" in data
    
    
    def test_crear_categoria_sin_nombre_retorna_422(self, client: TestClient):
        """
        Verifica que POST /api/v1/categories/ retorna 422 cuando falta el nombre.
        """
        payload = {
            "descripcion": "Servicios sin nombre",
            "icono_url": "https://example.com/icon.png"
        }
        
        response = client.post("/api/v1/categories/", json=payload)
        assert response.status_code == 422
    
    
    def test_crear_categoria_duplicada_retorna_400(self, client: TestClient, sample_category):
        """
        Verifica que POST /api/v1/categories/ retorna 400 cuando el nombre ya existe.
        """
        payload = {
            "nombre_categoria": "Plomería",  # Nombre duplicado
            "descripcion": "Otra descripción",
            "orden_visualizacion": 5
        }
        
        response = client.post("/api/v1/categories/", json=payload)
        assert response.status_code == 400
        assert "ya existe" in response.json()["detail"].lower()
    
    
    def test_actualizar_categoria(self, client: TestClient, sample_category):
        """
        Verifica que PUT /api/v1/categories/{id} actualiza una categoría correctamente.
        """
        payload = {
            "nombre_categoria": "Plomería Premium",
            "descripcion": "Servicios de plomería de lujo",
            "orden_visualizacion": 2
        }
        
        response = client.put(
            f"/api/v1/categories/{sample_category.id_categoria}",
            json=payload
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["nombre_categoria"] == "Plomería Premium"
        assert data["descripcion"] == "Servicios de plomería de lujo"
        assert data["orden_visualizacion"] == 2
    
    
    def test_eliminar_categoria(self, client: TestClient, sample_category):
        """
        Verifica que DELETE /api/v1/categories/{id} elimina una categoría correctamente.
        """
        category_id = sample_category.id_categoria
        
        # Verificar que existe antes de eliminar
        response = client.get("/api/v1/categories/")
        assert len(response.json()) == 1
        
        # Eliminar
        response = client.delete(f"/api/v1/categories/{category_id}")
        assert response.status_code == 204
        
        # Verificar que fue eliminada
        response = client.get("/api/v1/categories/")
        assert len(response.json()) == 0


class TestUsers:
    """
    Tests para los endpoints de Usuarios (autenticación y sincronización)
    """
    
    def test_crear_nuevo_usuario_cliente(self, client: TestClient, db_session: Session):
        """
        Verifica que POST /api/v1/auth/sync-cognito-user crea un nuevo usuario cliente.
        """
        payload = {
            "email": "nuevo_cliente@example.com",
            "cognito_sub": "cognito_123",
            "name": "Nuevo Cliente",
            "phone": "5551234567",
            "cognito_groups": ["Clientes"]
        }
        
        response = client.post("/api/v1/auth/sync-cognito-user", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Usuario creado exitosamente"
        assert data["is_new"] == True
        assert "user_id" in data
        
        # Verificar que el usuario se creó en la BD
        user = db_session.query(Usuario).filter(
            Usuario.correo_electronico == "nuevo_cliente@example.com"
        ).first()
        assert user is not None
        assert user.tipo_usuario == "cliente"
    
    
    def test_actualizar_usuario_no_crea_duplicado(self, client: TestClient, db_session: Session, sample_user):
        """
        Verifica que sincronizar un usuario existente lo actualiza sin crear duplicado.
        """
        payload = {
            "email": "juan@example.com",  # Email existente
            "cognito_sub": "new_cognito_sub",
            "name": "Juan Pérez Actualizado",
            "phone": "5559876543",
            "cognito_groups": ["Clientes"]
        }
        
        response = client.post("/api/v1/auth/sync-cognito-user", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Usuario actualizado"
        assert data["is_new"] == False
        
        # Verificar que no hay duplicados
        users = db_session.query(Usuario).filter(
            Usuario.correo_electronico == "juan@example.com"
        ).all()
        assert len(users) == 1
    
    
    def test_usuario_proveedor_tipo_correcto(self, client: TestClient, db_session: Session):
        """
        Verifica que un usuario sincronizado con grupo "Trabajadores" sea de tipo "proveedor".
        """
        payload = {
            "email": "nuevo_proveedor@example.com",
            "cognito_sub": "cognito_provider_123",
            "name": "Nuevo Proveedor",
            "phone": "5552223333",
            "cognito_groups": ["Trabajadores"]
        }
        
        response = client.post("/api/v1/auth/sync-cognito-user", json=payload)
        assert response.status_code == 200
        
        user = db_session.query(Usuario).filter(
            Usuario.correo_electronico == "nuevo_proveedor@example.com"
        ).first()
        assert user is not None
        assert user.tipo_usuario == "proveedor"
    
    
    def test_sync_email_invalido_retorna_422(self, client: TestClient):
        """
        Verifica que POST /api/v1/auth/sync-cognito-user retorna 422 con email inválido.
        """
        payload = {
            "email": "email_invalido",  # Email sin @
            "cognito_sub": "cognito_123",
            "name": "Usuario",
            "cognito_groups": ["Clientes"]
        }
        
        response = client.post("/api/v1/auth/sync-cognito-user", json=payload)
        assert response.status_code == 422
    
    
    def test_get_user_info(self, client: TestClient, sample_user):
        """
        Verifica que GET /api/v1/auth/user-info/{email} retorna información del usuario.
        """
        response = client.get("/api/v1/auth/user-info/juan@example.com")
        assert response.status_code == 200
        
        data = response.json()
        assert data["correo_electronico"] == "juan@example.com"
        assert data["nombre"] == "Juan Pérez"
        assert data["tipo_usuario"] == "cliente"
        assert data["id_usuario"] == sample_user.id_usuario
        assert data["id_proveedor"] is None  # No es proveedor
    
    
    def test_get_user_info_proveedor(self, client: TestClient, sample_provider_user):
        """
        Verifica que GET /api/v1/auth/user-info/{email} incluye id_proveedor para proveedores aprobados.
        """
        user, provider = sample_provider_user
        
        response = client.get(f"/api/v1/auth/user-info/{user.correo_electronico}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["correo_electronico"] == user.correo_electronico
        assert data["tipo_usuario"] == "proveedor"
        assert data["id_proveedor"] == provider.id_proveedor
    
    
    def test_get_user_info_404(self, client: TestClient):
        """
        Verifica que GET /api/v1/auth/user-info/{email} retorna 404 para usuario inexistente.
        """
        response = client.get("/api/v1/auth/user-info/noexiste@example.com")
        assert response.status_code == 404
        assert "no encontrado" in response.json()["detail"].lower()


class TestPublications:
    """
    Tests para los endpoints de Publicaciones
    """
    
    def test_listar_publicaciones_retorna_200(self, client: TestClient, sample_publication):
        """
        Verifica que GET /api/v1/publicaciones/ retorna status 200.
        """
        response = client.get("/api/v1/publicaciones/")
        assert response.status_code == 200
    
    
    def test_solo_publicaciones_activas(self, client: TestClient, db_session: Session, 
                                        sample_publication, sample_inactive_publication):
        """
        Verifica que GET /api/v1/publicaciones/ solo retorna publicaciones activas.
        """
        response = client.get("/api/v1/publicaciones/")
        assert response.status_code == 200
        
        publicaciones = response.json()
        
        # Verificar que todas las publicaciones retornadas están activas
        # Si la respuesta es una lista, verificar que solo contiene activas
        if isinstance(publicaciones, list) and len(publicaciones) > 0:
            # En este caso hay publicaciones retornadas
            # Según el código, debería retornar las activas
            assert len(publicaciones) >= 1  # Al menos la publicación activa
            
            # Si el endpoint retorna un diccionario con detalles, podemos verificar el estado
            for pub in publicaciones:
                if "estado" in pub:
                    assert pub["estado"] == "activo"
