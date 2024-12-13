Feature: Post a note
  As a logged-in user
  I want to be able to post a note with an image and an expiry date
  To share visual content with other users and control its temporal relevance

  Background: Logged user
    Given I'm logged with a valid user and I'm on homepage

  # Scenario: Post a valid note with a photo without specifying an expiry date
  #   When  I post a note with the text "Bonjour tout le monde ! Et Joyeux Noël !" and an image "photo.jpg"
  #   # Add emoji 
#     And I post my note 
  #   Then the note "Bonjour tout le monde ! Et Joyeux Noël !" with an image should appear in my News Feed immediatly.
  #   And I fast forward time by 31536000000 milliseconds.
  #   Then the message "Bonjour tout le monde ! Et Joyeux Noël !" should no longer be visible

 Scenario:  Post a valid note with a photo and specify an expiry date of one week
    When I write a weekly note and an image "habits-fille.jpeg"
    And I choose an expiration date a week later
    # Add emoji 
    And I post my note 
    Then years after the weekly note should no longer be visible

#  Scenario: Poster un note valide avec une photo sans date d'expiration
#     When I post a note with the text "Éducatrice Montessori certifiée 3-6 ans, je suis ouverte à de nouvelles collaborations" and an image "photo.jpg"
#     And I choose no expiration option
# And I post my note 
#     Then the note "Éducatrice Montessori certifiée 3-6 ans, je suis ouverte à de nouvelles collaborations" with an image should appear in my News Feed immediatly.
#     And I fast forward time by 1 century.
#     Then the message "Éducatrice Montessori certifiée 3-6 ans, je suis ouverte à de nouvelles collaborations" remains visible
    
# Scenario:  Post a valid note with a photo and a juste created tag
#   When I write a weekly note and an image "habits-fille.jpeg"
#   # And I choose an expiration date a week later
#   # Add emoji 
#   And I create a tag
#   Then the tag is available
#   And I select the tag
#   And I post my note 
#   Then the weekly note with an image should appear in my News Feed with a the visible tag



# when we read the created date ?