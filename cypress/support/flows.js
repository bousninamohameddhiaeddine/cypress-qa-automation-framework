// Parcours réutilisés par plusieurs tests (uniquement des appels aux Page Objects)
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import AccountStatusPage from "../pages/AccountStatusPage";
import Header from "../pages/Header";
import HomePage from "../pages/HomePage";

// Compte jetable créé par l'API, puis connexion par l'interface
// (test hybride : préparation rapide par l'API, parcours vérifié par l'UI)
export const createAccountAndLogin = (u) => {
  cy.createAccountByApi(u);
  HomePage.visit();
  Header.goToSignupLogin();
  LoginPage.login(u.email, u.password);
  Header.shouldBeLoggedInAs(u.name);
};

// Inscription complète par l'interface, depuis la page /login
export const registerViaUi = (u) => {
  LoginPage.signup(u.name, u.email);
  SignupPage.shouldBeVisible(u.name, u.email);
  SignupPage.fillAccountForm(u);
  SignupPage.createAccount();
  AccountStatusPage.shouldShowAccountCreated();
  AccountStatusPage.continue();
  Header.shouldBeLoggedInAs(u.name);
};

// Suppression du compte connecté par l'interface ("Delete Account")
export const deleteAccountViaUi = () => {
  Header.deleteAccount();
  AccountStatusPage.shouldShowAccountDeleted();
  AccountStatusPage.continue();
};
