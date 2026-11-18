// QAP-59 : automatisation de TC01 et TC05 (inscription)
import data from "../../fixtures/register-data.json";

// Cypress 16 : Cypress.env() est supprimé, on lit les secrets avec cy.env()
let existingEmail;

const signup = (name, email) => {
  cy.get('[data-qa="signup-name"]').type(name);
  cy.get('[data-qa="signup-email"]').type(email);
  cy.get('[data-qa="signup-button"]').click();
};

describe("Inscription", () => {
  // Le hook ne fait que lire les identifiants : il ne peut pas échouer à cause du site
  beforeEach(() => {
    cy.env(["userEmail"], { log: false }).then((env) => {
      existingEmail = env.userEmail;
    });
  });

  // TC01 — crée un compte unique puis le supprime (le compte partagé n'est pas touché)
  it(`[${data.newUser.jira}] ${data.newUser.case}`, () => {
    const u = data.newUser;
    const email = `qa.test.${Date.now()}@example.com`; // courriel unique à chaque exécution

    cy.openLoginPage();
    signup(u.name, email);

    // Informations du compte
    cy.contains("b", "Enter Account Information").should("be.visible");
    cy.get(`#id_gender${u.title === "Mr" ? 1 : 2}`).check();
    cy.get('[data-qa="name"]').should("have.value", u.name);
    cy.get('[data-qa="email"]').should("have.value", email);
    cy.get('[data-qa="password"]').type(u.password, { log: false });
    cy.get('[data-qa="days"]').select(u.day);
    cy.get('[data-qa="months"]').select(u.month);
    cy.get('[data-qa="years"]').select(u.year);
    cy.get("#newsletter").check();
    cy.get("#optin").check();

    // Adresse
    cy.get('[data-qa="first_name"]').type(u.firstName);
    cy.get('[data-qa="last_name"]').type(u.lastName);
    cy.get('[data-qa="company"]').type(u.company);
    cy.get('[data-qa="address"]').type(u.address);
    cy.get('[data-qa="address2"]').type(u.address2);
    cy.get('[data-qa="country"]').select(u.country);
    cy.get('[data-qa="state"]').type(u.state);
    cy.get('[data-qa="city"]').type(u.city);
    cy.get('[data-qa="zipcode"]').type(u.zipcode);
    cy.get('[data-qa="mobile_number"]').type(u.mobile);
    cy.get('[data-qa="create-account"]').click();

    // Compte créé et connecté
    cy.get('[data-qa="account-created"]').should("be.visible");
    cy.captureValidation(); // capture de validation : "Account Created!"
    cy.get('[data-qa="continue-button"]').click();
    cy.contains("a", `Logged in as ${u.name}`).should("be.visible");

    // Suppression du compte
    cy.contains("a", "Delete Account").click();
    cy.get('[data-qa="account-deleted"]').should("be.visible");
    cy.get('[data-qa="continue-button"]').click();
    cy.contains("a", "Signup / Login").should("be.visible");
  });

  // TC05 — piloté par les données (register-data.json)
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse l'inscription - ${row.case}`, () => {
      // "env:userEmail" = utiliser le courriel du compte de test (déjà inscrit)
      const email = row.email === "env:userEmail" ? existingEmail : row.email;

      cy.openLoginPage();
      signup(row.name, email);
      cy.contains(row.error).should("be.visible");
      cy.url().should("include", "/signup");
    });
  });
});
