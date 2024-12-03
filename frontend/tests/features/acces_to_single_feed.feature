Feature: Single Note Feed
  As a registred user
  I want to access a single news feed
  In order to simplify my navigation

  Background:
    Given I am logged in as a valid user
    And there are accessed notes in my single feed

#   Scenario: Viewing the news feed
#     Given I am on the main page
#     When I browse the news feed
#     Then I see public notes within my geographic scope
#     And I see private notes addressed to me
#     And I can identify unread notes
#     And I can distinguish between private and public announcements

#   Scenario: Detailed note view
#     Given I am on the news feed
#     When I view an note
#     Then I see the creation date and time
#     And I see the author
#     And I see the tag
#     And I see the complete content

#   Scenario: Interacting with a note
#     Given I am viewing an note
#     When I click on the note to interact with
#     Then I can write and send a response
#     And I can read existing responses
#     And I can contact the announcer