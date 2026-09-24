import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { userLabel } from "../../utils/entities";
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

function PeriodTable({ rows }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Type</th>
          <th className="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => (
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function pickLedgerDate(items) {
  const today = todayISO();
  if (items.some((item) => item.date === today)) return today;
  if (items.length === 0) return today;
  return items.reduce((max, item) => (item.date > max ? item.date : max), items[0].date);
}

export default function Dashboard() {
  const { totals, user, transactions, addTransaction } = useApp();
  const name = userLabel(user);
  const [view, setView] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(() => pickLedgerDate(transactions));
  const [form, setForm] = useState(() => emptyForm(pickLedgerDate(transactions)));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const weekStart = startOfWeekISO(selectedDate);
  const weekEnd = addDaysISO(weekStart, 6);

  const latestDate = useMemo(() => {
    if (transactions.length === 0) return "";
    return transactions.reduce((max, item) => (item.date > max ? item.date : max), "");
  }, [transactions]);

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

  const dailyRows = useMemo(
    () => transactions.filter((item) => item.date === selectedDate),
    [transactions, selectedDate]
  );
  const weeklyRows = useMemo(
    () => transactions.filter((item) => inWeek(item.date, weekStart)),
    [transactions, weekStart]
  );
  const periodRows = view === "daily" ? dailyRows : view === "weekly" ? weeklyRows : transactions;

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
                      : "Recorded on this business."
    );
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Welcome back, {name}. Income and expenses below belong to this business.
        </p>
      </header>
      <div className="record-bar">
        <span>Show</span>
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

      <section className="panel period-panel">
        <div className="period-nav">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => changeSelectedDate(addDaysISO(selectedDate, -1))}
          >
            Previous day
          </button>
          <div className="field">
            <label htmlFor="dash-period">Day</label>
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
            onClick={() => changeSelectedDate(addDaysISO(selectedDate, 1))}
          >
            Next day
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => changeSelectedDate(todayISO())}>
            Today
          </button>
          {latestDate ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => changeSelectedDate(latestDate)}
            >
              Latest entry
            </button>
          ) : null}
        </div>
        <p className="period-label">
          {formatWeekdayDate(selectedDate)} · Week of {formatWeekRange(weekStart)}
        </p>
      </section>

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

      <section className="panel ledger-panel" id="daily-transactions">
        <h2>Daily books</h2>
        <p className="muted form-hint">{formatWeekdayDate(selectedDate)}</p>
        {dailyRows.length === 0 ? (
          <div className="empty-ledger">
            <p className="empty-state">No income or expenses on this day.</p>
            {latestDate && latestDate !== selectedDate ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => changeSelectedDate(latestDate)}
              >
                Show latest entry ({formatDate(latestDate)})
              </button>
            ) : null}
          </div>
        ) : (
          <PeriodTable rows={dailyRows} />
        )}
      </section>

      <section className="panel ledger-panel" id="weekly-transactions">
        <h2>Weekly books</h2>
        <p className="muted form-hint">Week of {formatWeekRange(weekStart)}</p>
        {weeklyRows.length === 0 ? (
          <div className="empty-ledger">
            <p className="empty-state">No income or expenses recorded this week.</p>
            {latestDate && !inWeek(latestDate, weekStart) ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => changeSelectedDate(latestDate)}
              >
                Show week of latest entry
              </button>
            ) : null}
          </div>
        ) : (
          <div className="week-groups">
            {weekDaysISO(weekStart).map((date) => {
              const items = weeklyRows.filter((item) => item.date === date);
              if (items.length === 0) return null;
              return (
                <div className="week-day" key={date}>
                  <h3>{formatWeekdayDate(date)}</h3>
                  <PeriodTable rows={items} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Add income or expense</h2>
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

      {view === "all" ? (
        <section className="panel ledger-panel">
          <h2>All income and expenses</h2>
          {transactions.length === 0 ? (
            <p className="empty-state">No records yet.</p>
          ) : (
            <>
              {transactions.length > 12 ? (
                <p className="muted form-hint">Showing the 12 most recent entries.</p>
              ) : null}
              <PeriodTable rows={transactions.slice(0, 12)} />
            </>
          )}
        </section>
      ) : null}

      <SummaryBoxes />
    </div>
  );
}
