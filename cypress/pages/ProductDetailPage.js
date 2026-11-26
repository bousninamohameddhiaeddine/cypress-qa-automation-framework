import { ProductDetailLocators as L } from "./locators";

// Page de détail d'un produit : https://automationexercise.com/product_details/<id>
class ProductDetailPage {
  // Vérifie que toutes les informations du produit sont affichées
  shouldShowAllInformation() {
    cy.get(L.information).should("be.visible");
    ["name", "category", "price", "availability", "condition", "brand"].forEach((field) => {
      cy.get(L[field]).should("be.visible").invoke("text").should("not.be.empty");
    });
  }

  // ----- Panier -----

  // Garde le nom du produit dans l'alias @productName
  rememberName() {
    cy.get(L.name).invoke("text").as("productName", { type: "static" });
  }

  setQuantity(quantity) {
    cy.get(L.quantity).clear().type(String(quantity));
    cy.get(L.quantity).should("have.value", String(quantity));
  }

  // Clique sur "Add to cart" et ATTEND la réponse du serveur.
  // Sans cette attente, le test pouvait ouvrir le panier avant que l'ajout soit enregistré :
  // panier vide → QAP-50 passait à tort (alors qu'à la main le bug est visible).
  addToCart() {
    cy.intercept("GET", L.addToCartRequest).as("addToCartRequest");
    cy.get(L.addToCart).click();
    cy.wait("@addToCartRequest");
  }

  // ----- Avis -----

  // row = ligne du JSON (name, email, review)
  writeReview(row) {
    cy.get(L.reviewTitle).should("be.visible");
    cy.get(L.reviewName).fill(row.name);
    cy.get(L.reviewEmail).fill(row.email);
    cy.get(L.reviewText).fill(row.review);
    cy.get(L.reviewButton).click();
  }

  shouldShowReviewSuccess(message) {
    cy.get(L.reviewSuccess).should("be.visible").and("contain.text", message);
  }

  shouldNotShowReviewSuccess() {
    cy.shouldNotBeDisplayed(L.reviewSuccess);
  }

  // Validation HTML5 : "field" = nom du localisateur (ex. "reviewEmail")
  shouldHaveInvalidField(field) {
    cy.get(L[field]).shouldBeInvalid();
  }
}

export default new ProductDetailPage();
