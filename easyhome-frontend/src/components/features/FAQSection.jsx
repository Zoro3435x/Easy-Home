import React, { useState } from 'react';
import '../../assets/styles/FAQSection.css';
 
function SwitchHorizontalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="icon icon-tabler-switch-horizontal faq-custom-icon">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M16 3l4 4l-4 4" />
      <path d="M10 7l10 0" />
      <path d="M8 13l-4 4l4 4" />
      <path d="M4 17l9 0" />
    </svg>
  );
}
 
function CurrencyDollarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="icon icon-tabler-currency-dollar faq-custom-icon">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2" />
      <path d="M12 3v3m0 12v3" />
    </svg>
  );
}
 
function MoneyBag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-tax">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8.487 21h7.026a4 4 0 0 0 3.808 -5.224l-1.706 -5.306a5 5 0 0 0 -4.76 -3.47h-1.71a5 5 0 0 0 -4.76 3.47l-1.706 5.306a4 4 0 0 0 3.808 5.224" />
      <path d="M15 3q -1 4 -3 4t -3 -4z" />
      <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
      <path d="M12 10v1" />
      <path d="M12 17v1" />
    </svg>
  );
}
 
function CancelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cancel">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M18.364 5.636l-12.728 12.728" />
    </svg>
  );
}
 
function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-mail">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
    <path d="M3 7l9 6l9 -6" />
    </svg>
  );
}
 
function Information() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-file-info"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm0 12h-1a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007v-3a1 1 0 0 0 -1 -1m.01 -3h-.01a1 1 0 0 0 -.117 1.993l.127 .007a1 1 0 0 0 0 -2" />
    <path d="M19 7h-4l-.001 -4.001z" />
    </svg>
  )
 
}
// -----------------------------------------------------------
 
 
function FAQSection() {
  const faqData = [
    {
      id: 1,
      icon: '',
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer: 'Sí, puedes actualizar o degradar tu plan en cualquier momento siempre y cuando envíes tu banner actualizado acorde al tamaño adquirido.'
    },
    {
      id: 2,
      icon: '',
      question: '¿Cómo funciona el pago?',
      answer: 'El pago es mensual y se notificará a tu empresa vía correo electrónico cuando esta vaya a vencer.'
    },
    { id: 3, icon: '',
      question: '¿Existen costos ocultos o cargos adicionales?',
      answer: 'No, todos nuestros planes son transparentes. El precio mensual indicado es el costo total que pagarás, sin cargos ocultos.'
    },
    { id: 4,
      icon: '',
      question: '¿Puedo cancelar mi plan cuando quiera?',
      answer: 'Sí, puedes cancelar tu suscripción sin penalizaciones en cualquier momento. La cancelación será efectiva al final de tu ciclo de facturación actual.' },
    { id: 5, icon: '', question: '¿Debo enviar mi banner en un tamaño específico?', answer: 'Sí, cada plan tiene especificaciones de tamaño. Las medidas necesarias serán indicadas al momento de seleccionar el plan deseado.' },
    { id: 6, icon: '', question: '¿Qué datos necesito enviar?', answer: 'Necesitamos información sobre tu empresa, un correo electrónico para contactarnos y el banner que se desea mostrar.' },
  ];
 
  const [activeIndex, setActiveIndex] = useState(null);
 
  const toggleFAQ = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };
 
  // Función para renderizar el icono
  const renderIcon = (item) => {
    if (item.id === 1) {
      return <SwitchHorizontalIcon />;
    }
    if (item.id === 2) {
      return <CurrencyDollarIcon />;
    }
    if (item.id === 3) {
      return <MoneyBag />;
    }
    if (item.id === 4) {
      return <CancelIcon />;
    }
    if (item.id === 5) {
      return <SendIcon />;
    }
    if (item.id === 6) {
      return <Information />;
    }
  };
 
  return (
    <section className="faq-section">
      <h2 className="faq-title">Preguntas Frecuentes</h2>
     
      <div className="faq-accordion">
        {faqData.map((item) => (
          <div key={item.id} className={`faq-item ${activeIndex === item.id ? 'active' : ''}`}>
           
            <button
              className="faq-question-header"
              onClick={() => toggleFAQ(item.id)}
            >
              <span className="faq-icon">
                {renderIcon(item)}
              </span>
 
              <span className="faq-question-text">{item.question}</span>
              <span className="faq-arrow">
                {/* Ícono de la flecha rotatoria (corregido a camelCase) */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </button>
           
            <div className="faq-answer-content">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
 
export default FAQSection;