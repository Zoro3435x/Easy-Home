import React, { useState } from 'react';
import "../assets/styles/Subscriptions.css"
 
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
 
 
// Iconos de Preguntas Frecuentes
 
function ExchangeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-icon">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 3l4 4l-4 4" /><path d="M10 7l10 0" /><path d="M8 13l-4 4l4 4" /><path d="M4 17l9 0" />
        </svg>
    );
}
 
function ReceiptIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-receipt-dollar">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2
          -2l-2 2l-2 -2l-3 2" /><path d="M14.8 8a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
          <path d="M12 6v10" /></svg>
    );
}
 
function TaxIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-tax">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.487 21h7.026a4 4 0 0 0 3.808 -5.224l-1.706 -5.306a5 5 0 0 0
          -4.76 -3.47h-1.71a5 5 0 0 0 -4.76 3.47l-1.706 5.306a4 4 0 0 0 3.808 5.224" /><path d="M15 3q -1 4 -3 4t -3 -4z" />
          <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" /><path d="M12 10v1" /><path d="M12 17v1" /></svg>
    );
}
 
 
function CancelIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline
        icon-tabler-cancel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M18.364 5.636l-12.728 12.728" /></svg>
    );
}
 
function FAQSection() {
  // Lista de preguntas y respuestas
  const faqData = [
    {
      id: 1,
      icon: <ExchangeIcon />,
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer: 'Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu panel de control. Los cambios se aplicarán en el siguiente ciclo de facturación.'
    },
    {
      id: 2,
      icon: <ReceiptIcon />,
      question: '¿Cómo funciona la facturación?',
      answer: 'La facturación es mensual y se realiza automáticamente a tu método de pago registrado el día que te suscribiste.'
    },
    {
      id: 3,
      icon: <TaxIcon />,
      question: '¿Existen costos ocultos o cargos adicionales?',
      answer: 'No, todos nuestros planes son transparentes. El precio mensual indicado es el costo total que pagarás, sin cargos ocultos.'
    },
    {
      id: 4,
      icon: <CancelIcon />,
      question: '¿Puedo cancelar mi plan cuando quiera?',
      answer: 'Sí, puedes cancelar tu suscripción sin penalizaciones en cualquier momento. La cancelación será efectiva al final de tu ciclo de facturación actual.'
    },
  ];
 
  // Estado para controlar qué pregunta está abierta
  const [activeIndex, setActiveIndex] = useState(null);
 
  const toggleFAQ = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };
 
  return (
    <section className="faq-section">
      <h2 className="faq-title">Preguntas Frecuentes</h2>
     
      <div className="faq-accordion">
        {faqData.map((item) => (
          <div key={item.id} className={`faq-item ${activeIndex === item.id ? 'active' : ''}`}>
           
            {/* Cabecera de la Pregunta */}
            <button
              className="faq-question-header"
              onClick={() => toggleFAQ(item.id)}
            >
              <span className="faq-icon">{item.icon}</span>
              <span className="faq-question-text">{item.question}</span>
              <span className="faq-arrow">
                {/* Ícono de la flecha rotatoria */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </button>
           
            {/* Contenido de la Respuesta (Se despliega/pliega) */}
            <div className="faq-answer-content">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
 
function Subscriptions() {
 
  const [openIndex, setOpenIndex] = useState(null);
 
    const togglePanel = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
 
  return (
    <div className="subscriptions-page">
 
      {/* Seccion planes de suscripción */}
      <br /><br />
      <h1>Encuentra el Plan Perfecto para Ti</h1>
      <p>Selecciona uno y obtén sus beneficios</p>
      <br /><br />
      <div className="pricing-cards-container">
        {/* Plan Básico */}
        <div className="pricing-card">
            <div className="card-header">Básico</div>
            <div className="card-separator"></div>
            <div className="card-price">Gratis</div>
            <ul className="card-features">
                <li><CheckIcon /> 1 publicación semanal</li>
                <li><CheckIcon /> Acceso a la comunidad</li>
                <li><CircleXIcon /> Publicaciones ilimitadas</li>
                <li><CircleXIcon /> Mayor visualización en búsquedas</li>
                <li><CircleXIcon /> Acceso a reportes de demanda</li>
            </ul>
            <button className="card-button">Comenzar Ahora</button>
        </div>
 
        {/* Plan Esencial */}
        <div className="pricing-card">
            <div className="card-header">Esencial</div>
            <div className="card-separator"></div>
            <div className="card-price">$7.50 USD/mes</div>
            <ul className="card-features">
                <li><CheckIcon /> Publicaciones ilimitadas</li>
                <li><CheckIcon /> Acceso a la comunidad</li>
                <li><CircleXIcon /> Mayor visualización en búsquedas</li>
                <li><CircleXIcon /> Acceso a reportes de demanda</li>
            </ul>
            <button className="card-button">Comenzar Ahora</button>
        </div>
 
        {/* Plan Premium */}
        <div className="pricing-card">
            <div className="card-header">Premium</div>
            <div className="card-separator"></div>
            <div className="card-price">$15.00 USD/mes</div>
            <ul className="card-features">
                <li><CheckIcon /> Publicaciones ilimitadas</li>
                <li><CheckIcon /> Acceso a la comunidad</li>
                <li><CheckIcon /> Mayor visualización en búsquedas</li>
                <li><CheckIcon /> Acceso a reportes de demanda</li>
            </ul>
            <button className="card-button">Comenzar Ahora</button>
        </div>
      </div>
 
      <br />
      <h1 className="comparison-title">Compara todos los planes</h1>
      <br />
      <div className="comparison-table">
       
        {/* Columna de Características */}
        <div className="compare-column features-column">
          <h2>Características</h2>
          <ul className="compare-feature-labels">
            <li>Acceso a la comunidad</li>
            <li>Publicaciones ilimitadas</li>
            <li>Mayor visualización en búsquedas</li>
            <li>Acceso a reportes de demanda</li>
          </ul>
        </div>
 
        {/* Columna Básico */}
        <div className="compare-column compare-plan-column">
          <div className="compare-header">
            <h3>Básico</h3>
            <button className="compare-cta-button">Comenzar ahora</button>
            <p className="compare-description">Date a conocer sin compromiso</p>
          </div>
          <ul className="compare-features-list">
            <li><CheckIcon /></li>
            <li><CircleXIcon /></li>
            <li><CircleXIcon /></li>
            <li><CircleXIcon /></li>
          </ul>
        </div>
 
        {/* Columna Esencial */}
        <div className="compare-column compare-plan-column highlighted">
          <span className="popular-tag">Más popular</span>
          <div className="compare-header">
            <h3>Esencial</h3>
            <button className="compare-cta-button">Comenzar ahora</button>
            <p className="compare-description">Convierte tu oficio en un negocio rentable</p>
          </div>
          <ul className="compare-features-list">
            <li><CheckIcon /></li>
            <li><CheckIcon /></li>
            <li><CircleXIcon /></li>
            <li><CircleXIcon /></li>
          </ul>
        </div>
 
        {/* Columna Premium */}
        <div className="compare-column compare-plan-column">
          <div className="compare-header">
            <h3>Premium</h3>
            <button className="compare-cta-button">Comenzar ahora</button>
            <p className="compare-description">Destaca y domina tu zona</p>
          </div>
          <ul className="compare-features-list">
            <li><CheckIcon /></li>
            <li><CheckIcon /></li>
            <li><CheckIcon /></li>
            <li><CheckIcon /></li>
          </ul>
        </div>
      </div>
     
      {/* Sección preguntas frecuentes */}
      <FAQSection />
 
    </div>
  );
}
 
export default Subscriptions;