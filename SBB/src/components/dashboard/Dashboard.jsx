import StatCard from "./StatCard";
import LineChart from "./LineChart";
import CashFlow from "./CashFlow";
import SummaryBoxes from "./SummaryBoxes";
import IncomeExpenseChart from "./IncomeExpenseChart";

import "../../styles/dashboard.css";


export default function Dashboard() {

  return (

    <div className="dashboard-page">


      {/* Dashboard Title */}

      <h1>
        Dashboard
      </h1>



      {/* Statistics Cards */}

      <div className="dashboard-stats-grid">


        <StatCard
          title="Income"
          value="$24,250"
          color="green"
        />


        <StatCard
          title="Expenses"
          value="$8,320"
          color="red"
        />


        <StatCard
          title="Net Profit"
          value="$15,930"
          color="blue"
        />


        <StatCard
          title="Invoices"
          value="$5,600"
          color="orange"
        />


      </div>




      {/* Cash Flow Chart */}

      <div className="dashboard-chart-section">

        <CashFlow />

      </div>




      {/* Line Chart */}

      <div className="dashboard-chart-section">

        <LineChart />

      </div>




      {/* Income vs Expense Chart */}

      <div className="dashboard-chart-section">

        <IncomeExpenseChart />

      </div>




      {/* Summary */}

      <div className="dashboard-chart-section">

        <SummaryBoxes />

      </div>



    </div>

  );

}