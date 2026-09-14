import StatCard from "./StatCard";
import LineChart from "./LineChart";
import IncomeExpenseChart from "./IncomeExpenseChart";
import SummaryBoxes from "./SummaryBoxes";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";
import "../../styles/dashboard.css";

export default function Dashboard() {
  const { totals, user } = useApp();

  return (
    <div className="dashboard-page app-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user.name}. Figures below are demo data stored in this browser.</p>
        </div>
      </header>

      <div className="dashboard-stats-grid">
        <StatCard title="Income" value={formatMoney(totals.income)} color="green" />
        <StatCard title="Expenses" value={formatMoney(totals.expenses)} color="red" />
        <StatCard title="Net Profit" value={formatMoney(totals.net)} color="blue" />
        <StatCard title="Open invoices" value={formatMoney(totals.outstanding)} color="orange" />
      </div>

      <div className="dashboard-charts-row">
        <LineChart />
        <IncomeExpenseChart />
      </div>

      <SummaryBoxes />
    </div>
  );
}
