import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import LineChart from "./LineChart";
import IncomeExpenseChart from "./IncomeExpenseChart";
import SummaryBoxes from "./SummaryBoxes";

export default function Dashboard() {
  const { totals, user } = useApp();

  return (
    <div className="app-page">
      <header className="page-header">
        <p>Welcome back, {user.name}. These figures come from the books stored in this browser.</p>
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

      <SummaryBoxes />
    </div>
  );
}
