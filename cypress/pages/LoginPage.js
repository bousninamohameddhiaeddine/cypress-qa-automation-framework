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

  login(email, password) {
    cy.get(L.loginEmail).type(email);
    cy.get(L.loginPassword).type(password, { log: false });
    cy.get(L.loginButton).click();
  }

  signup(name, email) {
    cy.get(L.signupName).type(name);
    cy.get(L.signupEmail).type(email);
    cy.get(L.signupButton).click();
  }

  shouldShowError(message) {
    cy.contains(message).should("be.visible");
  }
}

export default new LoginPage();
