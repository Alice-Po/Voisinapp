Feature: Content Search
  As a user
  I want to search through notes
  So that I can find relevant information

  Scenario: Search by keyword
    Given I am logged in as "user@example.com"
    When I click on "Search"
    And I fill in "Search" with "market"
    Then I should see notes containing "market"

  Scenario: Search with multiple criteria
    Given I am logged in as "user@example.com"
    When I click on "Advanced Search"
    And I fill in "Keyword" with "event"
    And I select the tag "Events"
    And I set search radius to "3" kilometers
    And I click on "Search"
    Then I should see notes matching all criteria 