Feature: Contact Information Access
  As a user
  I want to manage contact information
  In order to facilitate interactions

  Scenario: Viewing information
    Given I view a profile
    When I look at contact information
    Then I see the available information

  Scenario: Contact request
    Given I view an unknown profile
    When I want to access information
    Then I can send a contact request