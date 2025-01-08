Feature: User Authentication
  As a user of VoisinApp
  I want to manage my authentication
  So that I can access my personal space securely

  Scenario: User registration
    Given I am on the registration page
    When I select "localhost:3000"
    And I enter my unique identifier, my email and my password
    And I should be able to create my profil with my pronoun, my bio, and a avatar
    Then I am redirected of "Authorisation required" prompt
    And I click on the button "Accepter"

  Scenario: User login
    Given I am on the login page
    When I select "localhost:3000"
    And I enter my username and password
    Then I should be redirected to my inbox

  Scenario: Already logged user
    Given I'm logged with a valid user and I'm on homepage 