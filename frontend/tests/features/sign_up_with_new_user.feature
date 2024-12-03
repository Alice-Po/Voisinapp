Feature: Sign up with a new user
  As a new user
  I want to create an annount
  So that I can login to the app

  Scenario: Creating an account
    Given I am on the homepage
    When I click on the button "S'inscrire"
    And I select "localhost:3000"
    And I enter my unique identifier, my email and my password
    And I click on the button "S'inscrire"
    Then I should be able to create my profil with my pronoun, my bio, and a avatar
    And I click on the button "Enregistrer"
    Then I am redirected of "Authorisation required" prompt
    And I click on the button "Accepter"
    Then I am redirected to my single feed
