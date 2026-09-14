export function formatMoney(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function badgeClass(status) {
  const key = String(status || "").toLowerCase();
  if (["paid", "income", "active"].includes(key)) return `badge badge-${key}`;
  if (["sent", "draft"].includes(key)) return `badge badge-${key}`;
  if (["overdue", "expense", "cancelled"].includes(key)) return `badge badge-${key}`;
  if (key === "suspended") return "badge badge-suspended";
  return "badge";
}
