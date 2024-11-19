Feature: Announcement Reactions
  As a user
  I want to react to messages
  In order to express my interest

  Scenario: Managing reactions
    Given I view a message
    When I click on a reaction
    Then the reaction is added or removed
    And I see the total number of reactions

  Scenario: Viewing reactions
    Given I view a message
    When I look at the reactions
    Then I see who reacted
    And I see which reactions were used