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
  // liens du menu (limités au menu : certains liens existent aussi ailleurs dans la page)
  productsLink: '.shop-menu a[href="/products"]',
  cartLink: '.shop-menu a[href="/view_cart"]',
  testCasesLink: '.shop-menu a[href="/test_cases"]',
  contactLink: '.shop-menu a[href="/contact_us"]',
};

// Pied de page : abonnement à l'infolettre (présent sur toutes les pages)
export const FooterLocators = {
  subscriptionTitle: 'footer h2:contains("Subscription")',
  subscribeEmail: "#susbscribe_email", // (sic) faute d'orthographe du site
  subscribeButton: "#subscribe",
  subscribeSuccess: "#success-subscribe",
};

// Page d'accueil (/)
export const HomeLocators = {
  heroTitle: '#slider-carousel .item.active h2:contains("Full-Fledged practice website for Automation Engineers")',
  scrollUpButton: "#scrollUp",
};

// Page "Test Cases" (/test_cases)
export const TestCasesLocators = {
  title: 'h2.title:contains("Test Cases")',
};

// Page "Contact Us" (/contact_us)
export const ContactLocators = {
  title: 'h2:contains("Get In Touch")',
  name: '[data-qa="name"]',
  email: '[data-qa="email"]',
  subject: '[data-qa="subject"]',
  message: '[data-qa="message"]',
  uploadFile: 'input[name="upload_file"]',
  submitButton: '[data-qa="submit-button"]',
  successMessage: ".contact-form .status.alert-success",
  homeButton: "#form-section a.btn-success",
};

// Page "All Products" (/products) et résultats de recherche / catégorie / marque
export const ProductsLocators = {
  pageTitle: ".features_items h2.title",
  productList: ".features_items",
  productCards: ".features_items .productinfo",
  productNames: ".features_items .productinfo p",
  firstViewProduct: '.features_items .choose a[href^="/product_details/"]',
  searchInput: "#search_product",
  searchButton: "#submit_search",
  // barre latérale : catégories et marques
  categoryPanel: "#accordian",
  categoryToggle: (category) => `#accordian a[href="#${category}"]`,
  subCategoryLink: (category, sub) => `#${category} a:contains("${sub}")`,
  brandsPanel: ".brands_products",
  brandLink: (brand) => `.brands-name a[href="/brand_products/${brand}"]`,
};

// Page de détail d'un produit (/product_details/<id>)
export const ProductDetailLocators = {
  information: ".product-information",
  name: ".product-information h2",
  category: '.product-information p:contains("Category")',
  price: ".product-information span span",
  availability: '.product-information p:contains("Availability")',
  condition: '.product-information p:contains("Condition")',
  brand: '.product-information p:contains("Brand")',
  // avis
  reviewTitle: 'a[href="#reviews"]:contains("Write Your Review")',
  reviewName: "#name",
  reviewEmail: "#email",
  reviewText: "#review",
  reviewButton: "#button-review",
  reviewSuccess: "#review-section .alert-success",
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
