Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('validate form input for login', () => {
  it('CANNOT use unvalidated email', (done) => {
    cy.visit('http://127.0.0.1:8080/');
    cy.wait(700);
    cy.clearLocalStorage();
    cy.wait(700);
    cy.get('#registerForm button[type=reset]')
      .contains('Close')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get(`header [data-auth='login']`)
      .contains('Login')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get('#loginModal input[type="email"]')
      .should('be.visible')
      .type('wrongemail@gmail.com', { delay: 100 });
    cy.intercept('POST', '/api/v1/social/auth/login').as('getLogin');
    cy.get('#loginModal input[type="password"]')
      .should('be.visible')
      .type('@@££---{enter}', { delay: 100 });
    cy.wait('@getLogin').should(({ request, response }) => {
      expect(response.body, 'response properties').to.include({
        statusCode: 401,
      });
      done();
    });
  });
  it('CANNOT login', () => {
    cy.url().should('not.include', 'login');
    expect(localStorage.getItem('token')).to.be.null;
  });
});

describe('Social Media App: Authenticated user', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/');
    cy.wait(700);
    cy.clearLocalStorage();
    cy.wait(700);
    cy.get('#registerForm button[type=reset]')
      .contains('Close')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get(`header [data-auth='login']`)
      .contains('Login')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get('#loginModal input[type="email"]')
      .should('be.visible')
      .type('KMTest01@noroff.no', { delay: 100 });
    cy.get('#loginModal input[type="password"]')
      .should('be.visible')
      .type('KMTest01{enter}', { delay: 100 });
    cy.wait(700);
  });
  it('CAN login', () => {
    cy.url().should('include', 'profile');
    cy.url().should('not.include', 'login');
    expect(localStorage.getItem('token')).to.not.be.null;
  });
});
describe('Social Media App: Authenticated user post form validate and post', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/');
    cy.wait(700);
    cy.clearLocalStorage();
    cy.wait(700);
    cy.get('#registerForm button[type=reset]')
      .contains('Close')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get(`header [data-auth='login']`)
      .contains('Login')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get('#loginModal input[type="email"]')
      .should('be.visible')
      .type('KMTest01@noroff.no', { delay: 100 });
    cy.get('#loginModal input[type="password"]')
      .should('be.visible')
      .type('KMTest01{enter}', { delay: 100 });
    cy.wait(700);
  });
  it('CAN validate post form no title', () => {
    cy.get(`footer [data-visible='loggedIn']`)
      .contains('New Post')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get('#postTags')
      .should('be.visible')
      .type('Cypress, Testing', { delay: 100 });
    cy.get('#postBody')
      .should('be.visible')
      .type('This is a test post for Cypress E2E testing', { delay: 100 });
    cy.get(`#postForm [data-action='submit']`)
      .contains('Publish')
      .should('be.visible')
      .click();
    cy.wait(500);
    cy.url().should('not.include', 'postId');
  });
  it('CAN create new post and delete it', () => {
    cy.get(`footer [data-visible='loggedIn']`)
      .contains('New Post')
      // .should('be.visible')
      .click({ force: true });
    cy.wait(700);
    cy.get('#postTitle')
      .should('be.visible')
      .type('Cypress test post', { delay: 100 });
    cy.get('#postTags')
      .should('be.visible')
      .type('Cypress, Testing', { delay: 100 });
    cy.get('#postBody')
      .should('be.visible')
      .type('This is a test post for Cypress E2E testing', { delay: 100 });
    cy.get(`#postForm [data-action='submit']`)
      .contains('Publish')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get(`header [href='./']`).should('be.visible').click();
    cy.wait(700);
    cy.get(`main button[data-action='delete']`)
      .contains('Delete')
      .should('be.visible')
      .click({ force: true });
    cy.wait(700);
  });
});
describe('Social Media App: Authenticated user logout', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/');
    cy.wait(700);
    cy.clearLocalStorage();
    cy.wait(700);
    cy.get('#registerForm button[type=reset]')
      .contains('Close')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get(`header [data-auth='login']`)
      .contains('Login')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.get('#loginModal input[type="email"]')
      .should('be.visible')
      .type('KMTest01@noroff.no', { delay: 100 });
    cy.get('#loginModal input[type="password"]')
      .should('be.visible')
      .type('KMTest01{enter}', { delay: 100 });
    cy.wait(700);
  });
  it('CAN log user out', () => {
    cy.get(`header [data-auth='logout']`)
      .contains('Logout')
      .should('be.visible')
      .click();
    cy.wait(700);
    cy.url().should('not.include', 'profile');
    cy.wait(400);
  });
});
