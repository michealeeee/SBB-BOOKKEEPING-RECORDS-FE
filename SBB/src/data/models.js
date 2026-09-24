/** Bookkeeping models 1–12. Ownership lives on the business, not the signed-in user. */

export const MODELS = [
  {
    key: "user",
    number: 1,
    name: "User",
    ownsRecords: false,
    summary: "A person who can log in. Password stays on the backend and is never stored in the books UI.",
    fields: [
      { name: "userid", label: "userid", required: false, formRequired: false, generated: true },
      { name: "first_name", label: "First name", required: false, formRequired: true },
      { name: "last_name", label: "Last name", required: false, formRequired: false },
      { name: "email", label: "Email", required: true, formRequired: true, unique: true },
      { name: "password", label: "Password", required: false, formRequired: true, frontend: false },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "business",
    number: 2,
    name: "Business",
    ownsRecords: true,
    summary: "Company workspace. The owner creates it at registration. The backend generates businessid.",
    fields: [
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "name", label: "Business name", required: true, formRequired: true },
      { name: "email", label: "Email", required: false, formRequired: false },
      { name: "phone", label: "Phone", required: false, formRequired: false },
      { name: "address", label: "Address", required: false, formRequired: false },
      { name: "created_by", label: "created_by", required: true, formRequired: false, generated: true },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "businessMember",
    number: 3,
    name: "BusinessMember",
    ownsRecords: false,
    summary: "Connects a User to a Business. The first member is the owner. Owner/admin can add staff.",
    fields: [
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "userid", label: "userid", required: true, formRequired: false, generated: true },
      { name: "role", label: "Role", required: false, formRequired: true, choices: ["owner", "admin", "staff"], defaultValue: "staff" },
      { name: "active", label: "Active", required: false, formRequired: false, defaultValue: true },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "customer",
    number: 4,
    name: "Customer",
    ownsRecords: true,
    bookkeeping: true,
    summary: "Customers belong to the logged-in business. The UI does not ask which business to use.",
    fields: [
      { name: "customerid", label: "customerid", required: false, formRequired: false, generated: true },
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "first_name", label: "First name", required: false, formRequired: false },
      { name: "last_name", label: "Last name", required: false, formRequired: false },
      { name: "business_name", label: "Business name", required: false, formRequired: false },
      { name: "email", label: "Email", required: false, formRequired: false },
      { name: "phone_number", label: "Phone number", required: false, formRequired: false },
      { name: "address", label: "Address", required: false, formRequired: false },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
    identityRule: "Provide first_name or business_name.",
  },
  {
    key: "invoice",
    number: 5,
    name: "Invoice",
    ownsRecords: true,
    bookkeeping: true,
    summary: "Belongs to the business and can optionally link to a customer.",
    fields: [
      { name: "customer_id", label: "Customer", required: false, formRequired: false, nullable: true },
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "invoice_no", label: "Invoice no", required: false, formRequired: false, generated: true },
      { name: "amount", label: "Amount", required: false, formRequired: true },
      { name: "due_date", label: "Due date", required: false, formRequired: false },
      { name: "status", label: "Status", required: false, formRequired: false, choices: ["paid", "unpaid", "partial"], defaultValue: "unpaid" },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "income",
    number: 6,
    name: "Income",
    ownsRecords: true,
    bookkeeping: true,
    summary: "Money received by the business. Can optionally link to an invoice.",
    fields: [
      { name: "incomeid", label: "incomeid", required: false, formRequired: false, generated: true },
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "invoiceid", label: "Invoice", required: false, formRequired: false, nullable: true },
      { name: "source", label: "Source", required: false, formRequired: true },
      { name: "amount", label: "Amount", required: false, formRequired: true },
      { name: "description", label: "Description", required: false, formRequired: false },
      { name: "transaction_date", label: "Transaction date", required: true, formRequired: true },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "expense",
    number: 7,
    name: "Expense",
    ownsRecords: true,
    bookkeeping: true,
    summary: "Money spent by the business, such as rent, salary, or utilities.",
    fields: [
      { name: "expenseid", label: "expenseid", required: false, formRequired: false, generated: true },
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "category", label: "Category", required: false, formRequired: true },
      { name: "amount", label: "Amount", required: false, formRequired: true },
      { name: "description", label: "Description", required: false, formRequired: false },
      { name: "expense_date", label: "Expense date", required: false, formRequired: true },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "vendor",
    number: 8,
    name: "Vendor",
    ownsRecords: true,
    bookkeeping: true,
    summary: "Suppliers of goods or services to the business.",
    fields: [
      { name: "vendorid", label: "vendorid", required: false, formRequired: false, generated: true },
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "business_name", label: "Business name", required: false, formRequired: true },
      { name: "contact_person", label: "Contact person", required: false, formRequired: false },
      { name: "email", label: "Email", required: false, formRequired: false },
      { name: "phone", label: "Phone", required: false, formRequired: false },
      { name: "address", label: "Address", required: false, formRequired: false },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "plan",
    number: 9,
    name: "Plan",
    ownsRecords: false,
    summary: "System-wide subscription plans with price, billing cycle, and customer/invoice/user limits.",
    fields: [
      { name: "planid", label: "planid", required: false, formRequired: false, generated: true },
      { name: "name", label: "Name", required: false, formRequired: false },
      { name: "price", label: "Price", required: false, formRequired: false },
      { name: "billing_cycle", label: "Billing cycle", required: false, formRequired: false, choices: ["monthly", "yearly"] },
      { name: "max_customers", label: "Max customers", required: false, formRequired: false },
      { name: "max_invoices", label: "Max invoices", required: false, formRequired: false },
      { name: "max_users", label: "Max users", required: false, formRequired: false },
      { name: "active", label: "Active", required: false, formRequired: false, defaultValue: true },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "subscription",
    number: 10,
    name: "Subscription",
    ownsRecords: true,
    summary: "Belongs to the business. Every member uses this plan, subject to their role.",
    fields: [
      { name: "subscriptionid", label: "subscriptionid", required: false, formRequired: false, generated: true },
      { name: "businessid", label: "businessid", required: true, formRequired: false, generated: true },
      { name: "planid", label: "planid", required: false, formRequired: false },
      { name: "status", label: "Status", required: false, formRequired: false, choices: ["active", "expired", "cancelled", "pending"] },
      { name: "start_date", label: "Start date", required: false, formRequired: false },
      { name: "end_date", label: "End date", required: false, formRequired: false },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
      { name: "updated_at", label: "updated_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "subscriptionPayment",
    number: 11,
    name: "SubscriptionPayment",
    ownsRecords: false,
    summary: "Payment transactions for the business subscription.",
    fields: [
      { name: "paymentid", label: "paymentid", required: false, formRequired: false, generated: true },
      { name: "userid", label: "userid", required: false, formRequired: false },
      { name: "subscriptionid", label: "subscriptionid", required: false, formRequired: false },
      { name: "amount", label: "Amount", required: false, formRequired: false },
      { name: "payment_method", label: "Payment method", required: false, formRequired: false },
      { name: "transaction_reference", label: "Transaction reference", required: false, formRequired: false },
      { name: "status", label: "Status", required: false, formRequired: false, choices: ["success", "pending", "failed"] },
      { name: "created_at", label: "created_at", required: false, formRequired: false, generated: true },
    ],
  },
  {
    key: "relationship",
    number: 12,
    name: "Overall relationship",
    ownsRecords: false,
    summary: "User → BusinessMember → Business → bookkeeping data. Customer, invoice, income, expense, and vendor records use businessid, never userid, as the owner.",
    fields: [],
  },
];

export const MODEL_BY_KEY = Object.fromEntries(MODELS.filter((model) => model.key !== "relationship").map((model) => [model.key, model]));

export function modelFields(key) {
  return MODEL_BY_KEY[key]?.fields || [];
}

export function formRequiredFields(key) {
  return modelFields(key).filter((field) => field.formRequired && field.frontend !== false);
}

export function documentRequiredFields(key) {
  return modelFields(key).filter((field) => field.required);
}

function isBlank(value) {
  if (value == null) return true;
  if (typeof value === "number") return Number.isNaN(value);
  if (typeof value === "boolean") return false;
  return String(value).trim() === "";
}

export function missingFormFields(key, data) {
  return formRequiredFields(key)
    .filter((field) => isBlank(data?.[field.name]))
    .map((field) => field.label);
}

export function validateFormRecord(key, data) {
  const missing = missingFormFields(key, data);
  if (missing.length === 0) return { ok: true };
  const list = missing.join(", ");
  return {
    ok: false,
    error: missing.length === 1 ? `${list} is required.` : `${list} are required.`,
  };
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
