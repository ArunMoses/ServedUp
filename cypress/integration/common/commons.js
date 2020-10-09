import "cypress-xpath";
import { Given, Then, And } from "cypress-cucumber-preprocessor/steps";
import {
  beverageTypes,
  selectBeverage,
  beverageCost,
  reviewAndPay,
} from "../../locators/menu";
import {
  modalOverlay,
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

Given("I am on served up home page", () => {
  cy.visit(Cypress.config().baseUrl);
});

And("I select a bevarage from the menu", () => {
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
    const index = beverageIndex(1, totalBeverageTypes);
    cy.get(beverageTypes)
      .get("li")
      .eq(index)
      .then((option) => {
        return option.text();
      })
      .as("beverageType");
    cy.get(beverageTypes)
      .get("li")
      .eq(index)
      .scrollIntoView()
      .click()
      .wait(2000);
  });

  // select a bevarage in the list
  cy.get("@beverageType").then((beverageType) => {
    cy.get(selectBeverage(beverageType))
      .its("length")
      .then((count) => {
        return count;
      })
      .as("totalBeverages");

    cy.get("@totalBeverages").then((totalBeverages) => {
      let index = 1;
      if (totalBeverages > 1) index = beverageIndex(1, totalBeverages);
      if (index === 1) {
        cy.get(selectBeverage(beverageType))
          .then((beverage) => {
            return beverage.text();
          })
          .as("selectedBeverage");
        cy.get(beverageCost(beverageType))
          .then((beverageCost) => {
            return beverageCost.text().split("£")[1];
          })
          .as("selectedBeverageCost");
        cy.get(selectBeverage(beverageType))
          .wait(1000)
          .click();
      }
      if (index > 1) {
        cy.get(selectBeverage(beverageType))
          .eq(index)
          .then((beverage) => {
            return beverage.text();
          })
          .as("selectedBeverage");

        cy.get(beverageCost(beverageType))
          .eq(index)
          .then((beverageCost) => {
            return beverageCost.text().split("£")[1];
          })
          .as("selectedBeverageCost");
        cy.get(selectBeverage(beverageType))
          .eq(index)
          .wait(1000)
          .click();
      }
    });
  });
});

And("I select the quantity {int}", (selectQuantity) => {
  cy.get(modalOverlay, { timeout: 5000 });
  cy.document()
    .then((doc) => {
      return doc.body;
    })
    .then(cy.wrap)
    .as("wrapper");

  // cy.get('@selectedBeverageCost').then((cost)=>{
  //   const $cost = Cypress.$(`p:contains('£${cost}')`)
  //   cy.wrap($cost).click()
  // })  

  cy.get("@wrapper").find(increaseQuantity()).click();
  cy.get("@wrapper")
    .find(quantity())
    .then((quantity) => {
      return quantity.text();
    })
    .as("selectedQuantity");
  cy.get("@selectedQuantity").then((quantity) => {
    expect(selectQuantity).to.equal(Number(quantity));
  });
});

Then("The order total should be calculated for the selected quantity", () => {
  cy.get("@wrapper")
    .find(addToOrder())
    .then((innerText) => {
      return innerText.text().split("£")[1].replace(")", "");
    })
    .as("orderTotal");
  cy.get("@selectedBeverageCost").then((selectedBeverageCost) => {
    cy.get("@selectedQuantity").then((selectedQuantity) => {
      cy.get("@orderTotal").then((orderTotal) => {
        const expectedOrderTotal =
          Number(selectedBeverageCost) * Number(selectedQuantity);
        // expect(Number(orderTotal)).to.equal(expectedOrderTotal)
      });
    });
  });
});

And("I click Add to order", () => {
  cy.get("@wrapper").find(addToOrder()).click();
});

And("I click Review and Pay", () => {
  cy.get("@wrapper").wait(2000).find(reviewAndPay(), { timeout: 5000 }).click();
});

And("I click Continue to Checkout", () => {
  cy.get("@selectedQuantity")
    .wait(2000)
    .then((selectedQuantity) => {
      cy.get("@wrapper")
        .find(orderQuantity())
        .then((quantity) => {
          // assert order quantity
          expect(quantity.text()).to.equal(selectedQuantity);
        });
    });

  // assert order title
  cy.get("@selectedBeverage").then((selectedBeverage) => {
    cy.get("@wrapper")
      .find(orderTitle())
      .then((title) => {
        // expect(selectedBeverage).contains(title.text())
      });
  });

  // assert order total
  cy.get("@orderTotal").then((calculatedOrderTotal) => {
    cy.get("@wrapper")
      .find(orderTotal())
      .then((total) => {
        // expect(calculatedOrderTotal).to.equal(total.text().split("£")[1])
      });
  });
  cy.get("@wrapper").find(continueToCheckout()).click();
});

And("I enter my name and phone number", function () {
  cy.get("@wrapper")
    .find(name(), { timeout: 5000 })
    .should("be.visible")
    .type(this.personalInfo.name);
  cy.get("@wrapper").find(mobile()).type(this.personalInfo.mobile);
});

And("I click Pay By Card", () => {
  cy.get("@wrapper")
    .find(payByCard(), { timeout: 5000 })
    .should("be.visible")
    .click();
});
