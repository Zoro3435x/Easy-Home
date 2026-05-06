import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormInput } from '../../components/ui';
import '../../assets/styles/CambiarDatos.css';

function CambiarDatos({ userData, splitName, calculateAge }) {
  const { nombres: nombresIniciales, apellidos: apellidosIniciales } = splitName(userData.nombre);
  const edadCalculada = calculateAge(userData.fecha_nacimiento);

  const [formData, setFormData] = useState({
    nombres: nombresIniciales,
    apellidos: apellidosIniciales,
    edad: edadCalculada || '',
    telefono: userData.numero_telefono || '',
    email: userData.correo_electronico || ''
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const { nombres, apellidos } = splitName(userData.nombre);
    setFormData(prev => ({
      ...prev,
      nombres,
      apellidos,
      edad: calculateAge(userData.fecha_nacimiento) || '',
      telefono: userData.numero_telefono || '',
      email: userData.correo_electronico || ''
    }));
  }, [userData, splitName, calculateAge]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);

    try {
      // Aquí iría la lógica para actualizar el backend
      // Por ahora solo simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMensaje({ type: 'success', text: 'Datos actualizados correctamente' });
      setModoEdicion(false); // Volver a modo lectura después de guardar
    } catch (error) {
      setMensaje({ type: 'error', text: 'Error al guardar los datos' });
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = () => {
    setModoEdicion(true);
    setMensaje(null);
  };

  const handleCancelar = () => {
    // Restaurar los valores originales
    const { nombres, apellidos } = splitName(userData.nombre);
    setFormData({
      nombres,
      apellidos,
      edad: calculateAge(userData.fecha_nacimiento) || '',
      telefono: userData.numero_telefono || '',
      email: userData.correo_electronico || ''
    });
    setModoEdicion(false);
    setMensaje(null);
  };

  const handleCambiarContrasena = () => {
    // Aquí iría la lógica para cambiar contraseña
    alert('Funcionalidad de cambiar contraseña próximamente');
  };

  return (
    <div className="cambiar-datos-container">
      <h2>Datos Personales</h2>

      {mensaje && (
        <div className={`mensaje ${mensaje.type}`}>
          {mensaje.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="datos-form">
        <div className="form-row">
          {modoEdicion ? (
            <FormInput
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              placeholder="Pon aquí tus nombres..."
              required
            />
          ) : (
            <div className="form-group">
              <label>Nombres</label>
              <div className="field-value">{formData.nombres || 'No especificado'}</div>
            </div>
          )}

          {modoEdicion ? (
            <FormInput
              label="Apellido"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              placeholder="Pon aquí tu apellido..."
            />
          ) : (
            <div className="form-group">
              <label>Apellido</label>
              <div className="field-value">{formData.apellidos || 'No especificado'}</div>
            </div>
          )}

          {modoEdicion ? (
            <FormInput
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleInputChange}
              placeholder="Pon aquí tu edad..."
              min="18"
              max="120"
            />
          ) : (
            <div className="form-group">
              <label>Edad</label>
              <div className="field-value">{formData.edad || 'No especificado'} años</div>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group form-group-password">
            <label htmlFor="contrasena">Contraseña</label>
            <div className="password-field">
              <button
                type="button"
                className="btn-cambiar-contrasena"
                onClick={handleCambiarContrasena}
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          {modoEdicion ? (
            <>
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelar}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-guardar" disabled={guardando}>
                {guardando ? 'Guardando...' : 'GUARDAR'}
                <i className="icon">💾</i>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-editar"
              onClick={handleEditar}
            >
              Editar
              <i className="icon">✏️</i>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

CambiarDatos.propTypes = {
  userData: PropTypes.object.isRequired,
  splitName: PropTypes.func.isRequired,
  calculateAge: PropTypes.func.isRequired
};

export default CambiarDatos;
