export function formatMoney(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  });
}

export function formatUsd(value) {
  const amount = Number(value) || 0;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function toISODate(value = new Date()) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDaysISO(iso, days) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function startOfWeekISO(iso) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const weekday = date.getDay();
  const toMonday = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + toMonday);
  return toISODate(date);
}

export function weekDaysISO(weekStart) {
  return Array.from({ length: 7 }, (_, index) => addDaysISO(weekStart, index));
}

export function inWeek(iso, weekStart) {
  const end = addDaysISO(weekStart, 6);
  return Boolean(iso && weekStart && iso >= weekStart && iso <= end);
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

export function formatWeekdayDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatWeekRange(weekStart) {
  const start = new Date(`${weekStart}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  if (Number.isNaN(start.getTime())) return "";
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

export function summarizeLedger(items) {
  const income = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenses = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return { income, expenses, net: income - expenses, count: items.length };
}

export function badgeClass(status) {
  const key = String(status || "").toLowerCase();
  if (["paid", "income", "active", "success", "owner", "super_admin"].includes(key)) return `badge badge-${key === "success" || key === "owner" || key === "super_admin" ? "paid" : key}`;
  if (["sent", "draft", "partial", "admin", "pending"].includes(key)) return "badge badge-sent";
  if (["overdue", "expense", "cancelled", "failed", "expired", "unpaid"].includes(key)) return "badge badge-overdue";
  if (key === "suspended" || key === "staff") return "badge badge-suspended";
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
