import "../assets/styles/Service_publication_form.css"
import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import { useAuth } from 'react-oidc-context';
import servicePublicationService from '../services/servicePublicationService';
 
 
function PublicarServicio() {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(false);
   
    const auth = useAuth();
    if (auth.isLoading) {
    return <p>Cargando autenticación...</p>;
    }
 
    if (!auth.isAuthenticated || !auth.user || !auth.user.profile) {
    return <p>No has iniciado sesión. Por favor inicia sesión para publicar un servicio.</p>;
    }
 
    const userEmail = auth.user.profile.email || '';
 
     //Cargar categorías existentes
 
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll();
                setCategories(data);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
            } finally {
                setLoadingCategories(false);
            }
        };
 
        fetchCategories();
 
    }, []); // El array vacío asegura que se ejecuta solo una vez al montar
 
 
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const fotosActuales = fotos.length;
        const espacioDisponible = 10 - fotosActuales;
       
        // Validar que no exceda el límite de 10 fotos
        if (fotosActuales >= 10) {
            alert('Ya alcanzaste el límite de 10 fotos');
            return;
        }
       
        // Validar tamaño (5MB por archivo)
        const archivosValidos = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} excede el tamaño máximo de 5MB`);
                return false;
            }
            return true;
        });
       
        // Tomar las fotos que caben dentro del límite
        const fotosAgregar = archivosValidos.slice(0, espacioDisponible);
       
        if (archivosValidos.length > espacioDisponible) {
            alert(`Solo se pueden agregar ${espacioDisponible} foto(s) más. Límite: 10 fotos`);
        }
       
        setFotos([...fotos, ...fotosAgregar]);
       
        e.target.value = '';
    };
 
    // Manejo de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
 
        if (!auth?.user?.profile?.email) {
            alert("Error: El usuario no está autenticado o el email no se pudo extraer.");
            return;
        }
 
        if (selectedCategory === '' || fotos.length === 0) {
            alert("Por favor, selecciona una categoría y al menos una foto.");
            return;
        }
 
        setLoading(true); // Inicia el estado de carga
 
        try {
            // Crear el FormData
            const formData = new FormData();
            formData.append("user_email", auth.user.profile.email);
            formData.append("titulo", titulo);
            formData.append("id_categoria", String(selectedCategory));
            formData.append("descripcion", descripcion);
            formData.append("rango_precio_min", String(minPrice));
            formData.append("rango_precio_max", String(maxPrice));
 
            // Adjuntar fotos
            fotos.forEach((file) => {
            formData.append("fotos", file);
            });
 
            // Llamada al servicio
            const response = await servicePublicationService.createPublication(formData);
 
            // Mostrar mensaje inmediato
            alert(`Servicio "${response.titulo}" publicado con éxito.`);
 
            // Resetear campos
            setTitulo("");
            setDescripcion("");
            setSelectedCategory("");
            setMinPrice("");
            setMaxPrice("");
            setFotos([]);
 
        } catch (error) {
            console.error("Error al crear la publicación:", error);
 
            let errorMessage = "Error desconocido.";
            if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
            const validationErrors = error.response.data.detail
                .map((err) => `${err.loc.join('.')}: ${err.msg}`)
                .join('\n');
            errorMessage = "Error de Validación (422):\n" + validationErrors;
            } else if (error.message) {
            errorMessage = error.message;
            }
 
            alert(`Fallo de envío:\n${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
   
    const handleMinRangeChange = (e) => {
        const value = e.target.value;
        setMinPrice(value);
    };
 
    const handleMaxRangeChange = (e) => {
        const value = e.target.value;
        setMaxPrice(value);
    };
 
    const validateMinPrice = () => {
        if (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice)) {
            alert('El precio mínimo no puede ser mayor al precio máximo');
            setMinPrice(maxPrice);
        }
    };
 
    const validateMaxPrice = () => {
        if (minPrice !== '' && maxPrice !== '' && Number(maxPrice) < Number(minPrice)) {
            alert('El precio máximo no puede ser menor al precio mínimo');
            setMaxPrice(minPrice);
        }
    };
 
    return (
    <div className="form-container">
        <h2 className="form-title">Publica tu servicio</h2>
        <form onSubmit={handleSubmit}>
           
            {/* Título */}
            <div className="form-group">
                <label htmlFor="titulo">Título <span className="required-star">*</span></label>
                <input type="text" id="titulo" placeholder="Título del servicio" value={titulo}
                    onChange={(e) => setTitulo(e.target.value)} required />
            </div>
           
            {/* Categoría */}
            <div className="form-group">
                <label htmlFor="categoria">
                    Categoría a la que pertenece el servicio <span className="required-star">*</span>
                </label>
                <div className="custom-select-wrapper">
                    <select id="categoria" required value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)} >
                        <option value="" disabled>Seleccione una opción</option>
                        {categories.map((category) => (
                            <option
                                key={category.id_categoria}
                                value={category.id_categoria}
                            >
                                {category.nombre_categoria}
                            </option>
                        ))}
                    </select>
 
                    <span className="select-icon">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            </div>
           
            {/* Descripción*/}
            <div className="form-group">
                <label htmlFor="descripcion">Descripción del servicio <span className="required-star">*</span></label>
                <textarea
                    id="descripcion"
                    rows="4"
                    placeholder="Ingrese la descripción del servicio"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required>
                </textarea>
            </div>
           
            {/* Subir Fotos */}
   
            <div className="form-group">
                <label htmlFor="foto">Agregar fotos de referencia
                    {fotos.length > 0 &&
                    <span style={{ marginLeft: '10px', color: '#16394f', fontWeight: 'bold' }}>
                        ({fotos.length} seleccionada{fotos.length > 1 ? 's' : ''})
                    </span>
                    }
                    <span className="required-star">*</span>
                </label>
               
                <div className="file-upload-box">
                    <input type="file" id="fotos" multiple accept="image/jpeg, image/png" style={{ display: 'none' }}
                        required onChange={handleFileChange} disabled={fotos.length >= 10}
                    />
                    <label htmlFor="fotos" className={`file-upload-label ${fotos.length >= 10 ? 'disabled' : ''}`}>
                        <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.05469 16.9912C3.05469 17.4114 3.11752 17.8317 3.2666 18.3311L3.30957 18.4727C3.94163 20.3584 5.682 21.625 7.63867 21.625H25.3818L24.2812 25.165C23.9695 26.3688 22.8568 27.1864 21.6396 27.1865C21.4021 27.1863 21.1654 27.1552 20.9355 27.0947L2.03516 21.9775C0.57738 21.5708 -0.291362 20.0449 0.0898438 18.5732L3.05469 8.56641V16.9912ZM26.2773 0C27.9617 0 29.333 1.38703 29.333 3.08984V16.6826C29.333 18.3855 27.9617 19.7725 26.2773 19.7725H7.94434C6.26027 19.7725 4.88869 18.3855 4.88867 16.6826V3.08984C4.88871 1.38703 6.26029 0 7.94434 0H26.2773ZM7.94434 2.47168C7.60711 2.47168 7.33302 2.74868 7.33301 3.08984V14.7539L10.7061 11.3447C11.5409 10.4996 12.9014 10.4996 13.7373 11.3447L15.2168 12.8359L19.7559 7.32715C20.1616 6.83528 20.7556 6.55147 21.3887 6.54785C22.0254 6.56251 22.6187 6.82204 23.0283 7.30762L26.8887 11.8623V3.08984C26.8886 2.74871 26.6148 2.47168 26.2773 2.47168H7.94434ZM11 3.70703C12.348 3.70718 13.4442 4.81589 13.4443 6.17871C13.4443 7.54163 12.3481 8.65024 11 8.65039C9.65184 8.65039 8.55469 7.54166 8.55469 6.17871C8.5548 4.81585 9.65185 3.70703 11 3.70703Z" fill="#A3A3A3"/>
                        </svg>
 
                        <p><b>Haz click </b>para subir fotos</p>
                        {fotos.length >= 10 ? (
                            <small style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                Límite alcanzado (10/10 fotos)
                            </small>
                        ) : (
                            <small>JPG, PNG hasta 5MB (máximo 10 fotos)</small>
                        )}
                    </label>
                </div>
 
                {/* Preview de las fotos seleccionadas */}
                {fotos.length > 0 && (
                    <div className="photo-previews-container">
                        <div className="photo-previews-grid">
                            {fotos.map((foto, index) => (
                                <div key={index} className="photo-preview-card">
                                    <img src={URL.createObjectURL(foto)} alt={`Preview ${index + 1}`} className="photo-preview-image"/>
                                    <div className="photo-preview-info">
                                        <div className="photo-preview-name" title={foto.name}>{foto.name}</div>
                                        <div className="photo-preview-size">{(foto.size / 1024).toFixed(1)} KB
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => { const newFotos = fotos.filter((_, i) => i !== index);
                                            setFotos(newFotos);}} className="photo-preview-delete"
                                            title="Eliminar foto"> × </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
 
            {/* Rango de precio*/}
            <div className="form-group">
                <label htmlFor="rangoPrecio">Rango de precio por hora (Opcional)</label>
                <div className="price-range">
                    {/* Input Mínimo (Min) */}
                    <input type="number" value={minPrice} onChange={handleMinRangeChange} onBlur={validateMinPrice}
                        className="price-input min" placeholder="Min $" min="0"/>
                    <div className="separator"></div>
                    {/* Input Máximo (Max) */}
                    <input type="number" value={maxPrice} onChange={handleMaxRangeChange} onBlur={validateMaxPrice}
                        className="price-input max" placeholder="Max $" min="0"/>
                </div>
            </div>
           
            {/* Publicar */}
            <button onClick={handleSubmit} className="submit-button" type="button"> {loading ? "Publicando..." : "Publicar"}</button>
        </form>
    </div>
    );
 
};
export default PublicarServicio;