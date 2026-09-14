import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useApp } from "../../context/AppContext";
import { formatMoney } from "../../utils/format";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeExpenseChart() {
  const { totals } = useApp();

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [totals.income || 0, totals.expenses || 0],
        backgroundColor: ["#1b6b4a", "#b42318"],
        borderColor: "#ffffff",
        borderWidth: 2,
        cutout: "68%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.label}: ${formatMoney(context.raw)}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-box">
      <h3>Income vs expenses</h3>
      <div className="chart-frame">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
