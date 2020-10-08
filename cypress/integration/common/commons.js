import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

Given(/^I am on served up home page$/, () => {
    cy.visit(Cypress.config().baseUrl);  
  });