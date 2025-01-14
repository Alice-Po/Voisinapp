Feature: Geographic scope for notes
  As a user
  I want to create notes with geographic scope
  So that only users within a certain radius can see them

  Background:
    Given I am logged in as "registredUser"
    Given I have a favorite address
    # Which have to be Putanges-le-Lac
    Given my favorite address is visible on my profil card

  Scenario: Create note with geographic scope and verify visibility
    And I fill in "Content" with "This is a geographic note from la Foret Auvray"
    And I set the visibility radius to "20" kilometers
    And I submit the note
    Then I should see my note "This is a geographic note from la Foret Auvray" in the feed with the name of the place of the emiter's favorite address and the visibility radius
    And I logout

    # Verify visibility for nearby user (5km away at Sainte-Honorine-la-Guillaume)
    When I am logged in as "nearbyUser"
    Given "nearbyUser" have a favorite address
    Then I should see the note "This is a geographic note from la Foret Auvray" in my feed
    And I should see "Putanges-le-Lac" as the note location with "20km" as radius

    # Verify invisibility for far user (in Paris)
    When I am logged in as "farUser"
    Given "nearbyUser" have a favorite address
    Then I should not see the note "This is a geographic note from la Foret Auvray" in my feed 