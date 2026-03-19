import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/EditarFotoModal.css';

function EditarFotoModal({ isOpen, onClose, currentPhoto, onSave }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      // Llamar a la función de guardado pasada por props
      const result = await onSave(selectedFile);
      
      if (result?.success) {
        handleClose();
      } else {
        alert(result?.error || 'Error al subir la foto');
      }
    } catch (error) {
      console.error('Error al subir la foto:', error);
      alert('Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsDragging(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cambiar foto de perfil</h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {preview || currentPhoto ? (
            <div className="photo-preview-container">
              <img 
                src={preview || currentPhoto} 
                alt="Preview" 
                className="photo-preview-large"
              />
              {!preview && (
                <p className="preview-label">Foto actual</p>
              )}
            </div>
          ) : null}

          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📷</div>
            <p className="upload-text">
              {selectedFile 
                ? `Archivo seleccionado: ${selectedFile.name}` 
                : 'Arrastra una imagen aquí o haz clic para seleccionar'}
            </p>
            <p className="upload-hint">PNG, JPG o JPEG (máx. 5MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-modal-cancel" 
            onClick={handleClose}
            disabled={uploading}
          >
            Cancelar
          </button>
          <button 
            className="btn-modal-save" 
            onClick={handleSave}
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

EditarFotoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentPhoto: PropTypes.string,
  onSave: PropTypes.func.isRequired
};

export default EditarFotoModal;
