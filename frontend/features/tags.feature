Feature: Tag Management
  As a user
  I want to organize notes with tags
  So that information is well categorized

  Scenario: Create new tag
    Given I am logged in as "user@example.com"
    When I click on "Manage Tags"
    And I click on "New Tag"
    And I fill in "Tag Name" with "Events"
    And I click on "Create Tag"
    Then I should see "Tag created successfully"
    And I should see "Events" in the tags list

  Scenario: Add tag to note
    Given I am logged in as "user@example.com"
    And I have created a tag "Events"
    When I click on "New Note"
    And I fill in "Content" with "Neighborhood party!"
    And I select the tag "Events"
    And I click on "Send"
    Then I should see my note with the tag "Events" in the feed 