import { Before } from "cypress-cucumber-preprocessor/steps";

Before({ tags: "@placeAnOrder" }, async () => {
  await cy.fixture("cardDetails").as("cardDetails");
  await cy.fixture("personalInfo").as("personalInfo");
});
