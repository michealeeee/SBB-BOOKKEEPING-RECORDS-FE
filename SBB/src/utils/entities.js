export function personName(record) {
  return [record?.first_name, record?.last_name].filter(Boolean).join(" ").trim();
}

export function customerLabel(customer) {
  if (!customer) return "No customer";
  return customer.business_name || personName(customer) || customer.email || "Customer";
}

export function vendorLabel(vendor) {
  if (!vendor) return "Vendor";
  return vendor.business_name || vendor.contact_person || vendor.email || "Vendor";
}

export function userLabel(user) {
  return personName(user) || user?.email || "Account";
}
