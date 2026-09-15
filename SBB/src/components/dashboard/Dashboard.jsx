import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import LineChart from "./LineChart";
import IncomeExpenseChart from "./IncomeExpenseChart";
import SummaryBoxes from "./SummaryBoxes";

export default function Dashboard() {
  const { totals, user } = useApp();
  const name = user?.name || "there";

  return (
    <div className="app-page">
      <header className="page-header">
        <p>
          Welcome back, {name}. This page is the snapshot of your books. Use the
          menu across the top to open each register.
        </p>
      </header>

      <section className="panel dash-guide" aria-labelledby="dash-walkthrough">
        <h2 id="dash-walkthrough">Dashboard walkthrough</h2>
        <ol>
          <li>
            <strong>Income</strong> is money already posted to the ledger
            (sales and other inflows from Transactions).
          </li>
          <li>
            <strong>Expenses</strong> is money going out. Add bills on Expenses
            and they also hit the ledger.
          </li>
          <li>
            <strong>Net profit</strong> is income minus expenses — your books
            result.
          </li>
          <li>
            <strong>Open invoices</strong> is what customers still owe. Collect
            it from Invoices.
          </li>
          <li>
            The <strong>cash flow</strong> chart is the last six months of
            ledger totals. The ring chart splits income vs expenses.
          </li>
          <li>
            <strong>Recent entries</strong> and <strong>unpaid invoices</strong>{" "}
            are shortcuts into the ledger and sales list.
          </li>
        </ol>
      </section>

      <div className="stats-grid">
        <article className="stat-card income">
          <span>1 · Income</span>
          <strong className="num">{formatMoney(totals.income)}</strong>
        </article>
        <article className="stat-card expense">
          <span>2 · Expenses</span>
          <strong className="num">{formatMoney(totals.expenses)}</strong>
        </article>
        <article className="stat-card net">
          <span>3 · Net profit</span>
          <strong className="num">{formatMoney(totals.net)}</strong>
        </article>
        <article className="stat-card open">
          <span>4 · Open invoices</span>
          <strong className="num">{formatMoney(totals.outstanding)}</strong>
        </article>
      </div>

      <div className="charts-row">
        <LineChart />
        <IncomeExpenseChart />
      </div>

      <SummaryBoxes />
    </div>
  );
}
