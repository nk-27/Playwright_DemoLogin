/**
 * Login Test Suite
 * Linked to: features/login.feature
 * Step Definitions: support/step-definitions.ts
 *
 * This test file maps BDD scenarios from the feature file
 * to actual test implementations using step definitions.
 */

import { test, expect } from "@playwright/test"
import { LoginPage } from "../support/page"
import {
  TestContext,
  givenUserIsOnLoginPage,
  whenUserEntersUsername,
  whenUserEntersPassword,
  whenUserClicksSubmit,
  thenUserShouldBeRedirectedToSuccessPage,
  thenUserShouldSeeSuccessMessageContaining,
  thenUserShouldSeeLogoutButton,
  thenUserShouldSeeErrorMessage,
  thenErrorMessageShouldContain,
  executePositiveLoginScenario,
  executeNegativeLoginScenario,
} from "../support/step-definitions"

/**
 * Feature: Practice Test Automation Login
 * Feature File: features/login.feature
 */
test.describe("Login Feature", () => {
  let context: TestContext

  test.beforeEach(async ({ page }) => {
    context = {
      loginPage: new LoginPage(page),
    }
  })

  /**
   * Scenario: Positive Test - User successfully login with valid credentials
   * Location: features/login.feature:5-10
   */
  test("Scenario: Positive Test - User successfully login with valid credentials", async () => {
    // GIVEN: user is on the login page
    await givenUserIsOnLoginPage(context)

    // WHEN: user enters username "student"
    // AND: user enters password "Password123"
    // AND: user clicks the submit button
    await context.loginPage.fillLoginForm({
      username: "student",
      password: "Password123",
    })
    await whenUserClicksSubmit(context)

    // THEN: user should be redirected to success page
    const isRedirected = await thenUserShouldBeRedirectedToSuccessPage(context)
    expect(isRedirected).toBeTruthy()

    // AND: user should see success message containing "Congratulations"
    const hasMessage = await thenUserShouldSeeSuccessMessageContaining(
      context,
      "Congratulations",
    )
    expect(hasMessage).toBeTruthy()

    // AND: user should see logout button
    const hasLogout = await thenUserShouldSeeLogoutButton(context)
    expect(hasLogout).toBeTruthy()
  })

  /**
   * Scenario: Negative Test - Invalid Username
   * Location: features/login.feature:12-17
   */
  test("Scenario: Negative Test - Invalid Username", async () => {
    // Execute negative login scenario
    const result = await executeNegativeLoginScenario(
      context,
      "incorrectUser",
      "Password123",
      "Your username is invalid!",
    )
    expect(result).toBeTruthy()
  })

  /**
   * Scenario: Negative Test - Invalid Password
   * Location: features/login.feature:19-24
   */
  test("Scenario: Negative Test - Invalid Password", async () => {
    // Execute negative login scenario
    const result = await executeNegativeLoginScenario(
      context,
      "student",
      "incorrectPassword",
      "Your password is invalid!",
    )
    expect(result).toBeTruthy()
  })

  /**
   * Scenario: Empty Username Test
   * Location: features/login.feature:26-31
   */
  test("Scenario: Empty Username Test", async () => {
    await givenUserIsOnLoginPage(context)
    await context.loginPage.fillLoginForm({
      username: "",
      password: "Password123",
    })
    await whenUserClicksSubmit(context)

    const hasError = await thenUserShouldSeeErrorMessage(context)
    expect(hasError).toBeTruthy()
  })

  /**
   * Scenario: Empty Password Test
   * Location: features/login.feature:33-38
   */
  test("Scenario: Empty Password Test", async () => {
    await givenUserIsOnLoginPage(context)
    await context.loginPage.fillLoginForm({
      username: "student",
      password: "",
    })
    await whenUserClicksSubmit(context)

    const hasError = await thenUserShouldSeeErrorMessage(context)
    expect(hasError).toBeTruthy()
  })
})
