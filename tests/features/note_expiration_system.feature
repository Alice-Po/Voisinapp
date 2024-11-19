Feature: Note Expiration System
  As a user
  I want to manage the lifetime of my notes
  In order to control their temporal relevance

  Scenario: Custom expiration date
    Given I create a note
    When I set an expiration date
    Then the note expires on the specified date

  Scenario: Permanent note
    Given I create a note
    When I choose "no expiration"
    Then the note remains visible indefinitely