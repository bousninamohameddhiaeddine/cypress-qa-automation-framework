// =====================================================================
// LOCALISATEURS — tous les sélecteurs du site au même endroit.
// Si le site change un sélecteur, on le modifie ICI seulement.
// Les Page Objects (cypress/pages/*.js) importent ce fichier.
// =====================================================================

// Menu en haut de toutes les pages
export const HeaderLocators = {
  logo: 'img[alt="Website for automation practice"]',
  signupLoginLink: 'a[href="/login"]',
  logoutLink: 'a[href="/logout"]',
  deleteAccountLink: 'a[href="/delete_account"]',
  loggedInAs: 'a:contains("Logged in as")',
};

// Page "Signup / Login" (/login)
export const LoginLocators = {
  loginTitle: 'h2:contains("Login to your account")',
  loginEmail: '[data-qa="login-email"]',
  loginPassword: '[data-qa="login-password"]',
  loginButton: '[data-qa="login-button"]',
  signupTitle: 'h2:contains("New User Signup!")',
  signupName: '[data-qa="signup-name"]',
  signupEmail: '[data-qa="signup-email"]',
  signupButton: '[data-qa="signup-button"]',
};

// Page "Enter Account Information" (/signup)
export const SignupLocators = {
  title: 'b:contains("Enter Account Information")',
  titleMr: "#id_gender1",
  titleMrs: "#id_gender2",
  name: '[data-qa="name"]',
  email: '[data-qa="email"]',
  password: '[data-qa="password"]',
  days: '[data-qa="days"]',
  months: '[data-qa="months"]',
  years: '[data-qa="years"]',
  newsletter: "#newsletter",
  optin: "#optin",
  firstName: '[data-qa="first_name"]',
  lastName: '[data-qa="last_name"]',
  company: '[data-qa="company"]',
  address: '[data-qa="address"]',
  address2: '[data-qa="address2"]',
  country: '[data-qa="country"]',
  state: '[data-qa="state"]',
  city: '[data-qa="city"]',
  zipcode: '[data-qa="zipcode"]',
  mobile: '[data-qa="mobile_number"]',
  createAccount: '[data-qa="create-account"]',
};

// Pages "Account Created!" et "Account Deleted!"
export const AccountStatusLocators = {
  accountCreated: '[data-qa="account-created"]',
  accountDeleted: '[data-qa="account-deleted"]',
  continueButton: '[data-qa="continue-button"]',
};
