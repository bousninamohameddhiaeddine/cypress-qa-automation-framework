import { LoginLocators as L } from "./locators";
import HomePage from "./HomePage";
import Header from "./Header";

// Page "Signup / Login" : https://automationexercise.com/login
// Contient 2 formulaires : connexion (à gauche) et début d'inscription (à droite)
class LoginPage {
  // Ouvre la page depuis l'accueil, comme un utilisateur.
  // À appeler au début de chaque test (pas dans un beforeEach) : si le site ne charge pas,
  // seul ce test échoue et les suivants s'exécutent quand même.
  open() {
    HomePage.visit();
    Header.goToSignupLogin();
    this.shouldBeVisible();
  }

  shouldBeVisible() {
    cy.url().should("include", "/login");
    cy.get(L.loginTitle).should("be.visible");
    cy.get(L.signupTitle).should("be.visible");
  }

  // fill() accepte les valeurs vides (cas négatifs), contrairement à type()
  login(email, password) {
    cy.get(L.loginEmail).fill(email);
    cy.get(L.loginPassword).fill(password, { log: false });
    cy.get(L.loginButton).click();
  }

  // options.paste = coller le courriel au lieu de le taper (voir fill() dans commands.js)
  signup(name, email, options = {}) {
    cy.get(L.signupName).fill(name);
    cy.get(L.signupEmail).fill(email, { paste: options.paste });
    cy.get(L.signupButton).click();
  }

  shouldBeLoggedOut() {
    Header.shouldBeLoggedOut();
    cy.url().should("include", "/login");
  }

  // Validation HTML5 : "field" = nom du localisateur dans locators.js (ex. "loginEmail")
  shouldHaveInvalidField(field) {
    cy.get(L[field]).shouldBeInvalid();
  }

  shouldShowError(message) {
    cy.contains(message).should("be.visible");
  }
}

export default new LoginPage();
