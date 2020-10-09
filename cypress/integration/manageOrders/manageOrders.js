import "cypress-xpath";
import { Then, And } from "cypress-cucumber-preprocessor/steps";
import {
  cardPaymentiFrame,
  cardNumber,
  expiryDate,
  cvc,
  cardError,
} from "../../locators/checkout";
import {
  paymentSuccessHeader,
  orderConfirmationName,
  orderConfirmationMobile,
  orderConfirmationSubTotal,
} from "../../locators/orderConfirmation";

And("I enter valid card details", function () {
  cy.get("@wrapper").find(cardPaymentiFrame(), { timeout: 5000 });
  cy.wait(1000)
    .getWithinIframe(cardNumber())
    .type(this.cardDetails.valid.cardNumber);
  cy.getWithinIframe(expiryDate()).type(this.cardDetails.valid.expiry);
  cy.wait(1000).getWithinIframe(cvc()).type(this.cardDetails.valid.cvc);
});

And("I enter invalid card details", function () {
  cy.get("@wrapper").find(cardPaymentiFrame(), { timeout: 5000 });
  cy.wait(1000)
    .getWithinIframe(cardNumber())
    .type(this.cardDetails.invalid.cardNumber);
  cy.getWithinIframe(expiryDate()).type(this.cardDetails.invalid.expiry);
  cy.wait(1000).getWithinIframe(cvc()).type(this.cardDetails.invalid.cvc);
});

And("I enter expired card details", function () {
  cy.get("@wrapper").find(cardPaymentiFrame(), { timeout: 5000 });
  cy.wait(1000)
    .getWithinIframe(cardNumber())
    .type(this.cardDetails.expired.cardNumber);
  cy.getWithinIframe(expiryDate()).type(this.cardDetails.expired.expiry);
  cy.wait(1000).getWithinIframe(cvc()).type(this.cardDetails.expired.cvc);
});

And("I enter card details with incorrect cvc", function () {
  cy.get("@wrapper").find(cardPaymentiFrame(), { timeout: 5000 });
  cy.wait(1000)
    .getWithinIframe(cardNumber())
    .type(this.cardDetails.incorrect_cvc.cardNumber);
  cy.getWithinIframe(expiryDate()).type(this.cardDetails.incorrect_cvc.expiry);
  cy.wait(1000).getWithinIframe(cvc()).type(this.cardDetails.incorrect_cvc.cvc);
});

Then("My payment should be successful", function () {
  const expectedPaymentSuccessHeader = "Thank you";
  cy.xpath(paymentSuccessHeader(), { timeout: 8000 }).then(
    (paymentSuccessHeader) => {
      // assert header
      expect(paymentSuccessHeader.text()).to.equal(paymentSuccessHeader.text());
    }
  );
  cy.xpath(orderConfirmationName(this.personalInfo.name)).then((name) => {
    // assert name
    expect(this.personalInfo.name).to.equal(name.text().split(": ")[1]);
  });
  cy.xpath(orderConfirmationMobile()).then((mobile) => {
    // assert mobile
    expect(mobile.text()).to.contain(
      `+44${this.personalInfo.mobile.substring(1)}`
    );
  });
  cy.get("@wrapper")
    .find(orderConfirmationSubTotal())
    .then((total) => {
      cy.get("@orderTotal").then((orderTotal) => {
        // assert total
        expect(total.text().split("£")[1]).to.equal(orderTotal);
      });
    });
});

Then("I should see {string} error", (error) => {
  cy.get("@wrapper")
    .find(cardError(), { timeout: 8000 })
    .should("be.visible")
    .then((cardError) => {
      // assert error
      expect(error).to.equal(cardError.text());
    });
});
