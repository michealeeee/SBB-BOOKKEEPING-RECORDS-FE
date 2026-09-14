import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { csvCell, formatMoney } from "../../utils/format";
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
  const { totals, transactions, invoices, expenses } = useApp();
  const incomeRows = useMemo(
    () => groupByCategory(transactions.filter((item) => item.type === "income")),
    [transactions]
  );
  const expenseRows = useMemo(
    () => groupByCategory(transactions.filter((item) => item.type === "expense")),
    [transactions]
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
    <div className="app-page">
      <header className="page-header">
        <p>
          Profit and loss from the local ledger. This is not a filed accounting
          report.
        </p>
        <button type="button" className="btn" onClick={downloadCsv}>
          Download CSV
        </button>
      </header>

      <div className="stat-pills">
        <div className="stat-pill">Income {formatMoney(totals.income)}</div>
        <div className="stat-pill">Expenses {formatMoney(totals.expenses)}</div>
        <div className="stat-pill">Net {formatMoney(totals.net)}</div>
        <div className="stat-pill">Open invoices {formatMoney(totals.outstanding)}</div>
      </div>

      <div className="charts-row">
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
              <tr>
                <td colSpan={2}><strong>Income</strong></td>
              </tr>
              {incomeRows.map(([name, amount]) => (
                <tr key={`in-${name}`}>
                  <td>{name}</td>
                  <td className="num amount-pos">{formatMoney(amount)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}><strong>Expenses</strong></td>
              </tr>
              {expenseRows.map(([name, amount]) => (
                <tr key={`ex-${name}`}>
                  <td>{name}</td>
                  <td className="num amount-neg">{formatMoney(amount)}</td>
                </tr>
              ))}
              <tr className="pl-total">
                <td>Net profit</td>
                <td className="num">{formatMoney(totals.net)}</td>
              </tr>
            </tbody>
          </table>
          <p className="muted">
            {invoices.length} invoices · {expenses.length} expense records
          </p>
        </section>
        <IncomeExpenseChart />
      </div>
    </div>
  );
}
