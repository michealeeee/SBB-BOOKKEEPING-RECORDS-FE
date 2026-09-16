export const SUPER_ADMIN = {
  name: "Super Admin",
  email: "admin@bookkeeply.app",
  password: "SuperAdmin1",
};

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isSuperAdminEmail(email) {
  return normalizeEmail(email) === SUPER_ADMIN.email;
}

export function isSuperAdmin(user) {
  return user?.role === "super_admin" || isSuperAdminEmail(user?.email);
}

export function isAdminPassword(password) {
  return password === SUPER_ADMIN.password;
}
