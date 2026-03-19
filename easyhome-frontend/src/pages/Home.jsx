import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import HeroSection from '../components/features/HeroSection'
import Categories from '../components/features/Categories'
import { Button } from '../components/ui'
import '../assets/styles/BeneficiosEH_HomePage.css'
import "../assets/styles/postulate.css"
import "../assets/styles/como_funciona.css"

function Home() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()
  const auth = useAuth()

  const handlePostulateClick = () => {
    // Verificar si el usuario está autenticado
    if (!auth.isAuthenticated) {
      // Si no está autenticado, redirigir al login
      navigate('/auth')
    } else {
      // Si está autenticado, ir a la página de postulación
      navigate('/postulate')
    }
  }

  return (
    <>
      <HeroSection />
      <Categories />
      
      <div className="home-container">
        {/* Sección: Cómo Funciona */}
        <section className="how-it-works-section">
          <h2 className="process-title">¿Cómo funciona Easy Home?</h2>
          
          <div className="process-steps">
            {/* Paso 1 */}
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-heading">Busca el servicio</h3>
              <p className="step-description">
                Encuentra el profesional que necesites usando nuestra búsqueda o categorías.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-heading">Compara y elige</h3>
              <p className="step-description">
                Revisa perfiles, precios y reseñas de otros clientes.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-heading">Contrata</h3>
              <p className="step-description">
                Agenda tu servicio y recibe trabajo de calidad garantizada.
              </p>
            </div>
          </div>
        </section>

        <section className="benefits-section">
        <h2 className="benefits-title">Beneficios de Easyhome</h2>
        <div className="benefits-container">
          <div className="benefit-item">
            <div className="benefit-content-wrapper">
              <div className="icon-wrapper">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="check-icon">
                  <g clipPath="url(#clip0_138_255)">
                    <path d="M8.56002 3.68994C7.4681 4.14193 6.47588 4.80454 5.64001 5.63994" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.69 8.56006C3.23656 9.65036 3.0021 10.8192 3 12.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.69 15.4399C4.14199 16.5319 4.8046 17.5241 5.64 18.3599" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.56 20.3101C9.6503 20.7635 10.8192 20.998 12 21.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.44 20.3101C16.5319 19.8581 17.5241 19.1955 18.36 18.3601" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.31 15.44C20.7634 14.3497 20.9979 13.1808 21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.31 8.55989C19.858 7.46797 19.1954 6.47576 18.36 5.63989" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.44 3.69C14.3497 3.23656 13.1808 3.0021 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs><clipPath id="clip0_138_255"><rect width="24" height="24" fill="white"/></clipPath></defs>
                </svg>
              </div>
              <h3>Proveedores Verificados</h3>
              <p>Todos los proveedores pasan por un proceso de validación</p>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-content-wrapper">
              <div className="icon-wrapper">
                <svg width="60" height="60" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="star-icon">
                  <path d="M10.993 16.748L4.82103 19.993L6.00003 13.12L1.00003 8.253L7.90003 7.253L10.986 1L14.072 7.253L20.972 8.253L15.972 13.12L17.151 19.993L10.993 16.748Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Sistema de reseñas</h3>
              <p>Lee opiniones reales de otros usuarios antes de contratar</p>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-content-wrapper">
              <div className="icon-wrapper">
                <svg width="60" height="60" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="price-icon">
                  <path d="M5 11H2C1.73478 11 1.48043 10.8946 1.29289 10.7071C1.10536 10.5196 1 10.2652 1 10V2C1 1.73478 1.10536 1.48043 1.29289 1.29289C1.48043 1.10536 1.73478 1 2 1H14C14.2652 1 14.5196 1.10536 14.7071 1.29289C14.8946 1.48043 15 1.73478 15 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5H18C18.2652 5 18.5196 5.10536 18.7071 5.29289C18.8946 5.48043 19 5.73478 19 6V14C19 14.2652 18.8946 14.5196 18.7071 14.7071C18.5196 14.8946 18.2652 14.8946 18 15H6C5.73478 15 5.48043 14.8946 5.29289 14.7071C5.10536 14.5196 5 14.2652 5 14V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 10C10 10.5304 10.2107 11.0391 10.5858 11.4142C10.9609 11.7893 11.4696 12 12 12C12.5304 12 13.0391 11.7893 13.4142 11.4142C13.7893 11.0391 14 10.5304 14 10C14 9.46957 13.7893 8.96086 13.4142 8.58579C13.0391 8.21071 12.5304 8 12 8C11.4696 8 10.9609 8.21071 10.5858 8.58579C10.2107 8.96086 10 9.46957 10 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Mejores Precios</h3>
              <p>Compara opciones y encuentra la mejor relación calidad-precio</p>
            </div>
          </div>
        </div>
      </section>

        {/* Sección: Call to Action - Postúlate */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">
              ¿Eres un profesional de servicios? Únete a Easy Home
            </h2>
            <p className="cta-description">
              Conectamos directamente a expertos locales como tú con clientes que 
              necesitan servicios de carpintería, fontanería, limpieza para sus 
              hogares y mucho más. Consigue más trabajo y haz crecer tu negocio.
            </p>
            <Button 
              variant="primary" 
              size="medium"
              onClick={handlePostulateClick}
              className="cta-button"
            >
              Postúlate aquí
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home
