Feature: Privacy Management
  As a user
  I want to manage my privacy
  In order to protect my information

  Scenario: Visibility configuration
    Given I am in settings
    When I modify my privacy
    Then only authorized information is visible