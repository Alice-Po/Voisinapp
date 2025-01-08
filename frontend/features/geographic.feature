Feature: Geographic Management
  As a user
  I want to manage geographic settings
  So that I can control the reach of my notes

  Scenario: Set default visibility radius
    Given I am logged in as "user@example.com"
    When I go to "Geographic Settings"
    And I set default visibility radius to "5" kilometers
    And I click on "Save Settings"
    Then I should see "Settings saved successfully"
    And new notes should have "5" kilometers as default radius

  Scenario: Filter notes by location
    Given I am logged in as "user@example.com"
    When I set my current location to "123 Main Street"
    Then I should only see notes within my location's radius
    And I should see notes from neighboring areas 