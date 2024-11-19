Feature: Notification System
  As a user
  I want to be notified of relevant interactions
  In order to not miss anything important

  Scenario: Contact request notification
    Given someone sends me a contact request
    When the request is sent
    Then I receive a notification

  Scenario: Saved announcement notification
    Given I have saved an announcement
    When a new message is added to this announcement
    Then I receive a notification

  Scenario: Response notification
    Given I have responded to an announcement
    When someone adds a new response
    Then I receive a notification