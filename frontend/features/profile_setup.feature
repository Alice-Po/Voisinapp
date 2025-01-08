Feature: Profile Setup
  As a new user
  I want to set up my profile
  So that I can be identified by my neighbors

  Scenario: Initial profile setup
    Given I am logged in as "user@example.com"
    And I am on the profile setup page
    When I fill in "Username" with "John Doe"
    And I fill in "Description" with "I love gardening"
    And I upload "profile.jpg" as my profile picture
    And I fill in "Address" with "123 Main Street"
    And I click on "Save Profile"
    Then I should see "Profile saved successfully"
    And I should be redirected to the home page

  Scenario: Add additional address
    Given I am logged in as "user@example.com"
    And I am on the profile page
    When I click on "Add Address"
    And I fill in "Additional Address" with "456 Second Street"
    And I click on "Save Address"
    Then I should see "Address added successfully"
    And I should see "456 Second Street" in my addresses list 