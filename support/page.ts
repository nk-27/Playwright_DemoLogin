/**
 * Page Object Models for Playwright Tests
 */

import { Page } from "@playwright/test"
import { LocatorManager } from "./locators"
import {
  fillField,
  fillMultipleFields,
  clickElement,
  clickMultipleElements,
} from "./helpers"

// ===== INTERFACES =====

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginScenario extends LoginCredentials {
  description: string
  expectedError?: string
  shouldSucceed?: boolean
}

export interface LoginResult {
  success: boolean
  message?: string
  url?: string
}

// ===== PAGE OBJECT: Test Help (Registration Form) =====

export class testHelp {
  page: Page
  private locatorManager: LocatorManager

  constructor(page: Page) {
    this.page = page
    this.locatorManager = new LocatorManager()
    this.initializeLocators()
  }

  /**
   * Initialize all locators for registration form
   */
  private initializeLocators() {
    this.locatorManager.addLocators({
      joinButton: ".font-zen-body",
      firstName: '[data-testid="text-input-First Name"]',
      lastName: '[data-testid="text-input-Last Name"]',
      username: '[data-testid="text-input-Username"]',
      email: '[data-testid="email-input-Email"]',
      password: '[data-testid="password-input-Password"]',
      confirmPassword: '[data-testid="password-input-Password Confirmation"]',
      privacyPolicy: '[data-testid="consentedToTerms"]',
      electronicsSign: '[data-testid="consentedToCallMessage"]',
      createButton: '[data-testid="button-default"]',
    })
  }

  /**
   * Navigate to the site
   */
  async redirectToSite(site: string) {
    await this.page.goto(site)
  }

  /**
   * Complete registration form submission
   */
  async realTestLogin(
    inputFirstName: string,
    inputLastName: string,
    inputUserName: string,
    inputEmail: string,
    inputPassword: string,
  ) {
    // Click join button
    await clickElement(
      this.page,
      this.locatorManager.getLocator("joinButton"),
      0,
    )

    // Fill all form fields
    const selectorMap = {
      firstName: this.locatorManager.getLocator("firstName"),
      lastName: this.locatorManager.getLocator("lastName"),
      username: this.locatorManager.getLocator("username"),
      email: this.locatorManager.getLocator("email"),
      password: this.locatorManager.getLocator("password"),
      confirmPassword: this.locatorManager.getLocator("confirmPassword"),
    }

    const data = {
      firstName: inputFirstName,
      lastName: inputLastName,
      username: inputUserName,
      email: inputEmail,
      password: inputPassword,
      confirmPassword: inputPassword,
    }

    await fillMultipleFields(this.page, selectorMap, data)

    // Click all checkboxes and submit
    await clickMultipleElements(this.page, [
      this.locatorManager.getLocator("privacyPolicy"),
      this.locatorManager.getLocator("electronicsSign"),
      this.locatorManager.getLocator("createButton"),
    ])
  }
}

// ===== PAGE OBJECT: Login Page =====

export class LoginPage {
  page: Page
  private readonly usernameField = 'input[id="username"]'
  private readonly passwordField = 'input[id="password"]'
  private readonly submitButton = 'button[id="submit"]'
  private readonly errorMessage = "div#error"
  private readonly successMessage = "article strong"
  private readonly logoutButton = 'a[href*="practice-test-login"]'
  private readonly baseUrl =
    "https://practicetestautomation.com/practice-test-login/"
  private readonly successUrl =
    "https://practicetestautomation.com/logged-in-successfully/"

  constructor(page: Page) {
    this.page = page
  }

  // ===== GIVEN =====

  /**
   * Given: Navigate to the login page
   */
  async navigateToLoginPage() {
    await this.page.goto(this.baseUrl)
    await this.page.waitForLoadState("networkidle")
  }

  // ===== WHEN =====

  /**
   * When: Fill login form with credentials
   */
  async fillLoginForm(credentials: LoginCredentials) {
    await fillField(this.page, this.usernameField, credentials.username)
    await fillField(this.page, this.passwordField, credentials.password)
  }

  /**
   * When: Submit login form
   */
  async submitForm() {
    await clickElement(this.page, this.submitButton)
    await this.page.waitForLoadState("networkidle")
  }

  /**
   * When: Perform complete login with credentials
   */
  async login(credentials: LoginCredentials) {
    await this.fillLoginForm(credentials)
    await this.submitForm()
  }

  // ===== THEN =====

  /**
   * Then: Verify login result (success or error)
   */
  async verifyLoginResult(shouldSucceed: boolean): Promise<LoginResult> {
    if (shouldSucceed) {
      try {
        await this.page.waitForURL(this.successUrl, { timeout: 5000 })
        return {
          success: true,
          url: this.page.url(),
        }
      } catch (error) {
        return {
          success: false,
          message: "Did not navigate to success page",
        }
      }
    } else {
      const isErrorVisible = await this.isErrorMessageDisplayed()
      if (isErrorVisible) {
        const errorText = await this.getErrorMessage()
        return {
          success: true,
          message: errorText || "Error message displayed",
        }
      }
      return {
        success: false,
        message: "Error message not displayed",
      }
    }
  }

  /**
   * Then: Verify success flow (message + logout button)
   */
  async verifySuccessFlow() {
    const hasSuccessMessage = await this.verifySuccessMessage("congratulations")
    const isLogoutVisible = await this.isLogoutButtonVisible()
    return hasSuccessMessage && isLogoutVisible
  }

  /**
   * Then: Verify error message is displayed
   */
  async isErrorMessageDisplayed() {
    return await this.page.locator(this.errorMessage).isVisible()
  }

  /**
   * Then: Get error message text
   */
  async getErrorMessage() {
    return await this.page.textContent(this.errorMessage)
  }

  /**
   * Then: Verify success message contains text
   */
  async verifySuccessMessage(expectedText: string) {
    const successText = await this.page.textContent(this.successMessage)
    return (
      successText?.toLowerCase().includes(expectedText.toLowerCase()) || false
    )
  }

  /**
   * Then: Verify logout button is visible
   */
  async isLogoutButtonVisible() {
    return await this.page.locator(this.logoutButton).isVisible()
  }
}
