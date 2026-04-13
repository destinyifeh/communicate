/**
 * Phone number utility functions
 */

/**
 * Normalize a phone number to E.164 format
 * Handles Nigerian numbers specifically:
 * - 09033662731 → +2349033662731
 * - 2349033662731 → +2349033662731
 * - +2349033662731 → +2349033662731
 * - 080... → +23480...
 */
export function normalizePhoneNumber(phone: string, defaultCountryCode = '234'): string {
  if (!phone) return phone;

  // Remove all non-digit characters except leading +
  let normalized = phone.replace(/[^\d+]/g, '');

  // If it starts with +, it's already in international format
  if (normalized.startsWith('+')) {
    return normalized;
  }

  // Nigerian local numbers start with 0 (e.g., 0903, 0803, 0705)
  if (normalized.startsWith('0') && normalized.length === 11) {
    // Remove leading 0 and add country code
    return `+${defaultCountryCode}${normalized.substring(1)}`;
  }

  // If it's already the country code + number without +
  if (normalized.startsWith(defaultCountryCode) && normalized.length >= 13) {
    return `+${normalized}`;
  }

  // If it's just digits without country code (e.g., 9033662731)
  if (normalized.length === 10 && !normalized.startsWith('0')) {
    return `+${defaultCountryCode}${normalized}`;
  }

  // Default: add + if not present
  if (!normalized.startsWith('+')) {
    normalized = `+${normalized}`;
  }

  return normalized;
}

/**
 * Format phone number for display
 * +2349033662731 → +234 903 366 2731
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return phone;

  const normalized = normalizePhoneNumber(phone);

  // Nigerian format
  if (normalized.startsWith('+234') && normalized.length === 14) {
    const country = normalized.slice(0, 4); // +234
    const area = normalized.slice(4, 7);     // 903
    const first = normalized.slice(7, 10);   // 366
    const last = normalized.slice(10);       // 2731
    return `${country} ${area} ${first} ${last}`;
  }

  // US format
  if (normalized.startsWith('+1') && normalized.length === 12) {
    const country = normalized.slice(0, 2);  // +1
    const area = normalized.slice(2, 5);     // 415
    const first = normalized.slice(5, 8);    // 523
    const last = normalized.slice(8);        // 8886
    return `${country} (${area}) ${first}-${last}`;
  }

  return normalized;
}

/**
 * Validate if a phone number is in valid E.164 format
 */
export function isValidE164(phone: string): boolean {
  // E.164 format: + followed by 1-15 digits
  return /^\+[1-9]\d{6,14}$/.test(phone);
}
