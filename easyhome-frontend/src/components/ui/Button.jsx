import PropTypes from 'prop-types';
import './Button.css';

/**
 * Componente Button reutilizable
 * 
 * @param {string} variant - Estilo del botón: 'primary', 'secondary', 'success', 'danger', 'outline'
 * @param {string} size - Tamaño del botón: 'small', 'medium', 'large'
 * @param {boolean} fullWidth - Si el botón debe ocupar todo el ancho
 * @param {function} onClick - Función a ejecutar al hacer click
 * @param {ReactNode} children - Contenido del botón
 * @param {string} type - Tipo de botón HTML: 'button', 'submit', 'reset'
 * @param {boolean} disabled - Si el botón está deshabilitado
 */
function Button({ 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const classNames = [
    'ui-button',
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth ? 'ui-button--full-width' : '',
    disabled ? 'ui-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
