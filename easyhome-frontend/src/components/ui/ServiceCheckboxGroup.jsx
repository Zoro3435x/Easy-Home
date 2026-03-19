import PropTypes from 'prop-types';
import ServiceCheckbox from './ServiceCheckbox';
import './ServiceCheckboxGroup.css';

/**
 * Componente contenedor para un grupo de checkboxes de servicios
 */
const ServiceCheckboxGroup = ({
  label,
  helpText,
  required = false,
  options = [],
  selectedValues = [],
  onChange,
  loading = false,
  error = null,
  columns = 'auto',
  className = '',
}) => {
  const handleCheckboxChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`service-checkbox-group ${className}`}>
      {label && (
        <label className="service-group-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      {helpText && <p className="service-group-help">{helpText}</p>}
      
      {loading ? (
        <div className="service-group-loading">
          <p>Cargando servicios...</p>
        </div>
      ) : error ? (
        <div className="service-group-error">
          <p>Error al cargar servicios: {error}</p>
          <p className="error-detail">
            Verifica que el backend esté corriendo y que el endpoint esté disponible.
          </p>
        </div>
      ) : options.length > 0 ? (
        <div 
          className="service-checkboxes-grid"
          style={{
            gridTemplateColumns: columns === 'auto' 
              ? 'repeat(auto-fill, minmax(200px, 1fr))' 
              : `repeat(${columns}, 1fr)`
          }}
        >
          {options.map((option) => (
            <ServiceCheckbox
              key={option.id}
              id={`service-${option.id}`}
              name={`service-${option.id}`}
              value={option.value}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
            />
          ))}
        </div>
      ) : (
        <div className="service-group-empty">
          <p>No hay servicios disponibles. Por favor contacta al administrador.</p>
        </div>
      )}
    </div>
  );
};

ServiceCheckboxGroup.propTypes = {
  label: PropTypes.string,
  helpText: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  columns: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

export default ServiceCheckboxGroup;
