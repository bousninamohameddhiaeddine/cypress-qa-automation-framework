// =====================================================================
// LOCALISATEURS — tous les sélecteurs du site au même endroit.
// Si le site change un sélecteur, on le modifie ICI seulement.
// Les Page Objects (cypress/pages/*.js) importent ce fichier.
// =====================================================================

// Menu en haut de toutes les pages
export const HeaderLocators = {
  logo: 'img[alt="Website for automation practice"]',
  // Liens du menu, limités au menu (.shop-menu) : certains liens existent aussi ailleurs
  // dans la page (ex. "Register / Login" dans la fenêtre cachée du panier → 2 éléments trouvés)
  signupLoginLink: '.shop-menu a[href="/login"]',
  logoutLink: '.shop-menu a[href="/logout"]',
  deleteAccountLink: '.shop-menu a[href="/delete_account"]',
  loggedInAs: '.shop-menu a:contains("Logged in as")',
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
  // section "Recommended items" en bas de page (carrousel : on cible l'élément visible)
  recommendedTitle: ".recommended_items h2.title",
  recommendedActiveCard: "#recommended-item-carousel .item.active .productinfo",
  cardName: "p",
  cardAddToCart: "a.add-to-cart",
};

// Fenêtre "Added!" qui s'ouvre après un ajout au panier
export const CartModalLocators = {
  modal: "#cartModal",
  continueShopping: "#cartModal button.close-modal",
  viewCart: '#cartModal a[href="/view_cart"]',
};

// Page "Shopping Cart" (/view_cart)
export const CartLocators = {
  rows: "#cart_info_table tbody tr",
  rowName: ".cart_description h4 a",
  rowPrice: ".cart_price p",
  rowQuantity: ".cart_quantity button",
  rowTotal: ".cart_total_price",
  rowDelete: ".cart_quantity_delete",
  emptyCart: '#empty_cart:contains("Cart is empty!")',
  proceedToCheckout: ".check_out",
  // fenêtre "Checkout" affichée si l'utilisateur n'est pas connecté
  checkoutModal: "#checkoutModal",
  checkoutModalLogin: '#checkoutModal a[href="/login"]',
};

// Page "Checkout" (/checkout)
export const CheckoutLocators = {
  deliveryAddress: "#address_delivery",
  billingAddress: "#address_invoice",
  reviewOrderRows: "#cart_info tbody tr[id^='product-']",
  comment: 'textarea[name="message"]',
  placeOrder: 'a[href="/payment"]',
};

// Page "Payment" (/payment) et confirmation de commande
export const PaymentLocators = {
  nameOnCard: '[data-qa="name-on-card"]',
  cardNumber: '[data-qa="card-number"]',
  cvc: '[data-qa="cvc"]',
  expiryMonth: '[data-qa="expiry-month"]',
  expiryYear: '[data-qa="expiry-year"]',
  payButton: '[data-qa="pay-button"]',
  // message vert affiché SUR la page de paiement dès que le paiement est accepté,
  // juste avant le passage à la page "Order Placed!"
  paymentSuccess: '.alert-success:contains("Your order has been placed successfully!")',
  orderPlaced: '[data-qa="order-placed"]',
  confirmationMessage: '[data-qa="order-placed"] + p',
  downloadInvoice: 'a[href^="/download_invoice/"]',
  continueButton: '[data-qa="continue-button"]',
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
  addToCartButtons: ".features_items .productinfo a.add-to-cart",
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
  quantity: "#quantity",
  addToCart: ".product-information button.cart",
  // requête envoyée au serveur par le bouton "Add to cart" (ex. /add_to_cart/1?quantity=4)
  addToCartRequest: "**/add_to_cart/**",
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
