import "cypress-xpath";
import { Given, Then, And } from "cypress-cucumber-preprocessor/steps";
import {
  categories,
  selectItem,
  itemCost,
  reviewAndPay,
} from "../../locators/menu";
import {
  modalOverlay,
  selectSize,
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

And("I select an item from the menu", () => {
  const itemIndex = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

  // get total item types in the menu
  cy.get(categories)
    .get("li")
    .its("length")
    .then((count) => {
      return count;
    })
    .as("totalCategories");

  // select a random item type in the menu
  cy.get("@totalCategories").then((totalCategories) => {
    const index = itemIndex(1, totalCategories);
    cy.get(categories)
      .get("li")
      .eq(index)
      .then((option) => {
        return option.text();
      })
      .as("category");
    cy.get(categories)
      .get("li")
      .eq(index)
      .scrollIntoView()
      .click()
      .wait(2000);
  });

  // select a item in the list
  cy.get("@category").then((category) => {
    cy.get(selectItem(category))
      .its("length")
      .then((count) => {
        return count;
      })
      .as("totalItems");

    cy.get("@totalItems").then((totalItems) => {
      let index = 1;
      if (totalItems > 1) index = itemIndex(1, totalItems);
      if (index === 1) {
        cy.get(selectItem(category))
          .then((item) => {
            return item.text();
          })
          .as("selectedItem");
        cy.get(itemCost(category))
          .then((itemCost) => {
            return itemCost.text().split("£")[1];
          })
          .as("selectedItemCost");
        cy.wait(2000).get(selectItem(category)).click({ force: true });
      }
      if (index > 1) {
        cy.get(selectItem(category))
          .eq(index)
          .then((item) => {
            return item.text();
          })
          .as("selectedItem");

        cy.get(itemCost(category))
          .eq(index)
          .then((itemCost) => {
            return itemCost.text().split("£")[1];
          })
          .as("selectedItemCost");
        cy.wait(2000)
          .get(selectItem(category))
          .eq(index)
          .click({ force: true });
      }
    });
  });
});

And("I select the quantity {int}", (selectQuantity) => {
  cy.wait(2000).get(modalOverlay, { timeout: 5000 });
  cy.wait(2000)
    .document()
    .then((doc) => {
      return doc.body;
    })
    .then(cy.wrap)
    .as("wrapper");

  cy.get("@selectedItemCost").then((cost) => {
    const $cost = Cypress.$(selectSize(`£${cost.trim().replace("from", "")}`));
    cy.wrap($cost).click({ force: true });
  });

  cy.get("@wrapper").find(increaseQuantity()).click();
  cy.get("@wrapper")
    .find(quantity())
    .then((quantity) => {
      return quantity.text();
    })
    .as("selectedQuantity");
  cy.get("@selectedQuantity")
    .then((quantity) => {
      expect(selectQuantity).to.equal(Number(quantity));
    })
    .wait(1000);
});

Then("The order total should be calculated for the selected quantity", () => {
  cy.get("@wrapper")
    .find(addToOrder())
    .then((innerText) => {
      return innerText.text().split("£")[1].replace(")", "");
    })
    .as("orderTotal");
  cy.get("@selectedItemCost").then((selectedBeverageCost) => {
    cy.get("@selectedQuantity").then((selectedQuantity) => {
      cy.get("@orderTotal").then((orderTotal) => {
        const expectedOrderTotal =
          Number(selectedBeverageCost.replace("from", "")) *
          Number(selectedQuantity);
        expect(Number(orderTotal)).to.equal(expectedOrderTotal);
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
  cy.get("@selectedItem").then((selectedBeverage) => {
    cy.get("@wrapper")
      .find(orderTitle())
      .then((title) => {
        // expect(title.text()).contains(selectedBeverage)
      });
  });

  // assert order total
  cy.get("@orderTotal").then((calculatedOrderTotal) => {
    cy.get("@wrapper")
      .find(orderTotal())
      .then((total) => {
        expect(calculatedOrderTotal).to.equal(total.text().split("£")[1]);
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
