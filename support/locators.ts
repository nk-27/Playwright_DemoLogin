/**
 * Locator Manager - Centralized management of all UI element selectors
 */

export class LocatorManager {
  private locators: Record<string, string> = {}

  addLocator(name: string, selector: string) {
    this.locators[name] = selector
  }

  getLocator(name: string): string {
    return this.locators[name]
  }

  getAllLocators(): Record<string, string> {
    return this.locators
  }

  // Bulk add locators
  addLocators(locators: Record<string, string>) {
    Object.assign(this.locators, locators)
  }
}
