Feature: Notification System
  As a user
  I want to be notified of relevant interactions
  In order to not miss anything important

  Scenario: Contact request notification
    Given someone sends me a contact request
    When the request is sent
    Then I receive a notification

  Scenario: Saved note notification
    Given I have saved an note
    When a new note is added to this note
    Then I receive a notification

  Scenario: Response notification
    Given I have responded to an note
    When someone adds a new response
    Then I receive a notification