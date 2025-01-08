Feature: Note Management
  As a user
  I want to create and manage notes
  So that I can share information with my neighbors

  Scenario: Create simple note
    Given I am logged in as "user@example.com"
    When I click on "New Note"
    And I fill in "Content" with "Hello neighbors!"
    And I click on "Send"
    Then I should see "Note sent successfully"
    And I should see my note "Hello neighbors!" in the feed

  Scenario: Create note with image
    Given I am logged in as "user@example.com"
    When I click on "New Note"
    And I fill in "Content" with "Check out this event poster!"
    And I attach the file "event.jpg" to "Image upload"
    And I click on "Send"
    Then I should see "Note sent successfully"
    And I should see my note with the image in the feed

  Scenario: Create note with geographic scope
    Given I am logged in as "user@example.com"
    When I click on "New Note"
    And I fill in "Content" with "Local market today!"
    And I set the visibility radius to "2" kilometers
    And I click on "Send"
    Then I should see "Note sent successfully"
    And my note should be visible to users within 2 kilometers 