Feature: Poster un message avec une photo
  En tant qu'utilisateur
  Je veux pouvoir me connecter et poster un message avec une photo
  Afin de partager du contenu visuel avec d'autres utilisateurs

  Scenario: Connexion et poster un message valide avec une photo
    Given I am on the homepage
    When I click on the button "Connexion"
    And I select "localhost:3000"
    And I enter my username and password
    And I click on the button "Se connecter"
    And je poste un message avec le texte "Bonjour tout le monde ! Et Joyeux Noël !" et une image "photo.jpg"
    # Add emoji 
    Then le message "Bonjour tout le monde ! Et Joyeux Noël !" avec une image doit apparaître dans mon fil d'actualité
