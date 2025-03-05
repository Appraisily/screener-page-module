/**
 * Validates an email address using a comprehensive regex pattern
 * @param email - The email address to validate
 * @returns boolean - True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Normalizes an email address by trimming whitespace and converting to lowercase
 * @param email - The email address to normalize
 * @returns string - The normalized email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}