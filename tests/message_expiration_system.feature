Feature: Message Expiration System
  As a user
  I want to manage the lifetime of my messages
  In order to control their temporal relevance

  Scenario: Custom expiration date
    Given I create a message
    When I set an expiration date
    Then the message expires on the specified date

  Scenario: Permanent message
    Given I create a message
    When I choose "no expiration"
    Then the message remains visible indefinitely