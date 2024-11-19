Feature: Multi-criteria Search
  As a user
  I want to search for messages
  According to different criteria

  Scenario: Keyword and location search
    Given I am in the search
    When I enter keywords and a location
    Then matching results are displayed

  Scenario: Tag search
    Given I click on a tag
    When the search is performed
    Then I see all messages with this tag

  Scenario: Multiple filters
    Given I am in the search
    When I apply multiple filters
    Then I can filter by:
      | geographic scope |
      | visibility      |
      | date           |