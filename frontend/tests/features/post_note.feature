Feature: Post a note
  As a logged-in user
  I want to be able to post a message

  Background:
    Given I am logged in as a valid user
    And there are accessed notes in my single feed

  # Scenario: Login and post a valid message with a photo
  #   When I post a message with text "Hello everyone!" and an image "photo.jpg"
  #   Then the message "Hello everyone!" with the image should appear in my feed