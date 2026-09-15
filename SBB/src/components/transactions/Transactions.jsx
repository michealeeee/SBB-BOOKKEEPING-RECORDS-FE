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
  summarizeLedger,
  todayISO,
  weekDaysISO,
} from "../../utils/format";
import ConfirmDialog from "../ConfirmDialog";

const emptyForm = () => ({
  date: todayISO(),
  description: "",
  category: "Sales",
  type: "income",
  amount: "",
});

const VIEWS = [
  { id: "all", label: "All" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
];

function LedgerTable({ items, emptyMessage, onRemove }) {
  if (items.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Type</th>
          <th className="num">Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{formatDate(item.date)}</td>
            <td>{item.description}</td>
            <td>{item.category}</td>
            <td>
              <span className={`badge badge-${item.type}`}>{item.type}</span>
            </td>
            <td className={`num ${item.type === "income" ? "amount-pos" : "amount-neg"}`}>
              {formatMoney(item.amount)}
            </td>
            <td>
              <button type="button" className="btn-ghost" onClick={() => onRemove(item)}>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Transactions() {
  const { transactions, addTransaction, removeTransaction } = useApp();
  const [view, setView] = useState("all");
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const weekStart = startOfWeekISO(selectedDate);
  const weekEnd = addDaysISO(weekStart, 6);

  const alignFormDate = (nextView, nextSelected) => {
    const start = startOfWeekISO(nextSelected);
    setForm((current) => {
      if (nextView === "daily") {
        return current.date === nextSelected ? current : { ...current, date: nextSelected };
      }
      if (nextView === "weekly") {
        if (inWeek(current.date, start)) return current;
        const today = todayISO();
        const nextDate = inWeek(today, start) ? today : start;
        return { ...current, date: nextDate };
      }
      return current;
    });
  };

  const changeView = (nextView) => {
    setView(nextView);
    setSuccess("");
    setError("");
    alignFormDate(nextView, selectedDate);
  };

  const changeSelectedDate = (date) => {
    const next = date || todayISO();
    setSelectedDate(next);
    alignFormDate(view, next);
  };

  const searched = useMemo(() => {
    return transactions.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const haystack = `${item.description} ${item.category}`.toLowerCase();
      return matchesType && haystack.includes(query.trim().toLowerCase());
    });
  }, [transactions, query, typeFilter]);

  const periodRows = useMemo(() => {
    if (view === "daily") {
      return searched.filter((item) => item.date === selectedDate);
    }
    if (view === "weekly") {
      return searched.filter((item) => inWeek(item.date, weekStart));
    }
    return searched;
  }, [searched, view, selectedDate, weekStart]);

  const totals = useMemo(() => summarizeLedger(periodRows), [periodRows]);
  const weekGroups = useMemo(
    () =>
      weekDaysISO(weekStart).map((date) => ({
        date,
        items: periodRows.filter((item) => item.date === date),
      })),
    [weekStart, periodRows]
  );

  const setFormDate = (date) => {
    setForm((current) => ({ ...current, date }));
    if (view !== "all") setSelectedDate(date);
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.description.trim() || !form.amount) {
      setError("Add a description and amount.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    addTransaction({
      ...form,
      amount: Number(form.amount),
      description: form.description.trim(),
    });
    const keepDate = view === "all" ? todayISO() : form.date;
    setForm({ ...emptyForm(), date: keepDate });
    if (view === "daily") {
      setSuccess(`Recorded for ${formatWeekdayDate(form.date)}.`);
    } else if (view === "weekly") {
      setSuccess(`Recorded in the week of ${formatWeekRange(weekStart)}.`);
    } else {
      setSuccess("Transaction added to this demo session.");
    }
  };

  const formHint =
    view === "daily"
      ? `Recording for ${formatWeekdayDate(selectedDate)}.`
      : view === "weekly"
        ? `Recording in the week of ${formatWeekRange(weekStart)}. Pick any date in this week.`
        : "Add an income or expense line to the full ledger.";

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Record income and expenses by day or week. Your ledger is saved in this browser.</p>
        <div className="view-toggle" role="tablist" aria-label="Ledger period">
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
      </header>

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
            {view === "daily" ? (
              <div className="field">
                <label htmlFor="txn-day">Day</label>
                <input
                  id="txn-day"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => changeSelectedDate(e.target.value)}
                />
              </div>
            ) : (
              <div className="field">
                <label htmlFor="txn-week">Week of</label>
                <input
                  id="txn-week"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => changeSelectedDate(e.target.value)}
                />
              </div>
            )}
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
          <div className="stats-grid period-stats">
            <article className="stat-card income">
              <span>Income</span>
              <strong>{formatMoney(totals.income)}</strong>
            </article>
            <article className="stat-card expense">
              <span>Expenses</span>
              <strong>{formatMoney(totals.expenses)}</strong>
            </article>
            <article className="stat-card net">
              <span>Net</span>
              <strong>{formatMoney(totals.net)}</strong>
            </article>
          </div>
        </section>
      ) : null}

      <section className="panel">
        <h2>Add transaction</h2>
        <p className="muted form-hint">{formHint}</p>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {success ? <p className="form-success" role="status">{success}</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <div className="field">
            <label htmlFor="txn-date">Date</label>
            <input
              id="txn-date"
              type="date"
              min={view === "weekly" ? weekStart : undefined}
              max={view === "weekly" ? weekEnd : undefined}
              value={form.date}
              onChange={(e) => setFormDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="txn-desc">Description</label>
            <input
              id="txn-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Client payment"
            />
          </div>
          <div className="field">
            <label htmlFor="txn-cat">Category</label>
            <input
              id="txn-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="txn-type">Type</label>
            <select
              id="txn-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="txn-amt">Amount</label>
            <input
              id="txn-amt"
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

      <section className="panel">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="txn-search">Search</label>
            <input
              id="txn-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search description or category"
            />
          </div>
          <div className="field">
            <label htmlFor="txn-filter">Filter</label>
            <select
              id="txn-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {view === "weekly" ? (
          periodRows.length === 0 ? (
            <p className="empty-state">No transactions recorded this week.</p>
          ) : (
            <div className="week-groups">
              {weekGroups.map((group) => (
                <div className="week-day" key={group.date}>
                  <h3>
                    {formatWeekdayDate(group.date)}
                    <span className="muted">
                      {" "}
                      · {group.items.length} {group.items.length === 1 ? "line" : "lines"}
                    </span>
                  </h3>
                  <div className="table-wrap">
                    <LedgerTable
                      items={group.items}
                      emptyMessage="No lines on this day."
                      onRemove={setPendingDelete}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="table-wrap">
            <LedgerTable
              items={periodRows}
              emptyMessage={
                view === "daily"
                  ? "No transactions recorded on this day."
                  : "No transactions match this search."
              }
              onRemove={setPendingDelete}
            />
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove transaction?"
        message="This only removes it from the demo data in this browser."
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          removeTransaction(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
