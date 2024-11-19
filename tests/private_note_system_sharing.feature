Feature: Private Note Sharing System
  As a user
  I want to control the visibility of my notes
  In order to target specific recipients

  Scenario: Sharing with selected contacts
    Given I create a private note
    When I select recipients
    Then only selected recipients can see the note

  Scenario: Sharing with a circle
    Given I create a private note
    When I select a circle
    Then all circle members can see the note

  Scenario: Modifying visibility
    Given I have a private note
    When I modify its visibility
    Then the new parameters are applied