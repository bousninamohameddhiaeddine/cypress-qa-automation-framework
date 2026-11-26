import { FooterLocators as L } from "./locators";

// Pied de page présent sur toutes les pages : abonnement à l'infolettre
class Footer {
  shouldShowSubscription() {
    cy.get(L.subscriptionTitle).scrollIntoView().should("be.visible");
  }

  // options.paste = coller le courriel au lieu de le taper (voir fill() dans commands.js)
  subscribe(email, options = {}) {
    cy.get(L.subscribeEmail).scrollIntoView().fill(email, { paste: options.paste });
    cy.get(L.subscribeButton).click();
  }

  shouldShowSuccess(message) {
    cy.get(L.subscribeSuccess).should("be.visible").and("contain.text", message);
  }

  shouldNotShowSuccess() {
    cy.shouldNotBeDisplayed(L.subscribeSuccess);
  }

  // Validation HTML5 : "field" = nom du localisateur (ex. "subscribeEmail")
  shouldHaveInvalidField(field) {
    cy.get(L[field]).shouldBeInvalid();
  }
}

export default new Footer();
