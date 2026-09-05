import { UserFeaturePermissions } from "../types";

export const ADMIN_EMAILS = [
  "iamajayshirke1996@gmail.com",
  "unnatipatil900@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (normalized.includes("unnati") || normalized.includes("patil")) {
    return true;
  }
  return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === normalized);
}

export function getDefaultPermissions(email: string): UserFeaturePermissions {
  const isAdmin = isAdminEmail(email);
  return {
    email,
    isAdmin,
    features: {
      maangPrep: isAdmin,
      stepsTracker: isAdmin,
      jobTracker: isAdmin,
      youtubeShorts: isAdmin,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function hasFeatureAccess(
  userPerms: UserFeaturePermissions | null | undefined,
  featureKey: keyof UserFeaturePermissions["features"],
  userEmail?: string | null,
): boolean {
  if (userEmail && isAdminEmail(userEmail)) return true;
  if (!userPerms) return false; // Default OFF for new users until admin enables
  return userPerms.features ? userPerms.features[featureKey] === true : false;
}
