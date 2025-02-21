Feature: Note Management
  As a user
  I want to create and manage notes
  So that I can share information with my neighbors

  Background: logged in as registred user
    Given I am logged in as "registredUser"

  Scenario: Create simple note
    And I fill in "Content" with "Hello neighbors!"
    And I submit the note
    Then I should see "Note sent successfully"
    And I should see my note "Hello neighbors!" in the feed

  Scenario: Create note with image
    And I fill in "Content" with "Check out this event poster!"
    And I attach the file "panda.jpeg"
    And I submit the note
    Then I should see "Note sent successfully"
    And I should see my note "Check out this event poster!" with the image in the feed

  Scenario: Create note with expiration date
    And I fill in "Content" with "Event this weekend!"
    And I choose an expiration date a week later
    And I submit the note
    Then I should see "Note sent successfully"
    And I should see my note with expiration date in the feed
    When the date is one week and one second later
    Then I should not see the note "Event this weekend!" in the feed

