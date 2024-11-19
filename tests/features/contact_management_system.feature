Feature: Contact Management System
  As a user
  I want to manage my contacts
  In order to interact with other users

  Scenario: Managing invitations
    Given I receive a contact invitation
    When a notification appears
    Then I can accept the invitation
    And I can ignore the invitation

  Scenario: Adding a contact
    Given I am on a user's profile
    When I click on "Send a contact request"
    Then a contact request is sent

  Scenario: Creating a circle
    Given I am in my contacts management
    When I create a new circle
    Then I can select contacts for this circle
    And I can name the circle