/**
 * Subdomain utilities for multi-tenant routing
 */

// Reserved subdomains that cannot be used by businesses
const RESERVED_SUBDOMAINS = [
  'admin',
  'api',
  'app',
  'www',
  'mail',
  'ftp',
  'portal',
  'dashboard',
  'login',
  'signup',
  'auth',
  'static',
  'assets',
  'cdn',
  'support',
  'help',
  'billing',
  'docs',
  'blog',
  'status',
  'dev',
  'staging',
  'test',
  'demo',
  'sandbox',
];

/**
 * Generate a URL-safe slug from a company name
 */
export function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if a subdomain is reserved
 */
export function isReservedSubdomain(slug: string): boolean {
  return RESERVED_SUBDOMAINS.includes(slug.toLowerCase());
}

/**
 * Validate a subdomain slug
 * Returns error message if invalid, null if valid
 */
export function validateSubdomain(slug: string): string | null {
  if (!slug) {
    return 'Subdomain is required';
  }

  if (slug.length < 3) {
    return 'Subdomain must be at least 3 characters';
  }

  if (slug.length > 63) {
    return 'Subdomain must be less than 63 characters';
  }

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    return 'Subdomain can only contain lowercase letters, numbers, and hyphens';
  }

  if (isReservedSubdomain(slug)) {
    return 'This subdomain is reserved. Please choose another.';
  }

  return null;
}

/**
 * Extract subdomain from hostname
 * Returns null if no subdomain or if it's www
 */
export function getSubdomainFromHost(host: string): string | null {
  // Remove port if present
  const hostname = host.split(':')[0];

  // Handle localhost specially
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  // Handle *.localhost (e.g., acme.localhost)
  if (hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '');
    if (subdomain && subdomain !== 'www') {
      return subdomain;
    }
    return null;
  }

  // Handle regular domains (e.g., acme.yoursaas.com)
  const parts = hostname.split('.');

  // Need at least 3 parts for subdomain (subdomain.domain.tld)
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Ignore www as it's not a tenant subdomain
    if (subdomain !== 'www') {
      return subdomain;
    }
  }

  return null;
}

/**
 * Get the base domain from the current host
 * e.g., "acme.yoursaas.com" -> "yoursaas.com"
 * e.g., "acme.localhost:3000" -> "localhost:3000"
 */
export function getBaseDomain(host: string): string {
  const hostname = host.split(':')[0];
  const port = host.includes(':') ? `:${host.split(':')[1]}` : '';

  // Handle localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `localhost${port}`;
  }

  if (hostname.endsWith('.localhost')) {
    return `localhost${port}`;
  }

  // Handle regular domains
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    // Return domain.tld
    return parts.slice(-2).join('.') + port;
  }

  return host;
}

/**
 * Build a full URL with subdomain
 */
export function buildSubdomainUrl(
  slug: string,
  path: string,
  host: string,
  protocol: string = 'http'
): string {
  const baseDomain = getBaseDomain(host);

  // For localhost, use slug.localhost
  if (baseDomain.startsWith('localhost')) {
    return `${protocol}://${slug}.${baseDomain}${path}`;
  }

  // For production domains
  return `${protocol}://${slug}.${baseDomain}${path}`;
}

/**
 * Build the main domain URL (without subdomain)
 */
export function buildMainDomainUrl(
  path: string,
  host: string,
  protocol: string = 'http'
): string {
  const baseDomain = getBaseDomain(host);
  return `${protocol}://${baseDomain}${path}`;
}

/**
 * Check if current request is from main domain (no subdomain)
 */
export function isMainDomain(host: string): boolean {
  return getSubdomainFromHost(host) === null;
}
