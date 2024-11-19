Feature: Geographic Sharing System
  As a user
  I want to manage the geographic scope of my messages
  In order to target my audience

  Scenario: Simple public note sharing
    Given I create a new note
    When I share it without specification
    Then the note is shared with default parameters

  Scenario: Geographic configuration
    Given I create a note
    When I configure the geography
    Then I can choose the reference address
    And I can define the geographic scope

# Maybe it's already done in own data management festure
  Scenario: Geographic modification
    Given I have published a note
    When I modify its parameters
    Then I can change the address and scope