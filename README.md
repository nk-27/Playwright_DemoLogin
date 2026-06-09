# BDD Login Test Automation

This project demonstrates Behavior-Driven Development (BDD) using Playwright with TypeScript for the Practice Test Automation login page.

## Project Structure

```
├── features/
│   └── login.feature          # Gherkin BDD scenarios
├── support/
│   └── page.ts                # Page Object Model with LoginPage class
├── tests/
│   └── login.spec.ts          # Playwright test implementation with BDD Given/When/Then
├── testdata/
│   └── testdata.json          # Test data for all scenarios
├── playwright.config.ts       # Playwright configuration
└── README.md                  # This file
```

## BDD Feature Scenarios

The login feature covers:

1. **Positive Login Test** - Valid credentials login flow
2. **Negative Test - Invalid Username** - Error handling for wrong username
3. **Negative Test - Invalid Password** - Error handling for wrong password
4. **Complete Login Flow** - End-to-end login verification

## Test Data

All test credentials and scenarios are centralized in `testdata/testdata.json`:

```json
{
  "login": {
    "validCredentials": { "username": "student", "password": "Password123" },
    "invalidUsername": {
      "username": "incorrectUser",
      "password": "Password123"
    },
    "invalidPassword": {
      "username": "student",
      "password": "incorrectPassword"
    }
  }
}
```

## Page Object Model

The `LoginPage` class provides BDD-style methods:

- `navigateToLoginPage()` - **Given**: Navigate to login page
- `enterUsername(username)` - **When**: Enter username
- `enterPassword(password)` - **When**: Enter password
- `clickSubmit()` - **When**: Click submit
- `login(username, password)` - **When**: Complete login action
- `verifySuccessfulLogin()` - **Then**: Verify redirect to success page
- `isErrorMessageDisplayed()` - **Then**: Verify error display
- `getErrorMessage()` - **Then**: Get error message text
- `verifySuccessMessage(text)` - **Then**: Verify success message
- `isLogoutButtonVisible()` - **Then**: Verify logout button

## Running Tests

```bash
# To download and install all dependencies listed in a project's package.json file
npm install

# Run all login tests
npm test

# Run with specific browser
npm test -- --project=chromium

# Run with headed mode (view browser)
npm test -- --headed

# Open test report
npx playwright show-report
```

## BDD Structure

Each test follows the Given-When-Then format:

```typescript
test("Scenario: User login with valid credentials", async ({ page }) => {
  // Given: User is on the login page
  await loginPage.navigateToLoginPage()

  // When: User enters credentials and submits
  await loginPage.login(username, password)

  // Then: User should be logged in successfully
  const currentUrl = await loginPage.verifySuccessfulLogin()
  expect(currentUrl).toContain("logged-in-successfully")
})
```

## Test Website

Tests are run against: https://practicetestautomation.com/practice-test-login/
