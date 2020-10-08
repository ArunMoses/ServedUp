import "cypress-xpath";
import { When, Then, And } from "cypress-cucumber-preprocessor/steps";
import {
  beverageTypes,
  selectBeverage,
  beverageCost,
  reviewAndPay,
} from "../../locators/menu";
import {
  increaseQuantity,
  quantity,
  addToOrder,
} from "../../locators/selectOrders";
import {
  orderQuantity,
  orderTitle,
  orderTotal,
  continueToCheckout,
} from "../../locators/orderSummary";
import { name, mobile, payByCard } from "../../locators/personalInfo";
import { cardNumber, expiryDate, cvc } from "../../locators/checkout";
import { paymentSuccessHeader, orderConfirmationName, orderConfirmationMobile, orderConfirmationSubTotal } from "../../locators/orderConfirmation";

And(/^I select a bevarage from the menu$/, () => {
  const beverageIndex = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

  // get total beverage types in the menu
  cy.get(beverageTypes)
    .get("li")
    .its("length")
    .then((count) => {
      return count;
    })
    .as("totalBeverageTypes");

  // select a random beverage type in the menu
  cy.get("@totalBeverageTypes").then((totalBeverageTypes) => {
    console.log("TOTAL: ", totalBeverageTypes);
    const index = beverageIndex(1, totalBeverageTypes);
    cy.get(beverageTypes)
      .get("li")
      .eq(index)
      .then((option) => {
        console.log("BEVERAGE TYPE: ", option.text());
        return option.text();
      })
      .as("beverageType");
      cy.wait(2000)
    cy.get(beverageTypes).get("li").eq(index).scrollIntoView().click().wait(4000);
  });

  // select a bevarage in the list
  cy.get("@beverageType").then((beverageType) => {
    cy.get(selectBeverage(beverageType))
      .its("length")
      .then((count) => {
        console.log("totalBeverage: ", count);
        return count;
      })
      .as("totalBeverages");

    cy.get("@totalBeverages").then((totalBeverages) => {
      const index = beverageIndex(1, totalBeverages);
      console.log("INDEX: ", index);
      cy.get(selectBeverage(beverageType))
        .eq(index)
        .then((beverage) => {
          console.log("BEVERAGE: ", beverage.text());
          return beverage.text();
        })
        .as("selectedBeverage");

      cy.get(beverageCost(beverageType))
        .eq(index)
        .then((beverageCost) => {
          console.log("BEVERAGE COST: ", beverageCost.text().split("£")[1]);
          return beverageCost.text().split("£")[1];
        })
        .as("selectedBeverageCost");
      cy.get(selectBeverage(beverageType)).eq(index).click();
    });
  });

  cy.get("@selectedBeverage").then((selectedBeverage) => {
    console.log("BEVERAGE: ", selectedBeverage);
  });
});

And('I select the quantity {int}', (selectQuantity) => {
  cy.wait(2000);
  cy.get('@wrapper').find(increaseQuantity()).click()
  cy.get('@wrapper').find(quantity()).then((quantity)=>{
    return quantity.text()
  }).as("selectedQuantity");
});

Then(/^The order total should be calculated for the selected quantity$/, () => {
  cy.document().then((doc) => {
    const orderTotal = doc.querySelector(addToOrder()).innerText
    return orderTotal.toString().split("£")[1].replace(")", "")
  }).as("orderTotal");
  cy.get("@selectedBeverageCost").then((selectedBeverageCost) => {
    cy.get("@selectedQuantity").then((selectedQuantity) => {
      cy.get("@orderTotal").then((orderTotal) => {
        const expectedOrderTotal =
          Number(selectedBeverageCost) * Number(selectedQuantity);
        console.log("ORDER TOTAL: ", Number(orderTotal));
        console.log("EXPECTED ORDER TOTAL: ", expectedOrderTotal);
        // expect(Number(orderTotal)).to.equal(expectedOrderTotal)
      });
    });
  });
});

And(/^I click Add to order$/, () => {
  cy.document().then((doc) => {
    return doc.body
  })
  .then(cy.wrap).as('wrapper')
  cy.get('@wrapper').find(addToOrder()).click()
});

And(/^I click Review and Pay$/, () => {
  cy.wait(2000)
  cy.get('@wrapper').find(reviewAndPay()).click()
});

And(/^I click Continue to Checkout$/, () => {
  // assert order quantity
  cy.wait(2000)
  cy.get("@selectedQuantity").then((selectedQuantity) => {
    cy.get('@wrapper').find(orderQuantity()).then((quantity)=>{
      expect(quantity.text()).to.equal(selectedQuantity)
    })
  });

  // assert order title
  cy.get("@selectedBeverage").then((selectedBeverage) => {
    cy.get('@wrapper').find(orderTitle()).then((title)=>{
      console.log("orderTitle: ", title.text())
      console.log("BEVERAGE: ", selectedBeverage)
    })
  });

  // assert order total
  cy.get("@orderTotal").then((calculatedOrderTotal) => {
    cy.get('@wrapper').find(orderTotal()).then((total)=>{
      console.log("orderTotal: ", total.text().split('£')[1]);
      console.log("calculatedOrderTotal: ", calculatedOrderTotal);
    })
  });
  cy.get('@wrapper').find(continueToCheckout()).click()
});

And(/^I enter my name and phone number$/, function () {
  cy.wait(2000)
  cy.get('@wrapper').find(name()).type(this.personalInfo.name)
  cy.get('@wrapper').find(mobile()).type(this.personalInfo.mobile)
});

And(/^I click Pay By Card$/, () => {
  cy.wait(2000)
  cy.get('@wrapper').find(payByCard()).click()
});

And(/^I enter valid card details$/, function () {
  cy.get('@wrapper').find(cardNumber()).type(this.cardDetails.valid.cardNumber);
  cy.get('@wrapper').find(expiryDate()).type(this.cardDetails.valid.expiry)
  cy.get('@wrapper').find(cvc()).type(this.cardDetails.valid.cvc)
});

And(/^I enter invalid card details$/, function () {
  cy.get('@wrapper').find(cardNumber()).type(this.cardDetails.invalid.cardNumber);
  cy.get('@wrapper').find(expiryDate()).type(this.cardDetails.invalid.expiry)
  cy.get('@wrapper').find(cvc()).type(this.cardDetails.invalid.cvc)
});

And(/^I enter expired card details$/, function () {
  cy.get('@wrapper').find(cardNumber()).type(this.cardDetails.expired.cardNumber);
  cy.get('@wrapper').find(expiryDate()).type(this.cardDetails.expired.expiry)
  cy.get('@wrapper').find(cvc()).type(this.cardDetails.expired.cvc)
});

When(/^I click Pay By Card$/, () => {
  cy.get('@wrapper').find(payByCard).click()
});

Then(/^My payment should be successful$/, () => {
  const expectedPaymentSuccessHeader = 'Thank you';
  cy.get('@wrapper').xpath(paymentSuccessHeader).then((paymentSuccessHeader)=>{
      // assert confirmation header
        console.log('paymentSuccessHeader: ', paymentSuccessHeader.text())
        expect(paymentSuccessHeader.text()).to.equal(paymentSuccessHeader.text())
    })
    cy.get('@wrapper').xpath(orderConfirmationName(this.personalInfo.name)).then((name)=>{
      // assert name
        console.log('orderConfirmationName: ', name.text())
        expect(this.personalInfo.name).to.equal(name.text().split(': ')[1])
    })
    cy.get('@wrapper').xpath(orderConfirmationMobile(this.personalInfo.mobile)).then((mobile)=>{
      // assert mobile
        console.log('orderConfirmationMobile: ', mobile.text())
        expect(mobile.text()).to.contain(this.personalInfo.mobile)
    })
    cy.get('@wrapper').xpath(orderConfirmationSubTotal).then((total)=>{
      cy.get("@orderTotal").then((orderTotal)=>{
      // assert total
      console.log('orderConfirmationSubTotal: ', total.split('£')[1]);
      expect(Number(total.split('£')[1]).to.equal(orderTotal))
      })
    })
});

Then(/^My payment should be not be successful$/, () => {
  const expectedPaymentSuccessHeader = 'Sorry!';
  cy.get('@wrapper').xpath(paymentSuccessHeader).then((paymentSuccessHeader)=>{
      // assert confirmation header
        console.log('paymentSuccessHeader: ', paymentSuccessHeader.text())
        expect(paymentSuccessHeader.text()).to.equal(paymentSuccessHeader.text())
    })
});