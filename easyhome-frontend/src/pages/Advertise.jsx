import React from 'react';
import FAQSection from '../components/features/FAQSection'
import "../assets/styles/FAQSection.css"
import "../assets/styles/advertise.css"
 
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"
      fill="#4caf50" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698
      .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27
      .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698
      .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2
      1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698
      -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2
      1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698
      -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182
      -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697
      7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2
      2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
    </svg>
  );
}
 
function CircleXIcon({ size = 24, color = "#dc3545", className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color} className={`icon icon-tabler icons-tabler-filled icon-tabler-circle-x ${className}`}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z"/>
    </svg>
  );
}
 
 
function Advertise() {
    return (
        <section className="pricing-section">
            <h1 className="pricing-title">¡Muestra tu marca en EasyHome!</h1>
            <p className="pricing-subtitle">
                ¿Buscas darle mayor visibilidad a tu empresa y tu público se relaciona con los Servicios del Hogar? <br />Llegaste al lugar indicado.
            </p>
 
            <div className="pricing-cards-container">
 
                {/* Plan Básico */}
                <div className="pricing-card">
                    <div className="card-header">Rotatorio</div>
                    <div className="card-separator"></div>
                    <div className="card-price">$29.99 USD</div>
                    <ul className="card-features">
                        <li><CheckIcon /> Banner rotatorio</li>
                        <li><CheckIcon /> Posicionado en el centro del sitio</li>
                        <li><CircleXIcon /> Compartido con otros anunciantes</li>
                       
                    </ul>
                    <button className="card-button">Comenzar Ahora</button>
                </div>
 
                {/* Plan Esencial */}
                <div className="pricing-card">
                    <div className="card-header">Lateral</div>
                    <div className="card-separator"></div>
                    <div className="card-price">$39.99 USD/mes</div>
                    <ul className="card-features">
                        <li><CheckIcon /> Banner lateral</li>
                        <li><CheckIcon /> Los clientes no dejarán de ver su marca</li>
                        <li><CheckIcon /> Espacio exclusivo para usted</li>
                    </ul>
                    <button className="card-button">Comenzar Ahora</button>
                </div>
 
                {/* Plan Premium */}
                <div className="pricing-card">
                    <div className="card-header">Superior</div>
                    <div className="card-separator"></div>
                    <div className="card-price">$49.99 USD/mes</div>
                    <ul className="card-features">
                        <li><CheckIcon /> Banner superior</li>
                        <li><CheckIcon /> Los clientes no dejarán de ver su marca</li>
                        <li><CheckIcon /> Espacio exclusivo para usted</li>
                        <li><CheckIcon /> Nivel más alto de visibilidad en el sitio</li>
                        <li><CheckIcon /> El banner más grande de la plataforma</li>
                    </ul>
                    <button className="card-button">Comenzar Ahora</button>
                </div>
            </div>
 
            <br />
            <h1 className="comparison-title">Compara todos los planes</h1>
            <br />
 
            {/* --- TABLA DE COMPARACIÓN --- */}
            <div className="comparison-table">
                <div className="compare-column features-column">
                    <h2>Características</h2>
                    <ul className="compare-feature-labels">
                        <li>Banner publicitario</li>
                        <li>Espacio exclusivo</li>
                        <li>Nivel más alto de visibilidad</li>
                        <li>Banner de mayor tamaño</li>
                    </ul>
                </div>
                <div className="compare-column compare-plan-column">
                    <div className="compare-header">
                        <h3>Estándar</h3>
                        <button className="compare-cta-button">Comenzar ahora</button>
                        <p className="compare-description">La opción más accesible para mostrar tu marca.</p>
                    </div>
                    <ul className="compare-features-list">
                        <li><CheckIcon /></li>
                        <li><CircleXIcon /></li>
                        <li><CircleXIcon /></li>
                        <li><CircleXIcon /></li>
                    </ul>
                </div>
                <div className="compare-column compare-plan-column">
                    <div className="compare-header">
                        <h3>Lateral</h3>
                        <button className="compare-cta-button">Comenzar ahora</button>
                        <p className="compare-description">Sólida publicidad para tu empresa.</p>
                    </div>
                    <ul className="compare-features-list">
                        <li><CheckIcon /></li>
                        <li><CheckIcon /></li>
                        <li><CircleXIcon /></li>
                        <li><CircleXIcon /></li>
                    </ul>
                </div>
                <div className="compare-column compare-plan-column">
                    <div className="compare-header">
                        <h3>Premium</h3>
                        <button className="compare-cta-button">Comenzar ahora</button>
                        <p className="compare-description">Convierte tu compañía en el centro de atención.</p>
                    </div>
                    <ul className="compare-features-list">
                        <li><CheckIcon /></li>
                        <li><CheckIcon /></li>
                        <li><CheckIcon /></li>
                        <li><CheckIcon /></li>
                    </ul>
                </div>
            </div>
 
            <FAQSection />
        </section>
    );
}
 
export default Advertise;