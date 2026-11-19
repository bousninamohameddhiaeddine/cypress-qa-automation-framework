// QAP-59 : automatisation de TC01 et TC05 (inscription)
import data from "../../fixtures/register-data.json";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";
import AccountStatusPage from "../../pages/AccountStatusPage";
import Header from "../../pages/Header";

// Cypress 16 : Cypress.env() est supprimé, on lit les secrets avec cy.env()
let existingEmail;

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

    LoginPage.open();
    LoginPage.signup(u.name, email);

    SignupPage.shouldBeVisible(u.name, email);
    SignupPage.fillAccountInformation(u);
    SignupPage.fillAddress(u);
    SignupPage.createAccount();

    AccountStatusPage.shouldShowAccountCreated();
    cy.captureValidation(); // capture de validation : "Account Created!"
    AccountStatusPage.continue();
    Header.shouldBeLoggedInAs(u.name);

    Header.deleteAccount();
    AccountStatusPage.shouldShowAccountDeleted();
    AccountStatusPage.continue();
    Header.shouldShowSignupLoginLink();
  });

  // TC05 — piloté par les données (register-data.json)
  data.invalid.forEach((row) => {
    it(`[${row.jira}] Refuse l'inscription - ${row.case}`, () => {
      // "env:userEmail" = utiliser le courriel du compte de test (déjà inscrit)
      const email = row.email === "env:userEmail" ? existingEmail : row.email;

      LoginPage.open();
      LoginPage.signup(row.name, email);
      LoginPage.shouldShowError(row.error);
      cy.url().should("include", "/signup");
    });
  });
});
