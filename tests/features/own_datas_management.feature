Feature: Own datas Management
  As a user
  I want to manage my data
  In order to stay in control of my data

  Scenario: Change the visibility of my datas
    Given I am in my notes'vue in settings
    When I can see my notes
    And I can see my reactions
    Then I can modify the visbility of my notes
    And I can remove a reaction on a note