import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from './page';
import { expect } from '@playwright/test';

// Set up the page object fixture for steps
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

const { Given, When, Then } = createBdd(test);

Given('user is on the login page', async ({ loginPage }) => {
  await loginPage.navigateToLoginPage();
});

When('user enters username {string}', async ({ loginPage }, username: string) => {
  await loginPage.fillUsername(username);
});

When('user enters password {string}', async ({ loginPage }, password: string) => {
  await loginPage.fillPassword(password);
});

When('user clicks the submit button', async ({ loginPage }) => {
  await loginPage.submitForm();
});

Then('user should be redirected to success page', async ({ page }) => {
  await expect(page).toHaveURL(/success/);
});
Then('user should see an error message', async ({ loginPage }) => {
  const hasError = await loginPage.isErrorMessageDisplayed();
  expect(hasError).toBe(true);
});
Then('error message should contain {string}', async ({ loginPage }, expectedText: string) => {
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain(expectedText);
});
Then('user should see success message containing {string}', async ({ loginPage }, expectedText: string) => {
  const hasMessage = await loginPage.verifySuccessMessage(expectedText);
  expect(hasMessage).toBe(true);
});
Then('user should see logout button', async ({ loginPage }) => {
  const hasLogout = await loginPage.isLogoutButtonVisible();
  expect(hasLogout).toBe(true);
});