from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.models import Categoria_Servicio

router = APIRouter()


class CategoryCreate(BaseModel):
    nombre_categoria: str
    descripcion: str | None = None
    icono_url: str | None = None
    orden_visualizacion: int = 1


class CategoryUpdate(BaseModel):
    nombre_categoria: str | None = None
    descripcion: str | None = None
    icono_url: str | None = None
    orden_visualizacion: int | None = None


class CategoryResponse(BaseModel):
    id_categoria: int
    nombre_categoria: str
    descripcion: str | None
    icono_url: str | None
    orden_visualizacion: int

    class Config:
        from_attributes = True


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    """
    Obtiene todas las categorías de servicios ordenadas por orden de visualización.
    """
    try:
        categories = db.query(Categoria_Servicio).order_by(Categoria_Servicio.orden_visualizacion).all()
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener categorías: {str(e)}")


@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva categoría de servicio.
    """
    try:
        # Verificar si ya existe una categoría con ese nombre
        existing = db.query(Categoria_Servicio).filter(
            Categoria_Servicio.nombre_categoria == category.nombre_categoria
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=400, 
                detail=f"Ya existe una categoría con el nombre '{category.nombre_categoria}'"
            )
        
        # Crear nueva categoría
        new_category = Categoria_Servicio(
            nombre_categoria=category.nombre_categoria,
            descripcion=category.descripcion,
            icono_url=category.icono_url,
            orden_visualizacion=category.orden_visualizacion
        )
        
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        
        return new_category
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear categoría: {str(e)}")


@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    """
    Elimina una categoría de servicio.
    """
    try:
        category = db.query(Categoria_Servicio).filter(
            Categoria_Servicio.id_categoria == category_id
        ).first()
        
        if not category:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        db.delete(category)
        db.commit()
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar categoría: {str(e)}")


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: int, category_update: CategoryUpdate, db: Session = Depends(get_db)):
    """
    Actualiza una categoría de servicio.
    """
    try:
        # Buscar la categoría existente
        category = db.query(Categoria_Servicio).filter(
            Categoria_Servicio.id_categoria == category_id
        ).first()
        
        if not category:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        # Verificar si el nuevo nombre ya existe (si se está cambiando el nombre)
        if category_update.nombre_categoria and category_update.nombre_categoria != category.nombre_categoria:
            existing = db.query(Categoria_Servicio).filter(
                Categoria_Servicio.nombre_categoria == category_update.nombre_categoria
            ).first()
            
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail=f"Ya existe una categoría con el nombre '{category_update.nombre_categoria}'"
                )
        
        # Actualizar solo los campos proporcionados
        if category_update.nombre_categoria is not None:
            category.nombre_categoria = category_update.nombre_categoria
        if category_update.descripcion is not None:
            category.descripcion = category_update.descripcion
        if category_update.icono_url is not None:
            category.icono_url = category_update.icono_url
        if category_update.orden_visualizacion is not None:
            category.orden_visualizacion = category_update.orden_visualizacion
        
        db.commit()
        db.refresh(category)
        
        return category
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar categoría: {str(e)}")

