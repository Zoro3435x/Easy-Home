import PropTypes from 'prop-types';
import './FormInput.css';

/**
 * Componente reutilizable de input para formularios
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
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
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="form-input"
        required={required}
        {...rest}
      />
      {helpText && <p className="help-text">{helpText}</p>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  helpText: PropTypes.string,
};

export default FormInput;
