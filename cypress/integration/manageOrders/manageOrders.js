import "cypress-xpath";
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import {
  beverageTypes,
  selectBeverage,
  beverageCost,
  reviewAndPay,
} from "../../locators/menu";
import {
  toggleQuantity,
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
        return option.text();
      })
      .as("beverageType");
    cy.get(beverageTypes).get("li").eq(index).click().wait(1000);
  });

  // select a bevarage in the list
  cy.get("@beverageType").then((beverageType) => {
    console.log("BEVERAGE TYPE: ", beverageType);
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

And(/^I select the quantity {int}$/, (selectQuantity) => {
  console.log("Quantity1: ", selectQuantity);
  const increaseQuantityButtonIndex = 2;
  cy.get(toggleQuantity).eq(increaseQuantityButtonIndex).click();
  cy.get(quantity)
    .then((selectQuantity) => {
      console.log("Quantity2: ", selectQuantity.text());
      //assert quantity increase
    })
    .as("selectedQuantity");
});

Then(/^The order total should be calculated for the selected quantity$/, () => {
  cy.xpath(addToOrder)
    .then((orderTotal) => {
      console.log(
        "Order Total: ",
        orderTotal.text().split("£").replace(")", "")
      );
      return orderTotal.text().split("£").replace(")", "");
    })
    .as("orderTotal");

  cy.get("@selectedBeverageCost").then((selectedBeverageCost) => {
    cy.get("@selectedQuantity").then((selectedQuantity) => {
      cy.get("@orderTotal").then((calculatedOrderTotal) => {
        const orderTotal =
          Number(selectedBeverageCost) * Number(selectedQuantity);
        console.log("ORDER TOTAL: ", orderTotal);
        console.log("CALCULATED ORDER TOTAL: ", calculatedOrderTotal);
        // Assert both equal
      });
    });
  });
});

And(/^I click Add to order$/, () => {
  cy.xpath(addToOrder).click();
});

And(/^I click Review and Pay$/, () => {
  cy.xpath(reviewAndPay).click();
});

And(/^I click Continue to Checkout$/, () => {
  // assert order quantity
  cy.get("@selectedQuantity").then((selectedQuantity) => {
    cy.xpath(orderQuantity).then((orderQuantity) => {
      console.log("orderQuantity: ", orderQuantity.text());
      console.log("selectedQuantity: ", selectedQuantity);
    });
  });

  // assert order title
  cy.get("@selectedBeverage").then((selectedBeverage) => {
    cy.xpath(orderTitle).then((orderTitle) => {
      console.log("orderTitle: ", orderTitle.text());
      console.log("BEVERAGE: ", selectedBeverage);
    });
  });

  // assert order total
  cy.get("@orderTotal").then((calculatedOrderTotal) => {
    cy.xpath(orderTotal).then((orderTotal) => {
      console.log("orderTotal: ", orderTotal);
      console.log("calculatedOrderTotal: ", calculatedOrderTotal);
    });
  });

  cy.xpath(continueToCheckout).click();
});

And(/^I enter my name and phone number$/, function () {
    cy.get(name).type(this.personalInfo.name)
    cy.get(mobile).type(this.personalInfo.mobile)
});

And(/^I click Pay By Card$/, () => {
    cy.get(payByCard).click()
});

And(/^I enter valid card details$/, function () {
    cy.get(cardNumber).type(this.cardDetails.valid.cardNumber);
    cy.get(expiryDate).type(this.cardDetails.valid.expiry)
    cy.get(cvc).type(this.cardDetails.valid.cvc)
});

And(/^I enter invalid card details$/, function () {
  cy.get(cardNumber).type(this.cardDetails.invalid.cardNumber);
  cy.get(expiryDate).type(this.cardDetails.invalid.expiry)
  cy.get(cvc).type(this.cardDetails.invalid.cvc)
});

And(/^I enter expired card details$/, function () {
  cy.get(cardNumber).type(this.cardDetails.expired.cardNumber);
  cy.get(expiryDate).type(this.cardDetails.expired.expiry)
  cy.get(cvc).type(this.cardDetails.expired.cvc)
});

When(/^I click Pay By Card$/, () => {
    cy.get(payByCard).click()
});

Then(/^My payment should be successful$/, () => {
    cy.xpath(paymentSuccessHeader).then((paymentSuccessHeader)=>{
      // assert confirmation header
        console.log('paymentSuccessHeader: ', paymentSuccessHeader.text());
    })

    cy.xpath(orderConfirmationName(this.personalInfo.name)).then((name)=>{
      // assert name
        console.log('orderConfirmationName: ', name.text());
    })

    cy.xpath(orderConfirmationMobile(this.personalInfo.mobile)).then((mobile)=>{
      // assert mobile
        console.log('orderConfirmationMobile: ', mobile.text());
    })

    cy.xpath(orderConfirmationSubTotal).then((total)=>{
      // assert total
        console.log('orderConfirmationSubTotal: ', total);
    })
});

Then(/^My payment should be not be successful$/, () => {

});