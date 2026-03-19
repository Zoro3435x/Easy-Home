import PropTypes from 'prop-types';
import './ServiceCheckbox.css';

/**
 * Componente reutilizable para selección de servicios/categorías
 * Funciona como un botón de selección sin checkbox visible
 */
const ServiceCheckbox = ({
  id,
  name,
  value,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange();
    }
  };

  const handleKeyPress = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <div
      className={`service-checkbox ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={checked}
      aria-label={label}
    >
      {/* Input oculto para mantener compatibilidad con formularios */}
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => {}} // Manejado por el div padre
        disabled={disabled}
        className="service-checkbox-input-hidden"
        tabIndex={-1}
      />
      <span className="service-checkbox-label">
        {label}
      </span>
      {checked && (
        <span className="service-checkbox-icon" aria-hidden="true">
          ✓
        </span>
      )}
    </div>
  );
};

ServiceCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ServiceCheckbox;
