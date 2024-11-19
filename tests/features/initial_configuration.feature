Feature: Initial Configuration
  As a user
  I want to configure my basic preferences
  In order to have a personalized experience

  Background:
    Given I am logged into the application

  Scenario: Default settings configuration
    When I configure the application for the first time
    Then I can set my pseudonyme
    And I can set my description
    And I can set my picture
    And I can set my home address
    And I can set my phone number
    