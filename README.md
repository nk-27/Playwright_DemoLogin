# Playwright BDD Login Test Automation

This project demonstrates true Behavior-Driven Development (BDD) using Playwright and TypeScript for the Practice Test Automation login page. It utilizes the `playwright-bdd` library to execute Gherkin `.feature` files directly.

## Project Structure

```
├── features/
│   └── login.feature          # Gherkin BDD feature scenarios
├── support/
│   ├── page.ts                # Page Object Model (LoginPage class)
│   ├── steps.ts               # BDD Step Definitions mapping feature steps to code
│   ├── locators.ts            # Locator Manager
│   └── helpers.ts             # Reusable automation helper utilities
├── playwright.config.ts       # Playwright BDD Configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This documentation file
```

## Running Tests

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Playwright Specs
Before running the tests, compile the feature files into native Playwright spec files:
```bash
npx bddgen
```
*(This generates test files inside `.features-gen/` which is automatically ignored by Git).*

### 3. Run the Tests
Run all Gherkin scenarios with:
```bash
npx playwright test
npm install -D @playwright/test@latest
```
Or run the combined generator and test execution script:
```bash
npm run test:bdd
```

### 4. Running with Options
```bash
# Run tests in headed mode (to watch the browser action)
npx playwright test --headed

# Run in a specific browser (e.g., Chromium)
npx playwright test --project=chromium

# Open the HTML Test Report
npx playwright show-report
```

## How It Works

1. **Feature Files (`features/login.feature`)**:
   Tests are written in plain-text Gherkin syntax containing `Given`, `When`, `Then`, and `And` steps.
2. **Step Definitions (`support/steps.ts`)**:
   Uses `createBdd` from `playwright-bdd` to map each step to TypeScript code. It injects a custom `loginPage` fixture to interact with the Page Objects.
3. **Page Objects (`support/page.ts`)**:
   Encapsulates selectors and page actions (like `fillUsername`, `fillPassword`, `submitForm`) to ensure modularity.

## Test Site
Tests are executed against the Practice Test Automation portal:
https://practicetestautomation.com/practice-test-login/

