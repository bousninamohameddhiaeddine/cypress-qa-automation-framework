import { CheckoutLocators as L } from "./locators";

// Champs du compte affichés dans une adresse (noms identiques à register-data.json)
const ADDRESS_FIELDS = [
  "firstName",
  "lastName",
  "company",
  "address",
  "address2",
  "city",
  "state",
  "zipcode",
  "country",
  "mobile",
];

// Page "Checkout" : https://automationexercise.com/checkout
class CheckoutPage {
  shouldBeVisible() {
    cy.url().should("include", "/checkout");
    cy.get(L.deliveryAddress).should("be.visible");
  }

  // L'adresse reprend chaque donnée saisie à l'inscription (u = utilisateur du JSON)
  shouldShowDeliveryAddress(u) {
    this.shouldShowAddress(L.deliveryAddress, u);
  }

  shouldShowBillingAddress(u) {
    this.shouldShowAddress(L.billingAddress, u);
  }

  shouldShowAddress(selector, u) {
    ADDRESS_FIELDS.forEach((field) => {
      cy.get(selector).should("contain.text", u[field]);
    });
  }

  shouldShowProductsInReview(count) {
    cy.get(L.reviewOrderRows).should("have.length", count);
  }

  placeOrder(comment) {
    cy.get(L.comment).fill(comment);
    cy.get(L.placeOrder).click();
    cy.url().should("include", "/payment");
  }
}

export default new CheckoutPage();
