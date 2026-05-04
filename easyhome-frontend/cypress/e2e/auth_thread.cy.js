
it('debe completar el hilo desde la restricción hasta el acceso concedido', () => {
  // 1. Intentar entrar a una ruta privada
  cy.visit('/cliente/feed');

  // 2. Verificar redirección automática a auth
  cy.url().should('include', '/auth');

  // PREPARAR LA RED (Intercept) antes del click
  // Usamos un comodín (*) para capturar cualquier petición de autenticación que use tu app
  cy.intercept('POST', '**/auth/**').as('authAction');

  // 3. Completar el formulario
  cy.get('input[type="email"]').type('test@easyhome.com');
  cy.get('input[type="password"]').type('password123');
  
  // 4. Ejecutar la acción que dispara el hilo
  cy.get('button[type="submit"]').click();

  // 5. Esperar la acción de autenticación (la que antes fallaba)
  cy.wait('@authAction');

  // 6. El hilo finaliza confirmando que volvimos al feed con sesión
  cy.url().should('include', '/cliente/feed');
  cy.get('nav').contains('Cerrar Sesión').should('be.visible');
});