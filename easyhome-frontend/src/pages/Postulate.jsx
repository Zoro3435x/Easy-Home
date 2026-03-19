import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Button, FormInput, FormSelect, FormTextarea, ServiceCheckboxGroup } from '../components/ui';
import usePostulacion from '../hooks/usePostulacion';
import categoryService from '../services/categoryService';
import '../assets/styles/postulate.css';

const Postulate = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { crearPostulacion, loading, error, success } = usePostulacion();

  // Estados del formulario
  const [formData, setFormData] = useState({
    curp: '',
    direccion: '',
    anios_experiencia: '',
    descripcion_servicios: '',
    servicios_ofrece: [], // Array de nombres de servicios (no IDs)
    fotos: [], // Array de archivos
  });

  // Estados para categorías/servicios
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState(null);
  
  // Estado para previsualización de imágenes (ahora múltiples)
  const [imagePreviews, setImagePreviews] = useState([]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoryService.getAll();
        
        // Verificar si data es un array
        if (Array.isArray(data)) {
          setCategorias(data);
          setErrorCategorias(null);
        } else {
          console.error('Los datos recibidos no son un array:', data);
          setErrorCategorias('Formato de datos inválido');
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setErrorCategorias(err.message || 'Error al cargar las categorías');
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  // Opciones de años de experiencia (valores numéricos)
  const experienciaOptions = [
    { value: '', label: 'Selecciona una opción' },
    { value: 1, label: 'Menos de un año' },
    { value: 3, label: '1 a 3 años' },
    { value: 5, label: '3 a 5 años' },
    { value: 10, label: '5 a 10 años' },
    { value: 15, label: 'Más de 10 años' },
  ];

  // Manejar cambios en inputs de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar selección de servicios (checkboxes) - Ahora guarda nombres
  const handleServicioToggle = (categoriaNombre) => {
    setFormData(prev => {
      const serviciosActuales = prev.servicios_ofrece;
      const yaSeleccionado = serviciosActuales.includes(categoriaNombre);
      
      const nuevosServicios = yaSeleccionado
        ? serviciosActuales.filter(nombre => nombre !== categoriaNombre)
        : [...serviciosActuales, categoriaNombre];
      
      return {
        ...prev,
        servicios_ofrece: nuevosServicios,
      };
    });
  };

  // Manejar carga de imágenes (múltiples)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validar cada archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB por imagen
    
    const validFiles = [];
    const previews = [];

    for (const file of files) {
      // Validar tipo
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}: Por favor selecciona una imagen válida (JPG, PNG o WEBP)`);
        continue;
      }

      // Validar tamaño
      if (file.size > maxSize) {
        alert(`${file.name}: La imagen no debe superar los 5MB`);
        continue;
      }

      validFiles.push(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({ file: file.name, url: reader.result });
        if (previews.length === validFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    }

    setFormData(prev => ({
      ...prev,
      fotos: validFiles,
    }));
  };

  // Eliminar una foto específica
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.curp.trim()) {
      alert('El CURP es obligatorio');
      return false;
    }

    // Validar formato CURP (18 caracteres)
    if (formData.curp.length !== 18) {
      alert('El CURP debe tener 18 caracteres');
      return false;
    }

    if (!formData.direccion.trim()) {
      alert('La dirección es obligatoria');
      return false;
    }

    if (!formData.anios_experiencia) {
      alert('Por favor selecciona tus años de experiencia');
      return false;
    }

    if (!formData.descripcion_servicios.trim()) {
      alert('Por favor describe los servicios que ofreces');
      return false;
    }

    if (formData.servicios_ofrece.length === 0) {
      alert('Por favor selecciona al menos un servicio');
      return false;
    }

    if (formData.fotos.length === 0) {
      alert('Por favor sube al menos una evidencia fotográfica de tu trabajo');
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Preparar datos para enviar
      const postulacionData = {
        ...formData,
        user_email: auth.user?.profile?.email || auth.user?.email,
        nombre_completo: auth.user?.profile?.name || auth.user?.name || '',
      };
      
      await crearPostulacion(postulacionData);
      alert('¡Postulación enviada exitosamente! Te contactaremos pronto.');
      navigate('/');
    } catch (err) {
      console.error('Error al enviar postulación:', err);
      alert('Error al enviar la postulación. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="postulate-container">
      <div className="postulate-wrapper">
        <h1 className="postulate-title">Información de postulación</h1>

        <form onSubmit={handleSubmit} className="postulate-form">
          {/* Sección: Información Personal */}
          <section className="form-section">
            <h2 className="section-title">Información Personal</h2>

            <div className="form-row">
              <FormInput
                label="CURP"
                name="curp"
                type="text"
                value={formData.curp}
                onChange={handleInputChange}
                placeholder="CURP"
                maxLength={18}
                required
              />

              <FormInput
                label="Dirección"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Calle, Núm ext..."
                required
              />
            </div>
          </section>

          {/* Sección: Información Profesional */}
          <section className="form-section">
            <h2 className="section-title">Información Profesional</h2>

            <div className="form-row">
              <FormSelect
                label="Años de experiencia"
                name="anios_experiencia"
                value={formData.anios_experiencia}
                onChange={handleInputChange}
                options={experienciaOptions}
                required
              />

              <FormTextarea
                label="Descripción de tus servicios"
                name="descripcion_servicios"
                value={formData.descripcion_servicios}
                onChange={handleInputChange}
                placeholder="Escribe las habilidades, especialidades y qué te hace preferible frente a otros competidores..."
                rows={4}
                required
              />
            </div>

            <ServiceCheckboxGroup
              label="Servicios que ofreces"
              helpText="Selecciona todos los que apliquen"
              required={true}
              options={categorias.map((categoria) => ({
                id: categoria.id_categoria || categoria.id,
                value: categoria.nombre_categoria || categoria.nombre || categoria.name || 'Sin nombre',
                label: categoria.nombre_categoria || categoria.nombre || categoria.name || 'Sin nombre',
              }))}
              selectedValues={formData.servicios_ofrece}
              onChange={handleServicioToggle}
              loading={loadingCategorias}
              error={errorCategorias}
              columns="auto"
            />
          </section>

          {/* Sección: Evidencia Fotográfica */}
          <section className="form-section">
            <h2 className="section-title">Evidencia Fotográfica</h2>

            <div className="upload-area">
              <input
                type="file"
                id="evidencia_fotografica"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="file-input"
                multiple
                required
              />
              
              {imagePreviews.length === 0 ? (
                <label htmlFor="evidencia_fotografica" className="upload-label">
                  <div className="upload-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="upload-text">Muestra tus trabajos</p>
                  <p className="upload-subtext">JPG, JPEG, PNG (máx 5MB por imagen, múltiples imágenes)</p>
                </label>
              ) : (
                <div className="images-preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview.url} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label htmlFor="evidencia_fotografica" className="add-more-btn">
                    + Agregar más
                  </label>
                </div>
              )}
            </div>
          </section>

          {/* Mensajes de error o éxito */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              ¡Postulación enviada exitosamente!
            </div>
          )}

          {/* Botón de envío */}
          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Enviando...' : 'Enviar solicitud de verificación'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Postulate;
