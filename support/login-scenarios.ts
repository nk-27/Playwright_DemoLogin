/**
 * Login-specific utility functions and scenario execution
 */

import { LoginPage, LoginCredentials, LoginScenario, LoginResult } from "./page"

/**
 * Execute a login scenario and verify the result
 */
export async function executeLoginScenario(
  loginPage: LoginPage,
  scenario: LoginScenario,
): Promise<LoginResult> {
  const credentials: LoginCredentials = {
    username: scenario.username,
    password: scenario.password,
  }

  await loginPage.login(credentials)
  const result = await loginPage.verifyLoginResult(scenario.shouldSucceed ?? true)

  if (!result.success) {
    return result
  }

  // If expecting error, verify error text matches
  if (!scenario.shouldSucceed && scenario.expectedError) {
    const errorText = await loginPage.getErrorMessage()
    if (!errorText?.includes(scenario.expectedError)) {
      return {
        success: false,
        message: `Expected error "${scenario.expectedError}" but got "${errorText}"`,
      }
    }
  }

  // If expecting success, verify success flow
  if (scenario.shouldSucceed) {
    const successFlowValid = await loginPage.verifySuccessFlow()
    if (!successFlowValid) {
      return {
        success: false,
        message: "Success flow verification failed",
      }
    }
  }

  return {
    success: true,
    message: `Scenario: ${scenario.description} - PASSED`,
  }
}

/**
 * Run multiple login scenarios in sequence
 */
export async function executeLoginScenarios(
  loginPage: LoginPage,
  scenarios: LoginScenario[],
): Promise<LoginResult[]> {
  const results: LoginResult[] = []

  for (const scenario of scenarios) {
    await loginPage.navigateToLoginPage() // Reset for each scenario
    const result = await executeLoginScenario(loginPage, scenario)
    results.push(result)
  }

  return results
}
