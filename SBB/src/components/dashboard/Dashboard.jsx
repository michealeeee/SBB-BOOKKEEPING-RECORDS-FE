import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  addDaysISO,
  formatMoney,
  formatWeekRange,
  formatWeekdayDate,
  inWeek,
  startOfWeekISO,
  summarizeLedger,
  todayISO,
} from "../../utils/format";
import LineChart from "./LineChart";
import IncomeExpenseChart from "./IncomeExpenseChart";
import SummaryBoxes from "./SummaryBoxes";

const VIEWS = [
  { id: "all", label: "All" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
];

const emptyForm = (date = todayISO()) => ({
  date,
  description: "",
  category: "Sales",
  type: "income",
  amount: "",
});

export default function Dashboard() {
  const { totals, user, transactions, addTransaction } = useApp();
  const name = user?.name || "there";
  const [view, setView] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [form, setForm] = useState(() => emptyForm());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const weekStart = startOfWeekISO(selectedDate);
  const weekEnd = addDaysISO(weekStart, 6);

  const alignFormDate = (nextView, nextSelected) => {
    const start = startOfWeekISO(nextSelected);
    setForm((current) => {
      if (nextView === "daily") return { ...current, date: nextSelected };
      if (nextView === "weekly" && !inWeek(current.date, start)) {
        return { ...current, date: nextSelected };
      }
      return current;
    });
  };

  const changeView = (nextView) => {
    setView(nextView);
    setError("");
    setSuccess("");
    alignFormDate(nextView, selectedDate);
  };

  const changeSelectedDate = (date) => {
    const next = date || todayISO();
    setSelectedDate(next);
    alignFormDate(view, next);
  };

  const periodRows = useMemo(() => {
    if (view === "daily") return transactions.filter((item) => item.date === selectedDate);
    if (view === "weekly") return transactions.filter((item) => inWeek(item.date, weekStart));
    return transactions;
  }, [transactions, view, selectedDate, weekStart]);

  const periodTotals = view === "all" ? totals : summarizeLedger(periodRows);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.description.trim() || !form.amount) {
      setError("Description and amount are required.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (view === "daily" && form.date !== selectedDate) {
      setError("Daily view records on the selected day.");
      return;
    }
    if (view === "weekly" && !inWeek(form.date, weekStart)) {
      setError("Pick a date in the selected week.");
      return;
    }
    addTransaction({
      ...form,
      description: form.description.trim(),
      amount: Number(form.amount),
    });
    setForm(emptyForm(view === "all" ? todayISO() : form.date));
    setSuccess(
      view === "daily"
        ? `Recorded for ${formatWeekdayDate(form.date)}.`
        : view === "weekly"
          ? `Recorded in the week of ${formatWeekRange(weekStart)}.`
          : "Transaction added to this demo session."
    );
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Welcome back, {name}. Record and review the books by day or week.
        </p>
      </header>
      <div className="record-bar">
        <span>Record by</span>
        <div className="view-toggle" role="tablist" aria-label="Dashboard period">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={view === item.id}
              className={view === item.id ? "is-active" : undefined}
              onClick={() => changeView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {view !== "all" ? (
        <section className="panel period-panel">
          <div className="period-nav">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                changeSelectedDate(
                  addDaysISO(view === "daily" ? selectedDate : weekStart, view === "daily" ? -1 : -7)
                )
              }
            >
              Previous {view === "daily" ? "day" : "week"}
            </button>
            <div className="field">
              <label htmlFor="dash-period">{view === "daily" ? "Day" : "Week of"}</label>
              <input
                id="dash-period"
                type="date"
                value={selectedDate}
                onChange={(e) => changeSelectedDate(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                changeSelectedDate(
                  addDaysISO(view === "daily" ? selectedDate : weekStart, view === "daily" ? 1 : 7)
                )
              }
            >
              Next {view === "daily" ? "day" : "week"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => changeSelectedDate(todayISO())}>
              Today
            </button>
          </div>
          <p className="period-label">
            {view === "daily" ? formatWeekdayDate(selectedDate) : `Week of ${formatWeekRange(weekStart)}`}
          </p>
        </section>
      ) : null}

      <div className="stats-grid">
        <article className="stat-card income">
          <span>Income</span>
          <strong className="num">{formatMoney(periodTotals.income)}</strong>
        </article>
        <article className="stat-card expense">
          <span>Expenses</span>
          <strong className="num">{formatMoney(periodTotals.expenses)}</strong>
        </article>
        <article className="stat-card net">
          <span>Net profit</span>
          <strong className="num">{formatMoney(periodTotals.net)}</strong>
        </article>
        <article className="stat-card open">
          <span>{view === "all" ? "Open invoices" : "Entries"}</span>
          <strong className="num">
            {view === "all" ? formatMoney(totals.outstanding) : periodRows.length}
          </strong>
        </article>
      </div>

      <section className="panel">
        <h2>Add transaction</h2>
        <p className="muted form-hint">
          {view === "daily"
            ? `Recording for ${formatWeekdayDate(selectedDate)}.`
            : view === "weekly"
              ? `Recording in the week of ${formatWeekRange(weekStart)}.`
              : "Add an income or expense line to the full ledger."}
        </p>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="dash-date">Date</label>
            <input
              id="dash-date"
              type="date"
              min={view === "weekly" ? weekStart : undefined}
              max={view === "weekly" ? weekEnd : undefined}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="dash-desc">Description</label>
            <input
              id="dash-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Client payment"
            />
          </div>
          <div className="field">
            <label htmlFor="dash-cat">Category</label>
            <input
              id="dash-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="dash-type">Type</label>
            <select
              id="dash-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="dash-amt">Amount</label>
            <input
              id="dash-amt"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>

      {view === "all" ? (
        <div className="charts-row">
          <LineChart />
          <IncomeExpenseChart />
        </div>
      ) : null}

      <SummaryBoxes entries={periodRows} />
    </div>
  );
}
