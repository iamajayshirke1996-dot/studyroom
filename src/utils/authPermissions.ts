/**
 * Access Control Configuration for Specialized Features
 */

export const ALLOWED_MAANG_EMAILS = [
  'iamajayshirke1996@gmail.com',
];

/**
 * Check if a user email has authorization to view/edit the MAANG 12-Week Prep Roadmap
 * Open and editable to EVERYONE!
 */
export function canAccessMaangPrep(_email?: string | null): boolean {
  return true;
}
