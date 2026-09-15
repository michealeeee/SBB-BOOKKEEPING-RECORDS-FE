import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { csvCell, formatMoney } from "../../utils/format";
import LineChart from "../dashboard/LineChart";
import IncomeExpenseChart from "../dashboard/IncomeExpenseChart";

function groupByCategory(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = item.category || "Uncategorized";
    map.set(key, (map.get(key) || 0) + Number(item.amount || 0));
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export default function Reports() {
  const { totals, transactions, invoices } = useApp();
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
    return Object.entries(groups).filter(([, amount]) => amount > 0);
  }, [invoices]);

  const downloadCsv = () => {
    const rows = [
      ["Type", "Date", "Description", "Category", "Amount (GHS)"],
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
    <div className="app-page">
      <header className="page-header">
        <p>Profit and loss from the local ledger. This is not a filed report.</p>
        <button type="button" className="btn" onClick={downloadCsv}>
          Download CSV
        </button>
      </header>

      <div className="stats-grid">
        <article className="stat-card income">
          <span>Income</span>
          <strong className="num">{formatMoney(totals.income)}</strong>
        </article>
        <article className="stat-card expense">
          <span>Expenses</span>
          <strong className="num">{formatMoney(totals.expenses)}</strong>
        </article>
        <article className="stat-card net">
          <span>Net profit</span>
          <strong className="num">{formatMoney(totals.net)}</strong>
        </article>
        <article className="stat-card open">
          <span>Open invoices</span>
          <strong className="num">{formatMoney(totals.outstanding)}</strong>
        </article>
      </div>

      <div className="charts-row">
        <LineChart />
        <IncomeExpenseChart />
      </div>

      <div className="summary-grid">
        <section className="panel">
          <h2>Profit &amp; loss</h2>
          <table className="data-table pl-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeRows.map(([name, amount]) => (
                <tr key={`in-${name}`}>
                  <td>{name}</td>
                  <td className="num amount-pos">{formatMoney(amount)}</td>
                </tr>
              ))}
              {expenseRows.map(([name, amount]) => (
                <tr key={`ex-${name}`}>
                  <td>{name}</td>
                  <td className="num amount-neg">{formatMoney(amount)}</td>
                </tr>
              ))}
              <tr className="pl-total">
                <td>Net profit</td>
                <td className={`num ${totals.net >= 0 ? "amount-pos" : "amount-neg"}`}>
                  {formatMoney(totals.net)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h2>Invoices</h2>
          {invoiceMix.length ? (
            <ul className="list">
              {invoiceMix.map(([status, amount]) => (
                <li key={status}>
                  <span>{status}</span>
                  <span className="num">{formatMoney(amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No invoices yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
