import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  addDaysISO,
  formatDate,
  formatMoney,
  formatWeekRange,
  formatWeekdayDate,
  inWeek,
  startOfWeekISO,
  todayISO,
} from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const VIEWS = [
  { id: "all", label: "All" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
];

const emptyForm = (date = todayISO()) => ({
  name: "",
  amount: "",
  category: "",
  date,
});

export default function Expenses() {
  const { expenses, addExpense, removeExpense } = useApp();
  const [view, setView] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [form, setForm] = useState(() => emptyForm());
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const weekStart = startOfWeekISO(selectedDate);
  const weekEnd = addDaysISO(weekStart, 6);

  const alignFormDate = (nextView, nextSelected) => {
    const start = startOfWeekISO(nextSelected);
    setForm((current) => {
      if (nextView === "daily") {
        return { ...current, date: nextSelected };
      }
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

  const visible = useMemo(() => {
    return expenses.filter((item) => {
      const matchesQuery = `${item.name} ${item.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      if (!matchesQuery) return false;
      if (view === "daily") return item.date === selectedDate;
      if (view === "weekly") return inWeek(item.date, weekStart);
      return true;
    });
  }, [expenses, query, view, selectedDate, weekStart]);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.amount) {
      setError("Expense name and amount are required.");
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
    addExpense({
      ...form,
      name: form.name.trim(),
      amount: Number(form.amount),
    });
    setForm(emptyForm(view === "all" ? todayISO() : form.date));
    setSuccess(
      view === "daily"
        ? `Expense recorded for ${formatWeekdayDate(form.date)}.`
        : view === "weekly"
          ? `Expense recorded in the week of ${formatWeekRange(weekStart)}.`
          : "Expense added to this demo session."
    );
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Track operating costs by day or week. New expenses are also posted to the ledger.</p>
      </header>
      <div className="record-bar">
        <span>Record by</span>
        <div className="view-toggle" role="tablist" aria-label="Expense period">
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
              <label htmlFor="exp-period">{view === "daily" ? "Day" : "Week of"}</label>
              <input
                id="exp-period"
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

      <section className="panel">
        <h2>Add expense</h2>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="exp-name">Name</label>
            <input
              id="exp-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="exp-amount">Amount</label>
            <input
              id="exp-amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="exp-cat">Category</label>
            <input
              id="exp-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="exp-date">Date</label>
            <input
              id="exp-date"
              type="date"
              min={view === "weekly" ? weekStart : undefined}
              max={view === "weekly" ? weekEnd : undefined}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="exp-search">Search</label>
            <input
              id="exp-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search expenses"
            />
          </div>
        </div>
        <div className="table-wrap">
          {visible.length === 0 ? (
            <p className="empty-state">
              {view === "daily"
                ? "No expenses recorded on this day."
                : view === "weekly"
                  ? "No expenses recorded this week."
                  : "No expenses to show."}
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="num">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category || "—"}</td>
                    <td>{formatDate(item.date)}</td>
                    <td className="num">{formatMoney(item.amount)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => setPendingDelete(item)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove expense?"
        message="This only updates demo data in this browser."
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeExpense(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
