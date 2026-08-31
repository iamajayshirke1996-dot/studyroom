/**
 * Access Control Configuration for Specialized Features
 */

// Authorized email list for MAANG 12-Week Prep Roadmap
export const ALLOWED_MAANG_EMAILS = [
  'iamajayshirke1996@gmail.com',
];

/**
 * Check if a user email has authorization to view/edit the MAANG 12-Week Prep Roadmap
 */
export function canAccessMaangPrep(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ALLOWED_MAANG_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}
