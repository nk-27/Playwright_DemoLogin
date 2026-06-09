/**
 * Step Definitions for Login Feature
 * Maps Gherkin steps from login.feature to actual test functions
 */

import { LoginPage, LoginCredentials } from "./page"
import {
  fillField,
  clickElement,
  isElementVisible,
  getElementText,
  verifyTextContains,
  verifyUrlContains,
} from "./helpers"

// ===== CONTEXT OBJECT =====

export interface TestContext {
  loginPage: LoginPage
  lastError?: string
  lastUrl?: string
}

// ===== GIVEN STEP DEFINITIONS =====

/**
 * GIVEN: user is on the login page
 */
export async function givenUserIsOnLoginPage(context: TestContext) {
  await context.loginPage.navigateToLoginPage()
}

/**
 * GIVEN: user has valid credentials
 */
export async function givenUserHasValidCredentials(context: TestContext) {
  context.credentials = {
    username: "student",
    password: "Password123",
  }
}

// ===== WHEN STEP DEFINITIONS =====

/**
 * WHEN: user enters username
 */
export async function whenUserEntersUsername(
  context: TestContext,
  username: string,
) {
  await context.loginPage.fillLoginForm({
    username: username,
    password: context.currentPassword || "",
  })
  context.currentUsername = username
}

/**
 * WHEN: user enters password
 */
export async function whenUserEntersPassword(
  context: TestContext,
  password: string,
) {
  // Get current username from context or fill with empty
  const username = context.currentUsername || ""
  await context.loginPage.fillLoginForm({
    username: username,
    password: password,
  })
  context.currentPassword = password
}

/**
 * WHEN: user fills username and password
 */
export async function whenUserFillsCredentials(
  context: TestContext,
  credentials: LoginCredentials,
) {
  await context.loginPage.fillLoginForm(credentials)
  context.currentUsername = credentials.username
  context.currentPassword = credentials.password
}

/**
 * WHEN: user clicks the submit button
 */
export async function whenUserClicksSubmit(context: TestContext) {
  await context.loginPage.submitForm()
}

/**
 * WHEN: user performs complete login
 */
export async function whenUserPerformsCompleteLogin(
  context: TestContext,
  credentials: LoginCredentials,
) {
  await context.loginPage.login(credentials)
}

// ===== THEN STEP DEFINITIONS =====

/**
 * THEN: user should be redirected to success page
 */
export async function thenUserShouldBeRedirectedToSuccessPage(
  context: TestContext,
) {
  const result = await context.loginPage.verifyLoginResult(true)
  context.lastUrl = result.url
  return result.success
}

/**
 * THEN: user should see success message containing text
 */
export async function thenUserShouldSeeSuccessMessageContaining(
  context: TestContext,
  expectedText: string,
) {
  return await context.loginPage.verifySuccessMessage(expectedText)
}

/**
 * THEN: user should see logout button
 */
export async function thenUserShouldSeeLogoutButton(context: TestContext) {
  return await context.loginPage.isLogoutButtonVisible()
}

/**
 * THEN: user should see an error message
 */
export async function thenUserShouldSeeErrorMessage(context: TestContext) {
  const isVisible = await context.loginPage.isErrorMessageDisplayed()
  if (isVisible) {
    context.lastError = await context.loginPage.getErrorMessage()
  }
  return isVisible
}

/**
 * THEN: error message should contain text
 */
export async function thenErrorMessageShouldContain(
  context: TestContext,
  expectedText: string,
) {
  const errorText = await context.loginPage.getErrorMessage()
  return errorText?.includes(expectedText) || false
}

/**
 * THEN: user should be on success page
 */
export async function thenUserShouldBeOnSuccessPage(context: TestContext) {
  return await verifyUrlContains(
    context.loginPage.page,
    "logged-in-successfully",
  )
}

/**
 * THEN: user should remain on login page
 */
export async function thenUserShouldRemainOnLoginPage(context: TestContext) {
  return await verifyUrlContains(context.loginPage.page, "practice-test-login")
}

// ===== COMBINED SCENARIO FUNCTIONS =====

/**
 * Execute positive login scenario
 */
export async function executePositiveLoginScenario(context: TestContext) {
  const credentials: LoginCredentials = {
    username: "student",
    password: "Password123",
  }

  await givenUserIsOnLoginPage(context)
  await whenUserFillsCredentials(context, credentials)
  await whenUserClicksSubmit(context)

  const isRedirected = await thenUserShouldBeRedirectedToSuccessPage(context)
  const hasMessage = await thenUserShouldSeeSuccessMessageContaining(
    context,
    "Congratulations",
  )
  const hasLogout = await thenUserShouldSeeLogoutButton(context)

  return isRedirected && hasMessage && hasLogout
}

/**
 * Execute negative login scenario (invalid credentials)
 */
export async function executeNegativeLoginScenario(
  context: TestContext,
  username: string,
  password: string,
  expectedErrorText?: string,
) {
  await givenUserIsOnLoginPage(context)
  await whenUserFillsCredentials(context, { username, password })
  await whenUserClicksSubmit(context)

  const hasError = await thenUserShouldSeeErrorMessage(context)

  if (expectedErrorText) {
    const errorMatches = await thenErrorMessageShouldContain(
      context,
      expectedErrorText,
    )
    return hasError && errorMatches
  }

  return hasError
}
