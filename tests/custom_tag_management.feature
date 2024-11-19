Feature: Custom Tags Management
  As a user
  I want to organize my messages with tags
  In order to facilitate their search

  Scenario: Creating tag
    Given I want to create a new tag
    When I enter the tag name
    Then the tag is created and available

  Scenario: Associating tag
    Given I create a message
    When I associate a tag
    Then the message is indexed with this tag