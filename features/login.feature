Feature: Practice Test Automation Login

  Background:
    Given user is on the login page

  Scenario: Positive Test - User successfully login with valid credentials
    When user enters username "student"
    And user enters password "Password123"
    And user clicks the submit button
    Then user should be redirected to success page
    And user should see success message containing "Congratulations"
    And user should see logout button

  Scenario: Negative Test - Invalid Username
    When user enters username "incorrectUser"
    And user enters password "Password123"
    And user clicks the submit button
    Then user should see an error message
    And error message should contain "Your username is invalid!"

  Scenario: Negative Test - Invalid Password
    When user enters username "student"
    And user enters password "incorrectPassword"
    And user clicks the submit button
    Then user should see an error message
    And error message should contain "Your password is invalid!"

  Scenario: Empty Username Test
    When user enters username ""
    And user enters password "Password123"
    And user clicks the submit button
    Then user should see an error message

  Scenario: Empty Password Test
    When user enters username "student"
    And user enters password ""
    And user clicks the submit button
    Then user should see an error message
