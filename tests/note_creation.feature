Feature: Note Creation
  As a user
  I want to create different types of notes
  In order to share information

  Scenario: Creating text note
    Given I create a new note
    When I enter the text
    Then the note is created with the entered text

  Scenario: Adding attachment
    Given I create a new note
    When I add an attachment
    Then the attachment is added if it doesn't exceed the size limit

  Scenario: Adding emojis
    Given I create a new note
    When I add emojis
    Then the emojis are integrated into the text
