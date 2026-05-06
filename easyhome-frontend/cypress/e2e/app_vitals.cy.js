/// <reference types="cypress" />

// =============================================================================
// EASYHOME — SUITE DE SMOKE TESTS
//
// Propósito: Verificar que los módulos principales del marketplace estén
// operativos tras cada despliegue. Estas pruebas no validan lógica de negocio
// profunda; son el "pulso" del sistema antes de ejecutar pruebas de integración.
//
// Convención de rutas (Vite + React Router):
//   /          → Home pública
//   /auth      → Login / Registro
//   /subscriptions → Planes de suscripción para trabajadores
//   /advertise → Planes de publicidad para empresas
//   /cliente/feed  → Feed de publicaciones (ruta PROTEGIDA — requiere auth)
// =============================================================================


// -----------------------------------------------------------------------------
// MÓDULO 1: AUTENTICACIÓN
//
// Hilo de negocio: El acceso a cualquier flujo protegido depende de que el
// formulario de autenticación esté disponible. Si este módulo falla, ningún
// otro flujo autenticado puede ejecutarse.
// -----------------------------------------------------------------------------
describe('Módulo: Autenticación', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/auth');
  });

  it('debe renderizar el formulario en modo "Iniciar Sesión" por defecto', () => {
    cy.get('h2').contains('Iniciar Sesión').should('be.visible');
  });

  it('debe mostrar el campo de correo electrónico', () => {
    cy.get('input[type="email"]').should('be.visible');
  });

  it('debe mostrar el campo de contraseña', () => {
    cy.get('input[type="password"]').should('be.visible');
  });

  it('debe mostrar el botón de acceso con Google OAuth', () => {
    cy.contains('button', 'Continuar con Google').should('be.visible');
  });

  it('debe mostrar el botón de envío del formulario', () => {
    cy.get('button[type="submit"]').contains('Iniciar Sesión').should('be.visible');
  });

  it('debe cambiar al modo "Registrarse" al pulsar el toggle', () => {
    cy.contains('button', 'Regístrate').click();
    cy.get('h2').contains('Registrarse').should('be.visible');
    // En modo registro debe aparecer el campo de confirmación de contraseña
    cy.get('input[placeholder="Confirmar contraseña"]').should('be.visible');
  });

  it('debe mostrar mensaje de error al enviar el formulario vacío', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Ingresa email y contraseña').should('be.visible');
  });
});


// -----------------------------------------------------------------------------
// MÓDULO 2: HOME Y NAVEGACIÓN
//
// Hilo de negocio: La Home es el punto de entrada al marketplace y concentra
// la propuesta de valor. El Navbar debe permitir llegar a todos los módulos
// públicos desde cualquier página.
// -----------------------------------------------------------------------------
describe('Módulo: Home y Navegación', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/');
  });

  // — Sección Hero —
  it('debe renderizar el H1 con la propuesta de valor principal', () => {
    cy.get('h1')
      .contains('Conecta con los mejores proveedores locales')
      .should('be.visible');
  });

  it('debe mostrar el botón "Comenzar ahora" en el hero', () => {
    cy.get('.hero-button').contains('Comenzar ahora').should('be.visible');
  });

  // — Sección ¿Cómo funciona? —
  it('debe renderizar los 3 pasos del proceso', () => {
    cy.contains('¿Cómo funciona Easy Home?').should('be.visible');
    cy.get('.step-card').should('have.length', 3);
  });

  // — Sección Beneficios —
  it('debe renderizar al menos 3 beneficios de la plataforma', () => {
    cy.contains('Beneficios de Easyhome').should('be.visible');
    cy.get('.benefit-item').should('have.length.at.least', 3);
  });

  // — CTA para trabajadores —
  it('debe mostrar el CTA "Postúlate aquí" para captar trabajadores', () => {
    cy.contains('Postúlate aquí').should('be.visible');
  });

  // — Navbar: existencia de enlaces —
  it('debe tener el enlace "Publicaciones" en el navbar', () => {
    cy.get('nav').contains('Publicaciones').should('exist');
  });

  it('debe tener el enlace "Suscripciones" en el navbar', () => {
    cy.get('nav').contains('Suscripciones').should('exist');
  });

  it('debe tener el enlace "Anúnciate" en el navbar', () => {
    cy.get('nav').contains('Anúnciate').should('exist');
  });

  // — Navbar: navegación funcional —
  it('debe navegar a /subscriptions al pulsar "Suscripciones"', () => {
    cy.get('nav').contains('Suscripciones').click();
    cy.url().should('include', '/subscriptions');
  });

  it('debe navegar a /advertise al pulsar "Anúnciate"', () => {
    cy.get('nav').contains('Anúnciate').click();
    cy.url().should('include', '/advertise');
  });

  it('debe redirigir a /auth al pulsar "Iniciar Sesión" en el navbar', () => {
    cy.get('nav').contains('Iniciar Sesión').click();
    cy.url().should('include', '/auth');
  });
});


// -----------------------------------------------------------------------------
// MÓDULO 3: EXPLORACIÓN DE PROPIEDADES (FEED)
//
// Hilo de negocio: El feed de publicaciones es el núcleo del marketplace.
// La ruta está protegida: un visitante no autenticado DEBE ser redirigido a
// /auth. Esto valida que ProtectedRoute funciona correctamente.
// -----------------------------------------------------------------------------
describe('Módulo: Exploración de Propiedades', () => {
  it('el enlace "Publicaciones" del navbar debe apuntar a /cliente/feed', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('nav a[href="/cliente/feed"]').should('exist');
  });

  it('acceder a /cliente/feed sin sesión debe redirigir a /auth', () => {
    // Regla de negocio: ProtectedRoute redirige usuarios no autenticados al login
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/cliente/feed');
    cy.url().should('include', '/auth');
  });

  it('usuario autenticado con rol Admin debe poder acceder a /cliente/feed', () => {
    // Regla de negocio: Admin tiene visibilidad total del marketplace
    const fakeAdminUser = {
      profile: {
        email: 'admin@example.com',
        name: 'Admin Test',
        'cognito:groups': ['Admin'],
      },
      groups: ['Admin'],
    };

    cy.visit('/cliente/feed', {
      onBeforeLoad(win) {
        win.localStorage.setItem('easyhome_auth_user', JSON.stringify(fakeAdminUser));
      },
    });

    cy.url().should('include', '/cliente/feed');
    cy.url().should('not.include', '/unauthorized');
  });
});


// -----------------------------------------------------------------------------
// MÓDULO 4: SUSCRIPCIONES
//
// Hilo de negocio: La página de suscripciones es el mecanismo de monetización
// principal para trabajadores. Debe mostrar los 3 planes y el FAQ para que el
// usuario pueda tomar una decisión informada.
// -----------------------------------------------------------------------------
describe('Módulo: Suscripciones', () => {
  beforeEach(() => {
    cy.visit('/subscriptions');
  });

  it('debe renderizar el título principal de la página de planes', () => {
    cy.contains('Encuentra el Plan Perfecto para Ti').should('be.visible');
  });

  it('debe mostrar exactamente 3 planes (Básico, Esencial, Premium)', () => {
    cy.get('.pricing-card').should('have.length', 3);
  });

  it('el plan Básico debe indicar que es Gratis', () => {
    cy.get('.pricing-card').first().within(() => {
      cy.contains('Básico').should('be.visible');
      cy.contains('Gratis').should('be.visible');
    });
  });

  it('el plan Esencial debe mostrar precio en USD/mes', () => {
    cy.get('.pricing-card').eq(1).within(() => {
      cy.contains('Esencial').should('be.visible');
      cy.contains('USD/mes').should('be.visible');
    });
  });

  it('cada plan debe tener un botón de acción "Comenzar Ahora"', () => {
    cy.get('.pricing-card .card-button').should('have.length', 3);
  });

  it('debe renderizar la sección de Preguntas Frecuentes', () => {
    cy.get('.faq-section').should('exist');
    cy.contains('Preguntas Frecuentes').should('be.visible');
  });

  it('debe expandir la respuesta de un FAQ al hacer clic en la pregunta', () => {
    cy.get('.faq-question-header').first().click();
    cy.get('.faq-item.active').should('exist');
  });
});


// -----------------------------------------------------------------------------
// MÓDULO 5: PUBLICIDAD / ANÚNCIATE
//
// Hilo de negocio: Esta página capta anunciantes externos. Es pública y debe
// mostrar los planes de publicidad disponibles con su tabla comparativa.
// -----------------------------------------------------------------------------
describe('Módulo: Publicidad (Anúnciate)', () => {
  beforeEach(() => {
    cy.visit('/advertise');
  });

  it('debe renderizar el título de la sección de publicidad', () => {
    cy.contains('¡Muestra tu marca en EasyHome!').should('be.visible');
  });

  it('debe mostrar 3 planes de publicidad (Rotatorio, Lateral, Superior)', () => {
    cy.get('.pricing-card').should('have.length', 3);
  });

  it('cada plan de publicidad debe tener un botón "Comenzar Ahora"', () => {
    cy.get('.pricing-card .card-button').should('have.length', 3);
  });

  it('debe renderizar la tabla comparativa de planes', () => {
    cy.get('.comparison-table').should('be.visible');
  });

  it('debe mantener el navbar funcional para continuar la navegación', () => {
    cy.get('nav').should('be.visible');
    cy.get('nav').contains('Suscripciones').should('exist');
  });
});


// -----------------------------------------------------------------------------
// MÓDULO 6: PUBLICAR SERVICIO (FLUJO COMPLETO)
//
// Hilo de negocio: Verificar que un proveedor pueda abrir el modal de
// publicación, completar el formulario, subir al menos una foto (in-memory)
// y publicar. Interceptamos las llamadas al backend para mantener el test
// determinista.
// -----------------------------------------------------------------------------
describe('Módulo: Publicar Servicio', () => {
  const fakeWorkerUser = {
    profile: {
      email: 'worker@example.com',
      name: 'Worker Test',
      sub: 'local-worker-example',
      'cognito:groups': ['Trabajadores']
    },
    groups: ['Trabajadores']
  };

  const providerId = 456;

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept('GET', /\/api\/v1\/auth\/user-info\/.*/, {
      statusCode: 200,
      body: {
        id_usuario: 123,
        id_proveedor: providerId,
        nombre: 'Worker Test',
        fecha_nacimiento: '1990-01-01'
      }
    }).as('getUserInfo');

    cy.intercept('GET', '/api/v1/categories/', {
      statusCode: 200,
      body: [{ id_categoria: 1, nombre_categoria: 'Limpieza' }]
    }).as('getCategories');

    cy.intercept('GET', /\/api\/v1\/proveedores\/.*\/servicios/, (req) => {
      req.reply({
        statusCode: 200,
        body: [
          {
            id_publicacion: 1,
            titulo: 'Servicio de prueba Cypress',
            descripcion: 'Descripción de prueba',
            rango_precio_min: 10,
            rango_precio_max: 20,
            imagen_publicacion: [],
            estado: 'ACTIVO',
            calificacion_promedio_publicacion: null,
            total_reseñas_publicacion: 0,
            vistas: 0
          }
        ]
      });
    }).as('getServicios');

    cy.intercept('POST', '/api/v1/publicaciones/', (req) => {
      req.reply({ statusCode: 201, body: { titulo: 'Servicio de prueba Cypress' } });
    }).as('postPublicacion');
  });

  it('debe abrir modal de nuevo servicio, completar y publicar', () => {
    cy.log('Cargando perfil de proveedor');
    cy.visit('/perfil', {
      onBeforeLoad(win) {
        win.localStorage.setItem('easyhome_auth_user', JSON.stringify(fakeWorkerUser));
      },
    });

    cy.wait('@getUserInfo', { timeout: 10000 });

    cy.log('Abriendo la sección Mis servicios');
    cy.contains('Mis servicios').click();

    cy.wait('@getServicios', { timeout: 10000 });

    cy.log('Abriendo el modal Nuevo Servicio');
    cy.get('.btn-nuevo-servicio').should('be.visible').click();

    cy.wait('@getCategories', { timeout: 10000 });

    cy.get('.form-title').contains('Publica tu servicio').should('be.visible');
    cy.get('#categoria option').should('have.length.at.least', 1);

    cy.log('Completando formulario de servicio');
    cy.get('#titulo').type('Servicio de prueba Cypress');
    cy.get('#categoria').select('1').should('have.value', '1');
    cy.get('#descripcion').type('Descripción de prueba');

    cy.log('Adjuntando imagen de prueba');
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    cy.get('input[type="file"]#fotos', { timeout: 10000 }).selectFile(
      {
        contents: Cypress.Blob.base64StringToBlob(base64Image, 'image/png'),
        fileName: 'test.png',
        mimeType: 'image/png'
      },
      { force: true }
    );

    cy.get('.photo-previews-container').should('exist');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.log('Enviando publicación');
    cy.get('.submit-button').click();

    cy.wait('@postPublicacion', { timeout: 10000 });

    cy.log('Verificando refresco de servicios después de publicar');
    cy.wait('@getServicios', { timeout: 10000 });

    cy.get('@alert').should('have.been.called');
    cy.get('@alert').then((stub) => {
      const firstCallArg = stub.getCall(0).args[0];
      expect(firstCallArg).to.include('publicado con éxito');
    });

    cy.log('Cambiando a la pestaña Mis servicios para verificar la publicación');
    cy.contains('Mis servicios').click();
    cy.contains('Servicio de prueba Cypress', { timeout: 10000 }).should('be.visible');
  });
});
