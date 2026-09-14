import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useApp } from "../../context/AppContext";
import { lastSixMonths, monthKey } from "../../utils/format";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart() {
  const { transactions } = useApp();
  const months = lastSixMonths();

  const income = months.map((month) =>
    transactions
      .filter((item) => item.type === "income" && monthKey(item.date) === month.key)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  );
  const expenses = months.map((month) =>
    transactions
      .filter((item) => item.type === "expense" && monthKey(item.date) === month.key)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  );

  const data = {
    labels: months.map((month) => month.label),
    datasets: [
      {
        label: "Income",
        data: income,
        borderColor: "#1b6b4a",
        backgroundColor: "rgba(27,107,74,0.12)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Expenses",
        data: expenses,
        borderColor: "#b42318",
        backgroundColor: "rgba(180,35,24,0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="chart-box">
      <h3>Cash flow</h3>
      <div className="chart-frame">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
