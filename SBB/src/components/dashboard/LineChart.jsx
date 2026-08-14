import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function LineChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [12000, 15000, 18000, 14000, 20000, 24000],
        borderColor: "#2f80ed",
        backgroundColor: "rgba(47,128,237,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: [8000, 9000, 11000, 10000, 12000, 13000],
        borderColor: "#eb5757",
        backgroundColor: "rgba(235,87,87,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chartBoxLarge">

  <h3>Cash Flow Overview</h3>

  <div className="line-chart-wrapper">
    <Line 
      data={data} 
      options={options} 
    />
  </div>

</div>
  );
}