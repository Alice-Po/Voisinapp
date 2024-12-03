Feature: Login registred user
  As a registered user
  I want to log in to the application

  Scenario: Login with valid credentials
    Given I am on the homepage
    When I click on the button "Connexion"
    And I select "localhost:3000"
    And I enter my username and password
    And I click on the button "Se connecter"
    Then I should be redirected to my inbox