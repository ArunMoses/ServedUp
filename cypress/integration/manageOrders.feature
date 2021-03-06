
Feature: Manage orders

@placeAnOrder
    Scenario: Place an order with valid card details
        Given I am on served up home page
        And I select an item from the menu
        And I select the quantity 2
        Then The order total should be calculated for the selected quantity
        And I click Add to order
        And I click Review and Pay
        And I click Continue to Checkout
        And I enter my name and phone number
        And I click Pay By Card
        And I enter valid card details
        When I click Pay By Card
        Then My payment should be successful

@placeAnOrder
    Scenario: Place an order with invalid card details
        Given I am on served up home page
        And I select an item from the menu
        And I select the quantity 2
        Then The order total should be calculated for the selected quantity
        And I click Add to order
        And I click Review and Pay
        And I click Continue to Checkout
        And I enter my name and phone number
        And I click Pay By Card
        And I enter invalid card details
        And I click Pay By Card
        Then I should see 'Your card was declined.' error 

@placeAnOrder
    Scenario: Place an order with expired card details
        Given I am on served up home page
        And I select an item from the menu
        And I select the quantity 2
        Then The order total should be calculated for the selected quantity
        And I click Add to order
        And I click Review and Pay
        And I click Continue to Checkout
        And I enter my name and phone number
        And I click Pay By Card
        And I enter expired card details
        When I click Pay By Card
        Then I should see 'Your card has expired.' error 

@placeAnOrder
    Scenario: Place an order with card details with invalid cvc
        Given I am on served up home page
        And I select an item from the menu
        And I select the quantity 2
        Then The order total should be calculated for the selected quantity
        And I click Add to order
        And I click Review and Pay
        And I click Continue to Checkout
        And I enter my name and phone number
        And I click Pay By Card
        And I enter card details with incorrect cvc
        When I click Pay By Card
        Then I should see 'Your card\'s security code is incorrect.' error 
        