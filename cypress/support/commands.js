// Commandes personnalisées du projet
// (les captures d'écran sont gérées automatiquement dans e2e.js,
//  la navigation et les sélecteurs sont dans les Page Objects : cypress/pages/)
import { screenshotName } from "./screenshot";
import { HeaderLocators } from "../pages/locators";
import LoginPage from "../pages/LoginPage";

// ---------------------------------------------------------------------
// Captures
// ---------------------------------------------------------------------

// cy.captureValidation() : prend la capture "PASSED" à un moment précis du test
// (au lieu de la fin). La capture automatique de fin de test est alors désactivée
// pour ce test, il n'y a donc qu'une seule capture.
Cypress.Commands.add("captureValidation", () => {
  Cypress.validationCaptured = true;
  cy.screenshot(screenshotName(Cypress.currentTest.title, "PASSED"), { capture: "viewport" });
});

// ---------------------------------------------------------------------
// Champs de formulaire (séance 1)
// ---------------------------------------------------------------------

// cy.get(...).fill(valeur) : vide le champ puis tape la valeur (si elle n'est pas vide).
// Permet de tester les champs vides sans que .type("") ne plante.
Cypress.Commands.add("fill", { prevSubject: "element" }, (subject, value, options = {}) => {
  cy.wrap(subject, { log: false }).clear();
  if (value) cy.wrap(subject, { log: false }).type(value, options);
  return cy.wrap(subject, { log: false });
});

// cy.get(...).shouldBeInvalid() : le navigateur considère le champ comme invalide
// (validation HTML5 : champ obligatoire vide, courriel mal formé...).
// La bulle "Veuillez renseigner ce champ" n'est pas dans la page : on vérifie checkValidity().
Cypress.Commands.add("shouldBeInvalid", { prevSubject: "element" }, (subject) => {
  cy.wrap(subject).should(($el) => {
    expect($el[0].checkValidity(), "champ invalide").to.be.false;
  });
});

// ---------------------------------------------------------------------
// Connexion mise en cache (séance 2)
// ---------------------------------------------------------------------

// cy.login(email, password) : la 1re fois on se connecte, ensuite Cypress restaure la session.
// ⚠️ Ne pas l'utiliser dans login.cy.js : ce fichier teste justement la connexion par l'interface.
Cypress.Commands.add("login", (email, password) => {
  cy.session(
    ["login", email], // identifiant du cache (pas de mot de passe dedans)
    () => {
      cy.visit("/login");
      LoginPage.login(email, password);
      cy.get(HeaderLocators.loggedInAs).should("be.visible");
    },
    {
      // Vérifie que la session restaurée est toujours valide
      validate() {
        cy.visit("/");
        cy.get(HeaderLocators.loggedInAs).should("be.visible");
      },
    }
  );
});

// ---------------------------------------------------------------------
// Comptes jetables par l'API (séance 2, bonus)
// API 11 et 12 : https://automationexercise.com/api_list
// ---------------------------------------------------------------------

// cy.createAccountByApi(user) : crée un compte sans passer par l'interface.
// "user" contient les champs de l'API : name, email, password, title, birth_date,
// birth_month, birth_year, firstname, lastname, company, address1, address2,
// country, zipcode, state, city, mobile_number
Cypress.Commands.add("createAccountByApi", (user) => {
  cy.request({ method: "POST", url: "/api/createAccount", form: true, body: user, log: false })
    .its("body")
    .should("contain", "User created!");
});

// cy.deleteAccountByApi(email, password) : supprime le compte
Cypress.Commands.add("deleteAccountByApi", (email, password) => {
  cy.request({
    method: "DELETE",
    url: "/api/deleteAccount",
    form: true,
    body: { email, password },
    log: false,
  })
    .its("body")
    .should("contain", "Account deleted!");
});
