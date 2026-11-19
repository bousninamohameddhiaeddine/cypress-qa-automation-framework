// QAP-58 : automatisation de TC02, TC03 et TC04 (connexion / déconnexion)
import data from "../../fixtures/login-data.json";
import LoginPage from "../../pages/LoginPage";
import Header from "../../pages/Header";

// Cypress 16 : Cypress.env() est supprimé, on lit les secrets avec cy.env()
let user;

describe("Connexion", () => {
  // Le hook ne fait que lire les identifiants : il ne peut pas échouer à cause du site
  beforeEach(() => {
    cy.env(["userEmail", "userPassword", "userName"], { log: false }).then((env) => {
      user = { email: env.userEmail, password: env.userPassword, name: env.userName };
    });
  });

  // TC02 — le compte partagé n'est PAS supprimé (la suppression est testée dans TC01)
  it("[QAP-10] Connexion avec identifiants valides", () => {
    LoginPage.open();
    LoginPage.login(user.email, user.password);
    Header.shouldBeLoggedInAs(user.name);
  });

  // TC03 — piloté par les données (login-data.json)
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse la connexion - ${row.case}`, () => {
      LoginPage.open();
      LoginPage.login(row.email, row.password);
      LoginPage.shouldShowError(row.error);
      cy.url().should("include", "/login");
    });
  });

  // TC04
  it("[QAP-12] Déconnexion", () => {
    LoginPage.open();
    LoginPage.login(user.email, user.password);
    Header.shouldBeLoggedInAs(user.name);
    Header.logout();
    LoginPage.shouldBeVisible();
  });
});
