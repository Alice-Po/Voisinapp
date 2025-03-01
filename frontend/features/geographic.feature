Feature: Creating Geolocated Notes
  As a registred user with a defined location
  I want to create notes with geographic scope
  In order to share locally relevant content

  Background:
    Given I am logged in as "registredUser"
    And I have a location defined in my profile
    And I am on the homepage

  Scenario: Creating a note with default radius
    When I fill in "Content" with "My local note"
    And I submit the note
    Then I should see "Note sent successfully"
    Then I should see my note "My local note" with the name of my city and a radius at 15 kilometers

  Scenario: Customizing the broadcast radius
    When I fill in "Content" with "Note with custom radius"
    And I set the broadcast radius to 20 kilometers
    And I submit the note
    Then I should see "Note sent successfully"
    Then I should see my note "Note with custom radius" with the name of my city and a radius at 20 kilometers

  Scenario: Visibility based on radius
    And I should see "This is a geographic note from Sainte-Honorine-la-Guillaume" from nearby in my feed
    And I should cannot see "This is a geographic note from Sainte-Honorine-la-Guillaume" from far in my feed