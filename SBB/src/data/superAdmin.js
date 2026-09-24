export const SUPER_ADMIN = {
  userid: "usr-super",
  first_name: "Ama",
  last_name: "Owusu",
  email: "admin@bookkeeply.app",
  password: "admin1234",
};

export function isSuperAdminEmail(email) {
  return String(email || "").trim().toLowerCase() === SUPER_ADMIN.email;
}

export function checkSuperAdminPassword(password) {
  return password === SUPER_ADMIN.password;
}
