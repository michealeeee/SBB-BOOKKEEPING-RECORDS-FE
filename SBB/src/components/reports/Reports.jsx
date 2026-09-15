import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { csvCell, formatMoney, lastSixMonths, monthKey } from "../../utils/format";
import LineChart from "../dashboard/LineChart";
import CategoryBarChart from "./CategoryBarChart";
import DonutChart from "./DonutChart";

function groupByCategory(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = item.category || "Uncategorized";
    map.set(key, (map.get(key) || 0) + Number(item.amount || 0));
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function share(part, whole) {
  if (!whole) return 0;
  return Math.min(100, Math.round((Number(part) / Number(whole)) * 100));
}

function monthSum(transactions, type, key) {
  return transactions
    .filter((item) => item.type === type && monthKey(item.date) === key)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

export default function Reports() {
  const { totals, transactions, invoices, expenses } = useApp();
  const months = lastSixMonths();
  const thisKey = months[months.length - 1]?.key;
  const lastKey = months[months.length - 2]?.key;

  const incomeRows = useMemo(
    () => groupByCategory(transactions.filter((item) => item.type === "income")),
    [transactions]
  );
  const expenseRows = useMemo(
    () => groupByCategory(transactions.filter((item) => item.type === "expense")),
    [transactions]
  );

  const invoiceMix = useMemo(() => {
    const groups = { Paid: 0, Sent: 0, Overdue: 0, Draft: 0 };
    invoices.forEach((item) => {
      const status = groups[item.status] !== undefined ? item.status : "Sent";
      groups[status] += Number(item.amount || 0);
    });
    return Object.entries(groups);
  }, [invoices]);

  const invoiceTotal = invoiceMix.reduce((sum, [, amount]) => sum + amount, 0);
  const activity = totals.income + totals.expenses;
  const margin = totals.income ? (totals.net / totals.income) * 100 : 0;
  const thisIncome = monthSum(transactions, "income", thisKey);
  const lastIncome = monthSum(transactions, "income", lastKey);
  const incomeDelta = thisIncome - lastIncome;

  const sparkMax = Math.max(
    1,
    ...months.map(
      (month) =>
        monthSum(transactions, "income", month.key) +
        monthSum(transactions, "expense", month.key)
    )
  );

  const downloadCsv = () => {
    const rows = [
      ["Type", "Date", "Description", "Category", "Amount"],
      ...transactions.map((item) => [
        item.type,
        item.date,
        item.description,
        item.category,
        item.amount,
      ]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookkeeply-ledger.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-page reports-page">
      <section className="report-hero">
        <div className="report-hero-copy">
          <p className="eyebrow">Profit and loss</p>
          <strong className={`report-hero-net ${totals.net >= 0 ? "is-up" : "is-down"}`}>
            {formatMoney(totals.net)}
          </strong>
          <p>
            Net from the local ledger · {share(totals.income, activity)}% income,{" "}
            {share(totals.expenses, activity)}% expenses. This is not a filed report.
          </p>
        </div>
        <button type="button" className="btn" onClick={downloadCsv}>
          Download CSV
        </button>
        <div className="report-hero-metrics">
          <div>
            <span>Income</span>
            <b>{formatMoney(totals.income)}</b>
          </div>
          <div>
            <span>Expenses</span>
            <b>{formatMoney(totals.expenses)}</b>
          </div>
          <div>
            <span>Margin</span>
            <b>{margin.toFixed(1)}%</b>
          </div>
          <div>
            <span>Open invoices</span>
            <b>{formatMoney(totals.outstanding)}</b>
          </div>
        </div>
        <div className="mix-bar" aria-hidden="true">
          <span
            className="mix-fill income"
            style={{ width: `${share(totals.income, activity)}%` }}
          />
          <span
            className="mix-fill expense"
            style={{ width: `${share(totals.expenses, activity)}%` }}
          />
        </div>
      </section>

      <div className="charts-row">
        <section className="panel mix-panel">
          <h2>Last six months</h2>
          <p className="muted">
            {incomeDelta >= 0 ? "+" : "−"}
            {formatMoney(Math.abs(incomeDelta))} income vs the prior month.
          </p>
          <div className="spark" aria-hidden="true">
            {months.map((month) => {
              const income = monthSum(transactions, "income", month.key);
              const expense = monthSum(transactions, "expense", month.key);
              return (
                <div className="spark-col" key={month.key}>
                  <div className="spark-bars">
                    <span
                      className="spark-up"
                      style={{
                        height: income ? `${(income / sparkMax) * 100}%` : "3px",
                        opacity: income ? 1 : 0.25,
                      }}
                    />
                    <span
                      className="spark-down"
                      style={{
                        height: expense ? `${(expense / sparkMax) * 100}%` : "3px",
                        opacity: expense ? 1 : 0.25,
                      }}
                    />
                  </div>
                  <em>{month.label}</em>
                </div>
              );
            })}
          </div>
        </section>
        <DonutChart
          title="Income vs expenses"
          labels={["Income", "Expenses"]}
          values={[totals.income || 0, totals.expenses || 0]}
          colors={["#1b6b4a", "#b42318"]}
          centerValue={`${margin.toFixed(0)}%`}
          centerLabel="margin"
        />
      </div>

      <div className="charts-row">
        <LineChart />
        <CategoryBarChart title="Income by category" rows={incomeRows} />
      </div>

      <div className="charts-row">
        <section className="panel pl-panel">
          <h2>Profit &amp; loss</h2>
          <table className="data-table pl-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Share</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="pl-section">
                <td colSpan={3}>
                  <strong>Income</strong>
                </td>
              </tr>
              {incomeRows.length ? (
                incomeRows.map(([name, amount]) => (
                  <tr key={`in-${name}`}>
                    <td>{name}</td>
                    <td>
                      <div className="meter" aria-hidden="true">
                        <span
                          className="meter-fill income"
                          style={{ width: `${share(amount, totals.income)}%` }}
                        />
                      </div>
                      <span className="muted">{share(amount, totals.income)}%</span>
                    </td>
                    <td className="num amount-pos">{formatMoney(amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="muted">
                    No income lines yet.
                  </td>
                </tr>
              )}
              <tr className="pl-section">
                <td colSpan={3}>
                  <strong>Expenses</strong>
                </td>
              </tr>
              {expenseRows.length ? (
                expenseRows.map(([name, amount]) => (
                  <tr key={`ex-${name}`}>
                    <td>{name}</td>
                    <td>
                      <div className="meter" aria-hidden="true">
                        <span
                          className="meter-fill expense"
                          style={{ width: `${share(amount, totals.expenses)}%` }}
                        />
                      </div>
                      <span className="muted">{share(amount, totals.expenses)}%</span>
                    </td>
                    <td className="num amount-neg">{formatMoney(amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="muted">
                    No expense lines yet.
                  </td>
                </tr>
              )}
              <tr className="pl-total">
                <td>Net profit</td>
                <td />
                <td className={`num ${totals.net >= 0 ? "amount-pos" : "amount-neg"}`}>
                  {formatMoney(totals.net)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="panel">
          <DonutChart
            title="Invoices by status"
            framed={false}
            labels={invoiceMix.map(([status]) => status)}
            values={invoiceMix.map(([, amount]) => amount)}
            colors={["#1b6b4a", "#3d6b52", "#b42318", "#b45309"]}
            centerValue={String(invoices.length)}
            centerLabel="invoices"
          />
          <div className="status-legend">
            {invoiceMix.map(([status, amount]) => (
              <span className={`status-chip status-${status.toLowerCase()}`} key={status}>
                {status} · {formatMoney(amount)}
              </span>
            ))}
          </div>
          {invoiceMix.map(([status, amount]) => (
            <div className="mix-row" key={status}>
              <span>{status}</span>
              <div className="meter meter-wide" aria-hidden="true">
                <span
                  className={`meter-fill status-${status.toLowerCase()}`}
                  style={{ width: `${share(amount, invoiceTotal)}%` }}
                />
              </div>
              <span className="num">{share(amount, invoiceTotal)}%</span>
            </div>
          ))}
          <p className="muted">
            {expenses.length} expense records · {formatMoney(totals.outstanding)} still open
          </p>
        </section>
      </div>
    </div>
  );
}
