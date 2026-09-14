export function formatMoney(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

export function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function monthKey(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function lastSixMonths() {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "short" });
    months.push({ key, label });
  }
  return months;
}
