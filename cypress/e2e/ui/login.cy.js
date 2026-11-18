// QAP-58 : automatisation de TC02, TC03 et TC04 (connexion / déconnexion)
import data from "../../fixtures/login-data.json";

// Cypress 16 : Cypress.env() est supprimé, on lit les secrets avec cy.env()
let user;

const login = (email, password) => {
  cy.get('[data-qa="login-email"]').type(email);
  cy.get('[data-qa="login-password"]').type(password, { log: false });
  cy.get('[data-qa="login-button"]').click();
};

describe("Connexion", () => {
  // Le hook ne fait que lire les identifiants : il ne peut pas échouer à cause du site
  beforeEach(() => {
    cy.env(["userEmail", "userPassword", "userName"], { log: false }).then((env) => {
      user = { email: env.userEmail, password: env.userPassword, name: env.userName };
    });
  });

  // TC02 — le compte partagé n'est PAS supprimé (la suppression est testée dans TC01)
  it("[QAP-10] Connexion avec identifiants valides", () => {
    cy.openLoginPage();
    login(user.email, user.password);
    cy.contains("a", `Logged in as ${user.name}`).should("be.visible");
  });

  // TC03 — piloté par les données (login-data.json)
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse la connexion - ${row.case}`, () => {
      cy.openLoginPage();
      login(row.email, row.password);
      cy.contains(row.error).should("be.visible");
      cy.url().should("include", "/login");
    });
  });

  // TC04
  it("[QAP-12] Déconnexion", () => {
    cy.openLoginPage();
    login(user.email, user.password);
    cy.contains("a", `Logged in as ${user.name}`).should("be.visible");
    cy.contains("a", "Logout").click();
    cy.url().should("include", "/login");
    cy.contains("h2", "Login to your account").should("be.visible");
  });
});
