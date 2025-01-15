Feature: Tag Management
  As a user
  I want to organize notes with tags
  So that information is well categorized

  Background: logged in as registred user
    Given I am logged in as "registredUser"

  Scenario: Create new tag
    When I click on "Manage Tags"
    And I click on "New Tag"
    And I fill in "Tag Name" with "Events"
    And I click on "Create Tag"
    Then I should see "Tag created successfully"
    And I should see "Events" in the tags list

  Scenario: Add existing tag to note
    Given I have created a tag "Events"
    When I click on "New Note"
    And I fill in "Content" with "Neighborhood party!"
    And I select the tag "Events"
    And I click on "Send"
    Then I should see my note with the tag "Events" in the feed

  Scenario: Create and add new tag while writing note
    When I click on "New Note"
    And I fill in "Content" with "Important meeting"
    And I type "Meeting" in the tag field
    And I click on "Create new tag 'Meeting'"
    And I click on "Send"
    Then I should see my note with the tag "Meeting" in the feed
    And "Meeting" should be available in the tags list

  Scenario: Add multiple tags to note
    Given I have created a tag "Events"
    And I have created a tag "Important"
    When I click on "New Note"
    And I fill in "Content" with "Team building event"
    And I select the tag "Events"
    And I select the tag "Important"
    And I click on "Send"
    Then I should see my note with the tags "Events" and "Important" in the feed

  Scenario: Remove tag from note before sending
    Given I have created a tag "Events"
    When I click on "New Note"
    And I fill in "Content" with "Test note"
    And I select the tag "Events"
    And I click on the remove button for tag "Events"
    Then the tag "Events" should be removed from the note
    And I should still see "Events" in the available tags

  Scenario: Search existing tags
    Given I have created multiple tags
    When I click on "New Note"
    And I type "Eve" in the tag field
    Then I should see "Events" in the tag suggestions
    And I should not see "Meeting" in the tag suggestions

  Scenario: View notes by tag
    Given I have notes with different tags
    When I click on the tag "Events" in any note
    Then I should see only notes tagged with "Events"
    And I should see a filter indicator showing "Events"

  Scenario: Clear tag filter
    Given I am viewing notes filtered by tag "Events"
    When I click on the clear filter button
    Then I should see all notes
    And the filter indicator should be removed

  Scenario: Tag validation
    When I click on "New Tag"
    And I try to create a tag with empty name
    Then I should see an error message
    And the tag should not be created

  Scenario: Duplicate tag prevention
    Given I have created a tag "Events"
    When I click on "New Tag"
    And I fill in "Tag Name" with "Events"
    And I click on "Create Tag"
    Then I should see "Tag already exists"
    And no duplicate tag should be created 