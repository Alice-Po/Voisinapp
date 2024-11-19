Feature: Announcement Bookmarking
  As a user
  I want to save announcements
  In order to find them easily

  Scenario: Saving an announcement
    Given I am viewing an announcement
    When I click on "Save"
    Then the announcement is added to my favorites

  Scenario: Viewing saved announcements
    Given I am in my favorites
    When I check the list
    Then I see all my saved announcements

  Scenario: Removing from favorites
    Given I am viewing my saved announcements
    When I remove an announcement from favorites
    Then the announcement no longer appears in my list