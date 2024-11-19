Feature: Custom Tags Management
  As a user
  I want to struture my notes with tag
  In order to facilitate their search

  Scenario: Creating tag
    Given I want to create a new tag
    When I enter the tag name
    Then the tag is created and available

  Scenario: Associating tag
    Given I create a note
    When I associate a tag
    Then the note is indexed with this tag