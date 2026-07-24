/**
 * Utility functions for authentication
 */

/**
 * Normalize email to lowercase and trim whitespace
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  return password.length >= 8
}