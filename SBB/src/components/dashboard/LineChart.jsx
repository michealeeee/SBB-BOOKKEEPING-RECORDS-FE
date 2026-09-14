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
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [12000, 15000, 18000, 14000, 20000, 24000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.16)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: [8000, 9000, 11000, 10000, 12000, 13000],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.12)",
        tension: 0.4,
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
    <div className="chartBoxLarge">
      <h3>Cash Flow Overview</h3>
      <div className="line-chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
