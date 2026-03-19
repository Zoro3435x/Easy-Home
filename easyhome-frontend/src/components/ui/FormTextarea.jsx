import PropTypes from 'prop-types';
import './FormTextarea.css';

/**
 * Componente reutilizable de textarea para formularios
 */
const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className = '',
  helpText,
  ...rest
}) => {
  const charCount = value?.length || 0;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-textarea"
        required={required}
        rows={rows}
        maxLength={maxLength}
        {...rest}
      />
      <div className="textarea-footer">
        {helpText && <p className="help-text">{helpText}</p>}
        {showCharCount && maxLength && (
          <p className="char-count">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

FormTextarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCharCount: PropTypes.bool,
  className: PropTypes.string,
  helpText: PropTypes.string,
};

export default FormTextarea;
