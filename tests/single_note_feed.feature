Feature: Single Note Feed
  As a basic user
  I want to access a single news feed
  In order to simplify my navigation

  Scenario: Viewing the news feed
    Given I am on the main page
    When I browse the news feed
    Then I see public announcements within my geographic scope
    And I see private messages addressed to me
    And I can identify unread messages
    And I can distinguish between private and public announcements

  Scenario: Detailed message view
    Given I am on the news feed
    When I view an announcement
    Then I see the creation date and time
    And I see the author
    And I see the tag
    And I see the complete content

  Scenario: Interacting with a message
    Given I am viewing an announcement
    When I want to interact with the announcement
    Then I can write and send a response
    And I can read existing responses
    And I can contact the announcer