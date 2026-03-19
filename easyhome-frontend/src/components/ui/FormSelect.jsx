import PropTypes from 'prop-types';
import './FormSelect.css';

/**
 * Componente reutilizable de select para formularios
 */
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  className = '',
  helpText,
  ...rest
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
        required={required}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <p className="help-text">{helpText}</p>}
    </div>
  );
};

FormSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
  helpText: PropTypes.string,
};

export default FormSelect;
