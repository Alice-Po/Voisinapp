Feature: Poster un message avec une photo
  En tant qu'utilisateur
  Je veux pouvoir me connecter et poster un message avec une photo
  Afin de partager du contenu visuel avec d'autres utilisateurs

  Scenario: Connexion et poster un message valide avec une photo
    Given je suis sur la page d'accueil
    When je clique sur "Connexion"
    And je sélectionne "localhost:3000"
    And je saisis le nom d'utilisateur "sylvain" et le mot de passe "test123!"
    And je clique sur "Se connecter"
    And je poste un message avec le texte "Bonjour tout le monde ! Et Joyeux Noël !" et une image "photo.jpg"
    Then le message "Bonjour tout le monde ! Et Joyeux Noël !" avec une image doit apparaître dans mon fil d'actualité
