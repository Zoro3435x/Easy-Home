import { useState, useEffect } from 'react';
import '../../assets/styles/AdminCategories.css';
import categoryService from '../../services/categoryService';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: '',
    icono_url: '',
    orden_visualizacion: 1
  });

  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.detail || err.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'orden_visualizacion' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id_categoria, formData);
      } else {
        await categoryService.create(formData);
      }

      setFormSuccess(true);
      
      // Recargar categorías
      await fetchCategories();
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        handleCloseModal();
      }, 1500);

    } catch (err) {
      setFormError(err.detail || err.message || 'Error al guardar la categoría');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      nombre_categoria: '',
      descripcion: '',
      icono_url: '',
      orden_visualizacion: 1
    });
    setFormError(null);
    setFormSuccess(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre_categoria: category.nombre_categoria,
      descripcion: category.descripcion || '',
      icono_url: category.icono_url || '',
      orden_visualizacion: category.orden_visualizacion
    });
    setFormError(null);
    setFormSuccess(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      nombre_categoria: '',
      descripcion: '',
      icono_url: '',
      orden_visualizacion: 1
    });
    setFormError(null);
    setFormSuccess(false);
  };

  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setDeletingCategory(false);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingCategory(true);
      await categoryService.delete(categoryToDelete.id_categoria);
      
      // Recargar categorías
      await fetchCategories();
      
      // Cerrar modal
      handleCloseDeleteModal();
    } catch (err) {
      alert(`Error: ${err.detail || err.message || 'Error al eliminar la categoría'}`);
      setDeletingCategory(false);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      return;
    }

    try {
      await categoryService.delete(categoryId);
      // Recargar categorías
      await fetchCategories();
    } catch (err) {
      alert(`Error: ${err.detail || err.message || 'Error al eliminar la categoría'}`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre_categoria: category.nombre_categoria,
      descripcion: category.descripcion || '',
      icono_url: category.icono_url || '',
      orden_visualizacion: category.orden_visualizacion
    });
    setShowForm(true);
    setFormError(null);
    setFormSuccess(false);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({
      nombre_categoria: '',
      descripcion: '',
      icono_url: '',
      orden_visualizacion: 1
    });
    setShowForm(false);
    setFormError(null);
    setFormSuccess(false);
  };

  if (loading) {
    return <div className="admin-loading">Cargando...</div>;
  }

  return (
    <div className="admin-categories">
      <div className="admin-header">
        <h1>Gestión de Categorías</h1>
        <button 
          className="btn-add-category"
          onClick={handleOpenCreateModal}
        >
          + Nueva Categoría
        </button>
      </div>

      <div className="categories-list">
        <h2>Categorías Existentes ({categories.length})</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {categories.length === 0 ? (
          <p className="no-categories">No hay categorías registradas</p>
        ) : (
          <div className="categories-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Icono</th>
                  <th>Orden</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id_categoria}>
                    <td>{category.id_categoria}</td>
                    <td className="category-name">{category.nombre_categoria}</td>
                    <td className="category-desc">
                      {category.descripcion || '-'}
                    </td>
                    <td>
                      {category.icono_url ? (
                        <img 
                          src={category.icono_url} 
                          alt={category.nombre_categoria}
                          className="category-icon-preview"
                        />
                      ) : '-'}
                    </td>
                    <td>{category.orden_visualizacion}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenEditModal(category)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleOpenDeleteModal(category)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                  <label htmlFor="nombre_categoria">Nombre de la Categoría *</label>
                  <input
                    type="text"
                    id="nombre_categoria"
                    name="nombre_categoria"
                    value={formData.nombre_categoria}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Plomería, Electricidad, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Descripción de la categoría (opcional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="icono_url">URL del Icono</label>
                  <input
                    type="url"
                    id="icono_url"
                    name="icono_url"
                    value={formData.icono_url}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/icono.png"
                  />
                  {formData.icono_url && (
                    <div className="icon-preview-container">
                      <img src={formData.icono_url} alt="Preview" />
                      <p>Vista previa del icono</p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="orden_visualizacion">Orden de Visualización</label>
                  <input
                    type="number"
                    id="orden_visualizacion"
                    name="orden_visualizacion"
                    value={formData.orden_visualizacion}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>

                {formError && (
                  <div className="form-error">{formError}</div>
                )}

                {formSuccess && (
                  <div className="form-success">
                    {editingCategory ? '¡Categoría actualizada exitosamente!' : '¡Categoría creada exitosamente!'}
                  </div>
                )}
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit" onClick={handleSubmit}>
                {editingCategory ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && categoryToDelete && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
              <button className="modal-close" onClick={handleCloseDeleteModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="confirm-modal-body">
              <div className="confirm-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg></div>
              <h3>¿Estás seguro?</h3>
              <p>
                Estás a punto de eliminar la categoría{' '}
                <span className="category-name-highlight">
                  "{categoryToDelete.nombre_categoria}"
                </span>
              </p>
              <p>Esta acción no se puede deshacer.</p>
            </div>

            <div className="confirm-modal-footer">
              <button 
                type="button" 
                className="btn-confirm-cancel" 
                onClick={handleCloseDeleteModal}
                disabled={deletingCategory}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-confirm-delete" 
                onClick={handleConfirmDelete}
                disabled={deletingCategory}
              >
                {deletingCategory ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
