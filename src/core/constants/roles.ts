export const ROLES = {
  ADMIN: "ADMIN",
  VET: "VET",
  CLIENT: "CLIENT",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
