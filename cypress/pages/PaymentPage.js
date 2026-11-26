import { PaymentLocators as L } from "./locators";

// Champs de la carte (noms identiques à checkout-data.json → "card" et payment-data.json)
const CARD_FIELDS = ["nameOnCard", "cardNumber", "cvc", "expiryMonth", "expiryYear"];

// Page "Payment" : https://automationexercise.com/payment
class PaymentPage {
  // Remplit la carte avec des données valides.
  // override = { field, value } pour remplacer UN champ (cas négatifs QAP-49, QAP-84)
  fillCard(card, override = {}) {
    CARD_FIELDS.forEach((field) => {
      const value = field === override.field ? override.value : card[field];
      cy.get(L[field]).fill(value, { log: field !== "cardNumber" && field !== "cvc" });
    });
  }

  submit() {
    cy.get(L.payButton).click();
  }

  // Paiement complet avec une carte valide
  pay(card) {
    this.fillCard(card);
    this.submit();
  }

  // Valeur réellement contenue dans un champ (le site peut bloquer ou couper la saisie)
  fieldValue(field) {
    return cy.get(L[field]).invoke("val");
  }

  shouldShowOrderPlaced(message) {
    cy.get(L.orderPlaced).should("be.visible");
    cy.get(L.confirmationMessage).should("contain.text", message);
  }

  // Critère "paiement refusé".
  // Quand le site accepte un paiement, il affiche d'abord "Your order has been placed
  // successfully!" sur la page de paiement, PUIS passe à la page "Order Placed!".
  // Vérifier tout de suite après le clic donnait un faux "refusé" (test vert à tort).
  // On laisse donc au site le temps de réagir (3 s), puis on vérifie qu'AUCUN signe
  // d'acceptation n'est apparu.
  // (Une attente fixe est justifiée ici : on veut prouver que quelque chose n'arrive PAS.)
  shouldNotShowOrderPlaced() {
    cy.wait(3000);
    cy.shouldNotBeDisplayed(L.paymentSuccess);
    cy.shouldNotBeDisplayed(L.orderPlaced);
    cy.url().should("not.include", "payment_done");
  }

  // Validation HTML5 : "field" = nom du champ (ex. "cvc")
  shouldHaveInvalidField(field) {
    cy.get(L[field]).shouldBeInvalid();
  }

  downloadInvoice() {
    cy.get(L.downloadInvoice).click();
  }

  continue() {
    cy.get(L.continueButton).click();
  }
}

export default new PaymentPage();
