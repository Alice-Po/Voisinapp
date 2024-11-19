Feature: Security and Moderation
  As a user
  I want to contribute to platform security
  In order to maintain a safe space

  Scenario: Content reporting
    Given I see inappropriate content
    When I report it
    Then I can choose the reason
    And the content is sent for moderation