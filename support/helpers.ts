/**
 * Generic Helpers and Interfaces for Test Automation
 */

import { Page } from "@playwright/test"

// ===== GENERIC INTERFACES =====

export interface FormData {
  [key: string]: string
}

export interface GenericResult {
  success: boolean
  message?: string
  [key: string]: any
}

// ===== GIVEN - PAGE SETUP HELPERS =====

/**
 * GIVEN: Navigate to URL
 */
export async function navigateToUrl(page: Page, url: string) {
  await page.goto(url)
}

/**
 * GIVEN: Wait for page load
 */
export async function waitForPageLoad(
  page: Page,
  state: "load" | "domcontentloaded" | "networkidle" = "networkidle",
) {
  await page.waitForLoadState(state)
}

/**
 * GIVEN: Set page timeout
 */
export async function setPageTimeout(page: Page, timeoutMs: number) {
  page.setDefaultTimeout(timeoutMs)
}

// ===== WHEN - USER ACTION HELPERS =====

/**
 * WHEN: Fill a form field
 */
export async function fillField(
  page: Page,
  selector: string,
  value: string,
) {
  await page.fill(selector, value)
}

/**
 * WHEN: Click an element
 */
export async function clickElement(
  page: Page,
  selector: string,
  nthElement: number = 0,
) {
  await page.locator(selector).nth(nthElement).click()
}

/**
 * WHEN: Fill multiple fields at once using object mapping
 */
export async function fillMultipleFields(
  page: Page,
  selectorMap: Record<string, string>,
  dataMap: FormData,
) {
  for (const [fieldName, value] of Object.entries(dataMap)) {
    const selector = selectorMap[fieldName]
    if (selector) {
      await fillField(page, selector, value)
    }
  }
}

/**
 * WHEN: Click multiple elements
 */
export async function clickMultipleElements(
  page: Page,
  selectors: string[],
) {
  for (const selector of selectors) {
    await page.click(selector)
  }
}

/**
 * WHEN: Type text slowly to trigger event handlers
 */
export async function typeSlowly(
  page: Page,
  selector: string,
  text: string,
  delayMs: number = 50,
) {
  await page.click(selector)
  for (const char of text) {
    await page.keyboard.type(char)
    await page.waitForTimeout(delayMs)
  }
}

/**
 * WHEN: Submit a form
 */
export async function submitForm(page: Page, submitSelector: string) {
  await page.click(submitSelector)
}

/**
 * WHEN: Clear field and enter new value
 */
export async function clearAndFill(
  page: Page,
  selector: string,
  value: string,
) {
  await page.locator(selector).clear()
  await fillField(page, selector, value)
}

/**
 * WHEN: Select from dropdown
 */
export async function selectFromDropdown(
  page: Page,
  selector: string,
  value: string,
) {
  await page.selectOption(selector, value)
}

/**
 * WHEN: Check/uncheck checkbox
 */
export async function setCheckbox(
  page: Page,
  selector: string,
  checked: boolean,
) {
  const isChecked = await page.locator(selector).isChecked()
  if (isChecked !== checked) {
    await page.click(selector)
  }
}

// ===== THEN - VERIFICATION/ASSERTION HELPERS =====

/**
 * THEN: Wait for navigation with optional timeout
 */
export async function waitForNavigation(
  page: Page,
  urlPattern: string,
  timeoutMs: number = 5000,
) {
  try {
    await page.waitForURL(urlPattern, { timeout: timeoutMs })
    return {
      success: true,
      url: page.url(),
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to navigate to ${urlPattern}`,
    }
  }
}

/**
 * THEN: Check if element is visible
 */
export async function isElementVisible(
  page: Page,
  selector: string,
): Promise<boolean> {
  return await page.locator(selector).isVisible()
}

/**
 * THEN: Check if element is hidden
 */
export async function isElementHidden(
  page: Page,
  selector: string,
): Promise<boolean> {
  return await page.locator(selector).isHidden()
}

/**
 * THEN: Get text content from element
 */
export async function getElementText(
  page: Page,
  selector: string,
): Promise<string | null> {
  return await page.textContent(selector)
}

/**
 * THEN: Get all text from multiple elements
 */
export async function getAllElementsText(
  page: Page,
  selector: string,
): Promise<string[]> {
  return await page.locator(selector).allTextContents()
}

/**
 * THEN: Verify text contains expected substring (case-insensitive)
 */
export async function verifyTextContains(
  page: Page,
  selector: string,
  expectedText: string,
): Promise<boolean> {
  const text = await getElementText(page, selector)
  return text?.toLowerCase().includes(expectedText.toLowerCase()) || false
}

/**
 * THEN: Verify text equals expected value (case-insensitive)
 */
export async function verifyTextEquals(
  page: Page,
  selector: string,
  expectedText: string,
): Promise<boolean> {
  const text = await getElementText(page, selector)
  return text?.toLowerCase() === expectedText.toLowerCase() || false
}

/**
 * THEN: Verify attribute value
 */
export async function verifyAttribute(
  page: Page,
  selector: string,
  attribute: string,
  expectedValue: string,
): Promise<boolean> {
  const value = await page.locator(selector).getAttribute(attribute)
  return value === expectedValue
}

/**
 * THEN: Check if checkbox is checked
 */
export async function isCheckboxChecked(
  page: Page,
  selector: string,
): Promise<boolean> {
  return await page.locator(selector).isChecked()
}

/**
 * THEN: Get current URL
 */
export async function getCurrentUrl(page: Page): Promise<string> {
  return page.url()
}

/**
 * THEN: Verify current URL contains text
 */
export async function verifyUrlContains(
  page: Page,
  expectedText: string,
): Promise<boolean> {
  const url = await getCurrentUrl(page)
  return url.includes(expectedText)
}

/**
 * THEN: Wait for element to appear
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeoutMs: number = 5000,
): Promise<boolean> {
  try {
    await page.locator(selector).waitFor({ state: "visible", timeout: timeoutMs })
    return true
  } catch (error) {
    return false
  }
}

/**
 * THEN: Count elements matching selector
 */
export async function countElements(
  page: Page,
  selector: string,
): Promise<number> {
  return await page.locator(selector).count()
}

