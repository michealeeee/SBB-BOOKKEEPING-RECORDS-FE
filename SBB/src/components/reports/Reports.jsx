import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import IncomeExpenseChart from "../dashboard/IncomeExpenseChart";

export default function Reports() {
  const { totals, transactions, invoices, expenses } = useApp();

  const downloadCsv = () => {
    const rows = [
      ["Type", "Date", "Description", "Amount"],
      ...transactions.map((item) => [
        item.type,
        item.date,
        item.description,
        item.amount,
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookkeeply-demo-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <h1>Reports</h1>
          <p>
            A local profit-and-loss snapshot from demo records. This is not a
            filed tax or accounting report.
          </p>
        </div>
        <button type="button" className="btn" onClick={downloadCsv}>
          Download CSV
        </button>
      </header>

      <div className="stat-pills">
        <div className="stat-pill">Income {formatMoney(totals.income)}</div>
        <div className="stat-pill">Expenses {formatMoney(totals.expenses)}</div>
        <div className="stat-pill">Net {formatMoney(totals.net)}</div>
        <div className="stat-pill">
          Open invoices {formatMoney(totals.outstanding)}
        </div>
      </div>

      <div className="dashboard-charts-row">
        <section className="panel">
          <h2>Profit &amp; loss</h2>
          <div className="summary-item">
            <span>Income transactions</span>
            <span>{transactions.filter((item) => item.type === "income").length}</span>
          </div>
          <div className="summary-item">
            <span>Expense transactions</span>
            <span>{transactions.filter((item) => item.type === "expense").length}</span>
          </div>
          <div className="summary-item">
            <span>Expense records</span>
            <span>{expenses.length}</span>
          </div>
          <div className="summary-item">
            <span>Invoices</span>
            <span>{invoices.length}</span>
          </div>
        </section>
        <IncomeExpenseChart />
      </div>
    </div>
  );
}
